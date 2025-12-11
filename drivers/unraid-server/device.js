const Homey = require('homey');
const UnraidGraphQLClient = require('../../lib/graphql');

class UnraidDevice extends Homey.Device {
  async onInit() {
    this.log(`Device init: ${this.getName()}`);
    this.pollHandle = null;
    this.lastState = {
      arrayStarted: null,
      parityPercent: null,
      parityInProgress: null,
      parityErrors: null,
      moverRunning: null,
      containers: {},
      vms: {},
      disks: {},
      cpuPercent: null,
    };

    await this._initializeCapabilities();
    await this._applySettings(this.getSettings());
    this._schedulePoll();
    this._registerActionHandlers();
    this._registerConditionHandlers();
  }

  async _initializeCapabilities() {
    // Initialize all capabilities with default values to prevent undefined state
    const defaults = {
      measure_cpu: 0,
      measure_memory: 0,
      measure_temperature: 0,
      measure_disk_usage: 0,
      measure_containers: 0,
      measure_vms: 0,
      meter_uptime: 0,
      array_status: 'unknown',
      alarm_generic: false,
    };

    for (const [cap, value] of Object.entries(defaults)) {
      if (this.hasCapability(cap) && this.getCapabilityValue(cap) === null) {
        await this.setCapabilityValue(cap, value).catch(this.error);
      }
    }
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
    driver.actions.stopParity.registerRunListener(() => this._requireControl(() => this._mutation('mutation { array { stopParityCheck } }')));
    driver.actions.startMover.registerRunListener(() => this._requireControl(() => this._mutation('mutation { mover { start } }')));
    driver.actions.stopMover.registerRunListener(() => this._requireControl(() => this._mutation('mutation { mover { stop } }')));

    driver.actions.startContainer.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ docker { startContainer(name:$name) } }', { name: args.name }),
    ));
    driver.actions.stopContainer.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ docker { stopContainer(name:$name) } }', { name: args.name }),
    ));
    driver.actions.restartContainer.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ docker { restartContainer(name:$name) } }', { name: args.name }),
    ));
    driver.actions.updateContainer.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ docker { pullContainer(name:$name) } }', { name: args.name }),
    ));

    driver.actions.startVm.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ vms { start(name:$name) } }', { name: args.name }),
    ));
    driver.actions.stopVm.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ vms { stop(name:$name) } }', { name: args.name }),
    ));
    driver.actions.rebootVm.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ vms { reboot(name:$name) } }', { name: args.name }),
    ));
    driver.actions.pauseVm.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ vms { pause(name:$name) } }', { name: args.name }),
    ));
    driver.actions.resumeVm.registerRunListener(async (args) => this._requireControl(() =>
      this._mutation('mutation($name:String!){ vms { resume(name:$name) } }', { name: args.name }),
    ));

    driver.actions.sendNotification.registerRunListener(async (args) => this._mutation(
      'mutation($message:String!,$level:String!){ notifications { send(message:$message, level:$level) } }',
      { message: args.message, level: args.level || 'normal' },
    ));
  }

  _registerConditionHandlers() {
    const driver = this.getDriver();
    driver.conditions.arrayIsStarted.registerRunListener(() => Promise.resolve(this.lastState.arrayStarted === true));
    driver.conditions.parityInProgress.registerRunListener(() => Promise.resolve(this.lastState.parityInProgress === true));
    driver.conditions.moverIsRunning.registerRunListener(() => Promise.resolve(this.lastState.moverRunning === true));
    driver.conditions.diskTempAbove.registerRunListener((args) => {
      const disk = this.lastState.disks?.[args.name];
      return Promise.resolve(disk && disk.temp > args.threshold);
    });
    driver.conditions.freeSpaceAbove.registerRunListener((args) => {
      // Check cache pools or shares
      const resource = this.lastState.shares?.find(s => s.name === args.name) ||
                       this.lastState.cachePools?.find(p => p.name === args.name);
      if (!resource) {
        return Promise.resolve(false);
      }
      const totalSpace = (resource.free || 0) + (resource.used || 0);
      if (totalSpace === 0) {
        return Promise.resolve(false);
      }
      const freePercent = ((resource.free || 0) / totalSpace) * 100;
      return Promise.resolve(freePercent > args.threshold);
    });
    driver.conditions.containerIsRunning.registerRunListener((args) => Promise.resolve(
      this.lastState.containers?.[args.name]?.state === 'running',
    ));
    driver.conditions.vmIsRunning.registerRunListener((args) => Promise.resolve(
      this.lastState.vms?.[args.name]?.state === 'running',
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
    if (reset) {
      this._clearPoll();
    }
    if (this.pollHandle) {
      return;
    }
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
      parts.push('array { status parity { inProgress percent errors } disks { name temp smartStatus spunDown } cache { pools { name free used } } mover { running } }');
    }
    if (domains.pollDocker) {
      parts.push('docker { containers { name state restartCount exitCode } }');
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

    // System metrics
    if (system?.cpu?.load !== null && system?.memory) {
      const cpuPercent = Math.round(system.cpu.load * 100);
      const memPercent = Math.round((system.memory.used / system.memory.total) * 100);
      this.setCapabilityValue('measure_cpu', cpuPercent).catch(this.error);
      this.setCapabilityValue('measure_memory', memPercent).catch(this.error);
      this.lastState.cpuPercent = cpuPercent;
      if (cpuPercent >= (this.settings.thresholds?.cpuThreshold || 90)) {
        this.getDriver().triggers.cpuOver.trigger(this, { percent: cpuPercent }).catch(this.error);
      }
    }

    // Uptime
    if (system?.uptime !== null && system?.uptime !== undefined) {
      const uptimeHours = Math.round((system.uptime / 3600) * 10) / 10;
      this.setCapabilityValue('meter_uptime', uptimeHours).catch(this.error);
    }

    // Array status and metrics
    if (array) {
      const started = array.status === 'started';
      if (this.lastState.arrayStarted !== null && this.lastState.arrayStarted !== started) {
        const trig = started ? this.getDriver().triggers.arrayStarted : this.getDriver().triggers.arrayStopped;
        trig.trigger(this, {}).catch(this.error);
      }
      this.lastState.arrayStarted = started;

      // Array status text
      let statusText = array.status || 'unknown';
      if (array.parity?.inProgress) {
        statusText = `Parity check (${array.parity.percent || 0}%)`;
      } else if (array.mover?.running) {
        statusText = 'Mover running';
      }
      this.setCapabilityValue('array_status', statusText).catch(this.error);

      // Parity tracking
      const parityNow = array.parity?.inProgress || false;
      const parityErrors = array.parity?.errors || 0;

      // Parity started trigger
      if (parityNow && !this.lastState.parityInProgress) {
        this.getDriver().triggers.parityStarted.trigger(this, {}).catch(this.error);
      }

      // Parity completed trigger
      if (!parityNow && this.lastState.parityInProgress) {
        this.getDriver().triggers.parityCompleted.trigger(this, {}).catch(this.error);

        // Check for errors
        if (parityErrors > 0) {
          this.getDriver().triggers.parityError.trigger(this, { errors: parityErrors }).catch(this.error);
        }
      }

      this.lastState.parityInProgress = parityNow;
      this.lastState.parityPercent = array.parity?.percent ?? null;
      this.lastState.parityErrors = parityErrors;

      // Mover tracking
      const moverNow = array.mover?.running || false;
      if (moverNow && !this.lastState.moverRunning) {
        this.getDriver().triggers.moverStarted.trigger(this, {}).catch(this.error);
      } else if (!moverNow && this.lastState.moverRunning) {
        this.getDriver().triggers.moverFinished.trigger(this, {}).catch(this.error);
      }
      this.lastState.moverRunning = moverNow;

      // Disk usage from cache pools
      if (array.cache?.pools && array.cache.pools.length > 0) {
        let totalUsed = 0;
        let totalSpace = 0;
        array.cache.pools.forEach(pool => {
          totalUsed += pool.used || 0;
          totalSpace += (pool.free || 0) + (pool.used || 0);
        });
        if (totalSpace > 0) {
          const diskUsagePercent = Math.round((totalUsed / totalSpace) * 1000) / 10;
          this.setCapabilityValue('measure_disk_usage', diskUsagePercent).catch(this.error);
        }
        this.lastState.cachePools = array.cache.pools;
      }

      // Disk temperature and SMART monitoring
      const diskTempThreshold = this.settings.thresholds?.diskTempThreshold || 60;
      const maxTemp = Math.max(...(array.disks || []).map(d => d.temp || 0), 0);
      if (Number.isFinite(maxTemp)) {
        this.setCapabilityValue('measure_temperature', maxTemp).catch(this.error);
      }

      let hasHotDisk = false;
      (array.disks || []).forEach(disk => {
        const prevDisk = this.lastState.disks[disk.name] || {};

        // Temperature warning trigger
        if (disk.temp && disk.temp >= diskTempThreshold && (!prevDisk.temp || prevDisk.temp < diskTempThreshold)) {
          this.getDriver().triggers.diskTempWarning.trigger(this, { name: disk.name, temp: disk.temp }).catch(this.error);
          hasHotDisk = true;
        }

        // SMART failure trigger
        if (disk.smartStatus && disk.smartStatus !== 'PASSED' && prevDisk.smartStatus === 'PASSED') {
          this.getDriver().triggers.smartFailure.trigger(this, { name: disk.name }).catch(this.error);
        }

        // Store disk state
        this.lastState.disks[disk.name] = {
          temp: disk.temp,
          smartStatus: disk.smartStatus,
        };

        if (disk.temp && disk.temp >= diskTempThreshold) {
          hasHotDisk = true;
        }
      });

      this.setCapabilityValue('alarm_generic', hasHotDisk).catch(this.error);
    } else {
      // Array polling disabled - set unavailable status
      this.setCapabilityValue('array_status', 'not monitored').catch(this.error);
      this.setCapabilityValue('measure_disk_usage', 0).catch(this.error);
      this.setCapabilityValue('measure_temperature', 0).catch(this.error);
      this.setCapabilityValue('alarm_generic', false).catch(this.error);
    }

    // Docker containers
    if (docker?.containers) {
      const runningContainers = docker.containers.filter(c => c.state === 'running').length;
      this.setCapabilityValue('measure_containers', runningContainers).catch(this.error);

      docker.containers.forEach(c => {
        const prev = this.lastState.containers[c.name];

        // Container state changed
        if (prev && prev.state !== c.state) {
          this.getDriver().triggers.containerChanged.trigger(this, { name: c.name, from: prev.state, to: c.state }).catch(this.error);

          // Container crashed (exited with non-zero code)
          if (c.state === 'exited' && c.exitCode && c.exitCode !== 0) {
            this.getDriver().triggers.containerCrashed.trigger(this, { name: c.name, code: c.exitCode }).catch(this.error);
          }
        }

        this.lastState.containers[c.name] = {
          state: c.state,
          restartCount: c.restartCount || 0,
          exitCode: c.exitCode,
        };
      });
    } else {
      // Docker polling disabled
      this.setCapabilityValue('measure_containers', 0).catch(this.error);
    }

    // Virtual machines
    if (vms) {
      const runningVms = vms.filter(vm => vm.state === 'running').length;
      this.setCapabilityValue('measure_vms', runningVms).catch(this.error);

      vms.forEach(vm => {
        const prev = this.lastState.vms[vm.name];
        if (prev && prev.state !== vm.state) {
          this.getDriver().triggers.vmChanged.trigger(this, { name: vm.name, from: prev.state, to: vm.state }).catch(this.error);
        }
        this.lastState.vms[vm.name] = vm;
      });
    } else {
      // VM polling disabled
      this.setCapabilityValue('measure_vms', 0).catch(this.error);
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

