const Homey = require('homey');
const UnraidGraphQLClient = require('../../lib/graphql');

class UnraidDevice extends Homey.Device {
  async onInit() {
    this.log(`Device init: ${this.getName()}`);
    this.pollHandle = null;
    this.lastState = {
      arrayStarted: null,
      parityPercent: null,
      containers: {},
      vms: {},
      cpuPercent: null,
    };

    await this._applySettings(this.getSettings());
    this._schedulePoll();
    this._registerActionHandlers();
    this._registerConditionHandlers();
  }

  async onSettings({ newSettings }) {
    await this._applySettings(newSettings);
    this._schedulePoll(true);
  }

  async onUninit() {
    this._clearPoll();
  }

  _registerActionHandlers() {
    const driver = this.getDriver();
    driver.actions.startArray.registerRunListener(() => this._requireControl(() => this._mutation('mutation { array { start } }')));
    driver.actions.stopArray.registerRunListener(() => this._requireControl(() => this._mutation('mutation { array { stop } }')));
    driver.actions.startParity.registerRunListener(() => this._requireControl(() => this._mutation('mutation { array { parityCheck } }')));

    driver.actions.startContainer.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ docker { startContainer(name:$name) } }', { name: args.name })
    ));
    driver.actions.stopContainer.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ docker { stopContainer(name:$name) } }', { name: args.name })
    ));
    driver.actions.restartContainer.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ docker { restartContainer(name:$name) } }', { name: args.name })
    ));
    driver.actions.updateContainer.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ docker { pullContainer(name:$name) } }', { name: args.name })
    ));

    driver.actions.startVm.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ vms { start(name:$name) } }', { name: args.name })
    ));
    driver.actions.stopVm.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ vms { stop(name:$name) } }', { name: args.name })
    ));
    driver.actions.rebootVm.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ vms { reboot(name:$name) } }', { name: args.name })
    ));

    driver.actions.sendNotification.registerRunListener(async (args) => this._mutation(
      'mutation($message:String!){ notifications { send(message:$message, level:info) } }',
      { message: args.message }
    ));
  }

  _registerConditionHandlers() {
    const driver = this.getDriver();
    driver.conditions.arrayIsStarted.registerRunListener(() => Promise.resolve(this.lastState.arrayStarted === true));
    driver.conditions.containerIsRunning.registerRunListener((args) => Promise.resolve(
      this.lastState.containers?.[args.name]?.state === 'running'
    ));
    driver.conditions.vmIsRunning.registerRunListener((args) => Promise.resolve(
      this.lastState.vms?.[args.name]?.state === 'running'
    ));
  }

  _requireControl(fn) {
    if (!this.settings.allowControl) {
      throw new Error('Control actions are disabled in settings');
    }
    return fn();
  }

  async _applySettings(settings) {
    this.settings = settings;
    this.client = new UnraidGraphQLClient({ baseUrl: settings.baseUrl, apiKey: settings.apiKey });
    this.pollIntervalMs = Math.max(10, settings.pollInterval || 30) * 1000;
  }

  _schedulePoll(reset = false) {
    if (reset) this._clearPoll();
    if (this.pollHandle) return;
    this.pollHandle = this.homey.setInterval(() => this._poll().catch(err => this._handleError(err)), this.pollIntervalMs);
    this._poll().catch(err => this._handleError(err));
  }

  _clearPoll() {
    if (this.pollHandle) {
      this.homey.clearInterval(this.pollHandle);
      this.pollHandle = null;
    }
  }

  async _poll() {
    const query = this._buildQuery();
    const data = await this.client.request(query);
    this.setAvailable();
    this._updateState(data);
  }

  _buildQuery() {
    const { domains = {} } = this.settings;
    const parts = [];
    parts.push('system { uptime cpu { load } memory { used total } }');
    if (domains.pollArray) {
      parts.push('array { status parity { inProgress percent } disks { name temp smartStatus spunDown } cache { pools { name free used } } mover { running } }');
    }
    if (domains.pollDocker) {
      parts.push('docker { containers { name state restartCount } }');
    }
    if (domains.pollVms) {
      parts.push('vms { name state }');
    }
    if (domains.pollShares) {
      parts.push('shares { name free used }');
    }
    return `query { ${parts.join(' ')} }`;
  }

  _updateState(data) {
    const { system, array, docker, vms, shares } = data;

    if (system?.cpu?.load != null && system?.memory) {
      const cpuPercent = Math.round(system.cpu.load * 100);
      const memPercent = Math.round((system.memory.used / system.memory.total) * 100);
      this.setCapabilityValue('measure_cpu', cpuPercent).catch(this.error);
      this.setCapabilityValue('measure_memory', memPercent).catch(this.error);
      this.lastState.cpuPercent = cpuPercent;
      if (cpuPercent >= (this.settings.thresholds?.cpuThreshold || 90)) {
        this.getDriver().triggers.cpuOver.trigger(this, { percent: cpuPercent }).catch(this.error);
      }
    }

    if (array) {
      const started = array.status === 'started';
      if (this.lastState.arrayStarted !== null && this.lastState.arrayStarted !== started) {
        const trig = started ? this.getDriver().triggers.arrayStarted : this.getDriver().triggers.arrayStopped;
        trig.trigger(this, {}).catch(this.error);
      }
      this.lastState.arrayStarted = started;

      if (array.parity?.inProgress === false && this.lastState.parityPercent !== null && this.lastState.parityPercent !== 100) {
        this.getDriver().triggers.parityCompleted.trigger(this, {}).catch(this.error);
      }
      this.lastState.parityPercent = array.parity?.percent ?? null;

      const maxTemp = Math.max(...(array.disks || []).map(d => d.temp || 0), 0);
      if (Number.isFinite(maxTemp)) {
        this.setCapabilityValue('measure_temperature', maxTemp).catch(this.error);
      }
      const diskHot = (array.disks || []).find(d => d.temp >= (this.settings.thresholds?.diskTempThreshold || 60));
      if (diskHot) {
        this.setCapabilityValue('alarm_generic', true).catch(this.error);
      } else {
        this.setCapabilityValue('alarm_generic', false).catch(this.error);
      }
    }

    if (docker?.containers) {
      docker.containers.forEach(c => {
        const prev = this.lastState.containers[c.name];
        if (prev && prev.state !== c.state) {
          this.getDriver().triggers.containerChanged.trigger(this, { name: c.name, from: prev.state, to: c.state }).catch(this.error);
        }
        this.lastState.containers[c.name] = c;
      });
    }

    if (vms) {
      vms.forEach(vm => {
        const prev = this.lastState.vms[vm.name];
        if (prev && prev.state !== vm.state) {
          this.getDriver().triggers.vmChanged.trigger(this, { name: vm.name, from: prev.state, to: vm.state }).catch(this.error);
        }
        this.lastState.vms[vm.name] = vm;
      });
    }

    this.lastState.shares = shares;
  }

  async _mutation(query, variables = {}) {
    const data = await this.client.request(query, variables);
    return data;
  }

  _handleError(err) {
    this.error(err);
    this.setUnavailable(err.message).catch(this.error);
  }
}

module.exports = UnraidDevice;

