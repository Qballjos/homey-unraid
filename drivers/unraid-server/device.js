const Homey = require('homey');
const UnraidGraphQLClient = require('../../lib/graphql');

class UnraidDevice extends Homey.Device {
  async onInit() {
    try {
      this.log('🔥🔥🔥 Device onInit START');
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

      this.log('🔥 Step 1: Initialize capabilities');
      await this._initializeCapabilities();

      this.log('🔥 Step 2: Apply settings');
      await this._applySettings(this.getSettings());

      this.log('🔥 Step 3: Schedule polling');
      this._schedulePoll();

      this.log('🔥 Step 4: Register handlers');
      this._registerActionHandlers();
      this._registerConditionHandlers();

      this.log('🔥🔥🔥 Device onInit COMPLETE');
    } catch (error) {
      this.error('❌❌❌ Error in onInit:', error);
      throw error;
    }
  }

  async _initializeCapabilities() {
    // Initialize all capabilities with default values to prevent undefined state
    const defaults = {
      measure_cpu: 0,
      measure_memory: 0,
      measure_cpu_temperature: 0,
      measure_temperature: 0,
      measure_disk_usage: 0,
      measure_parity_progress: 0,
      meter_array_errors: 0,
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
    const driver = this.driver;
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
    const driver = this.driver;
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
      this.lastState.containers?.[args.name]?.state === 'RUNNING',
    ));
    driver.conditions.vmIsRunning.registerRunListener((args) => Promise.resolve(
      this.lastState.vms?.[args.name]?.state === 'RUNNING',
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
    this.pollIntervalMs = Math.max(10, settings.pollInterval || 30) * 1000;

    // Only create client if URL and API key are configured
    if (settings.baseUrl && settings.apiKey && settings.baseUrl !== 'http://tower:8080/graphql') {
      this.client = new UnraidGraphQLClient({ baseUrl: settings.baseUrl, apiKey: settings.apiKey });
      this.log('Client configured with URL:', settings.baseUrl);
    } else {
      this.client = null;
      this.log('Device not yet configured - please set URL and API key in settings');
      await this.setUnavailable('Please configure URL and API key in device settings');
    }
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
    // Skip polling if not configured yet
    if (!this.client) {
      this.log('Skipping poll - device not configured');
      return;
    }

    const query = this._buildQuery();
    this.log('📤 Query:', query);
    const data = await this.client.request(query);
    this.log('📥 Full response:', JSON.stringify(Object.keys(data)));
    this.setAvailable();
    this._updateState(data);
  }

  _buildQuery() {
    const parts = [];

    // Based on GraphQL schema - all field names confirmed!
    parts.push('metrics { cpu { percentTotal } memory { percentTotal used total } }');
    parts.push('info { os { uptime } cpu { temp } }');

    if (this.settings.pollArray) {
      parts.push(`array {
        state
        capacity { disks { free used total } kilobytes { free used total } }
        disks { name size temp status fsFree fsUsed fsSize numErrors type }
        parityCheckStatus { running progress errors status paused speed }
      }`);
    }
    if (this.settings.pollDocker) {
      parts.push('docker { containers { id names state status autoStart } }');
    }
    if (this.settings.pollVms) {
      parts.push('vms { domains { id name state } }');
    }
    if (this.settings.pollShares) {
      parts.push('shares { name free used size }');
    }
    return `query { ${parts.join(' ')} }`;
  }

  _updateState(data) {
    const { metrics, info, array, docker, vms, shares } = data;

    // System metrics from 'metrics' type (has 'cpu' and 'memory' fields)
    if (metrics) {
      this.log('Metrics received:', JSON.stringify(metrics));
      
      if (metrics.cpu?.percentTotal !== null && metrics.cpu?.percentTotal !== undefined) {
        const cpuPercent = Math.round(metrics.cpu.percentTotal);
        this.setCapabilityValue('measure_cpu', cpuPercent).catch(this.error);
        this.lastState.cpuPercent = cpuPercent;
        
        if (cpuPercent >= (this.settings.thresholds?.cpuThreshold || 90)) {
          this.driver.triggers.cpuOver.trigger(this, { percent: cpuPercent }).catch(this.error);
        }
      }
      
      if (metrics.memory?.percentTotal !== null && metrics.memory?.percentTotal !== undefined) {
        const memPercent = Math.round(metrics.memory.percentTotal);
        this.setCapabilityValue('measure_memory', memPercent).catch(this.error);
      }
    }

    // Info data (uptime, CPU temp)
    if (info) {
      this.log('Info received:', JSON.stringify(info));
      
      // Uptime (API returns boot time as ISO date string)
      if (info.os?.uptime) {
        try {
          const bootTime = new Date(info.os.uptime);
          const now = new Date();
          const uptimeMs = now - bootTime;
          const uptimeHours = Math.round((uptimeMs / 3600000) * 10) / 10;
          this.log(`Boot time: ${info.os.uptime} → Uptime: ${uptimeHours}h`);
          this.setCapabilityValue('meter_uptime', uptimeHours).catch(this.error);
        } catch (error) {
          this.error('Failed to parse uptime:', error);
        }
      }
      
      // CPU Temperature
      if (info.cpu?.temp !== null && info.cpu?.temp !== undefined) {
        const cpuTemp = Math.round(info.cpu.temp);
        this.log(`CPU Temperature: ${cpuTemp}°C`);
        this.setCapabilityValue('measure_cpu_temperature', cpuTemp).catch(this.error);
      }
    }

    // Array status and metrics (based on UnraidArray schema)
    if (array) {
      this.log('Array received:', JSON.stringify(array));
      const started = array.state === 'STARTED';
      if (this.lastState.arrayStarted !== null && this.lastState.arrayStarted !== started) {
        const trig = started ? this.driver.triggers.arrayStarted : this.driver.triggers.arrayStopped;
        trig.trigger(this, {}).catch(this.error);
      }
      this.lastState.arrayStarted = started;

      // Array status text
      let statusText = array.state || 'STOPPED';
      if (array.parityCheckStatus?.running) {
        statusText = `Parity check (${array.parityCheckStatus.progress || 0}%)`;
      }
      this.setCapabilityValue('array_status', statusText).catch(this.error);

      // Parity tracking (from parityCheckStatus)
      const parityNow = array.parityCheckStatus?.running || false;
      const parityErrors = array.parityCheckStatus?.errors || 0;

      // Parity started trigger
      if (parityNow && !this.lastState.parityInProgress) {
        this.driver.triggers.parityStarted.trigger(this, {}).catch(this.error);
      }

      // Parity completed trigger
      if (!parityNow && this.lastState.parityInProgress) {
        this.driver.triggers.parityCompleted.trigger(this, {}).catch(this.error);

        // Check for errors
        if (parityErrors > 0) {
          this.driver.triggers.parityError.trigger(this, { errors: parityErrors }).catch(this.error);
        }
      }

      this.lastState.parityInProgress = parityNow;
      this.lastState.parityPercent = array.parityCheckStatus?.progress ?? null;
      this.lastState.parityErrors = parityErrors;

      // Update parity progress capability
      const parityProgress = array.parityCheckStatus?.progress || 0;
      this.setCapabilityValue('measure_parity_progress', parityProgress).catch(this.error);

      // Update array errors capability
      this.setCapabilityValue('meter_array_errors', parityErrors).catch(this.error);

      // Disk usage from capacity.kilobytes
      if (array.capacity?.kilobytes) {
        const { used, total } = array.capacity.kilobytes;
        if (total && total > 0) {
          const diskUsagePercent = Math.round((used / total) * 1000) / 10;
          this.setCapabilityValue('measure_disk_usage', diskUsagePercent).catch(this.error);
        }
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
          this.driver.triggers.diskTempWarning.trigger(this, { name: disk.name, temp: disk.temp }).catch(this.error);
          hasHotDisk = true;
        }

        // SMART failure trigger
        if (disk.smartStatus && disk.smartStatus !== 'PASSED' && prevDisk.smartStatus === 'PASSED') {
          this.driver.triggers.smartFailure.trigger(this, { name: disk.name }).catch(this.error);
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
      this.setCapabilityValue('measure_parity_progress', 0).catch(this.error);
      this.setCapabilityValue('meter_array_errors', 0).catch(this.error);
      this.setCapabilityValue('alarm_generic', false).catch(this.error);
    }

    // Docker containers (from 'docker { containers }')
    if (docker?.containers) {
      this.log('Docker received:', JSON.stringify(docker));
      const containers = docker.containers;
      const runningContainers = containers.filter(c => c.state === 'RUNNING').length;
      this.setCapabilityValue('measure_containers', runningContainers).catch(this.error);

      containers.forEach(c => {
        // API returns 'names' as array, use first name
        const containerName = Array.isArray(c.names) ? c.names[0] : c.names;
        const prev = this.lastState.containers[containerName];

        // Container state changed
        if (prev && prev.state !== c.state) {
          this.driver.triggers.containerChanged.trigger(this, { name: containerName, from: prev.state, to: c.state }).catch(this.error);

          // Container crashed (not running with non-zero exit code)
          if (c.state !== 'RUNNING' && c.exitCode && c.exitCode !== 0) {
            this.driver.triggers.containerCrashed.trigger(this, { name: containerName, code: c.exitCode }).catch(this.error);
          }
        }

        this.lastState.containers[containerName] = {
          state: c.state,
          restartCount: c.restartCount || 0,
          exitCode: c.exitCode,
        };
      });
    } else {
      // Docker polling disabled
      this.setCapabilityValue('measure_containers', 0).catch(this.error);
    }

    // Virtual machines (from 'vms { domains }')
    if (vms?.domains) {
      this.log('VMs received:', JSON.stringify(vms));
      const domains = vms.domains;
      const runningVms = domains.filter(vm => vm.state === 'RUNNING').length;
      this.setCapabilityValue('measure_vms', runningVms).catch(this.error);

      domains.forEach(vm => {
        const prev = this.lastState.vms[vm.name];
        if (prev && prev.state !== vm.state) {
          this.driver.triggers.vmChanged.trigger(this, { name: vm.name, from: prev.state, to: vm.state }).catch(this.error);
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

