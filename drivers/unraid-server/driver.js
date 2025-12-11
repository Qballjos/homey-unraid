const Homey = require('homey');

class UnraidDriver extends Homey.Driver {
  async onInit() {
    this.log('Unraid driver initialized');

    // Flow cards - Triggers
    this.triggers = {
      arrayStarted: this.homey.flow.getTriggerCard('array_started'),
      arrayStopped: this.homey.flow.getTriggerCard('array_stopped'),
      parityCompleted: this.homey.flow.getTriggerCard('parity_completed'),
      parityStarted: this.homey.flow.getTriggerCard('parity_started'),
      parityError: this.homey.flow.getTriggerCard('parity_error'),
      moverStarted: this.homey.flow.getTriggerCard('mover_started'),
      moverFinished: this.homey.flow.getTriggerCard('mover_finished'),
      diskTempWarning: this.homey.flow.getTriggerCard('disk_temp_warning'),
      smartFailure: this.homey.flow.getTriggerCard('smart_failure'),
      containerChanged: this.homey.flow.getTriggerCard('container_state_changed'),
      containerCrashed: this.homey.flow.getTriggerCard('container_crashed'),
      vmChanged: this.homey.flow.getTriggerCard('vm_state_changed'),
      cpuOver: this.homey.flow.getTriggerCard('cpu_over_threshold'),
    };

    // Flow cards - Conditions
    this.conditions = {
      arrayIsStarted: this.homey.flow.getConditionCard('array_is_started'),
      parityInProgress: this.homey.flow.getConditionCard('parity_in_progress'),
      moverIsRunning: this.homey.flow.getConditionCard('mover_is_running'),
      diskTempAbove: this.homey.flow.getConditionCard('disk_temp_above'),
      freeSpaceAbove: this.homey.flow.getConditionCard('free_space_above'),
      containerIsRunning: this.homey.flow.getConditionCard('container_is_running'),
      vmIsRunning: this.homey.flow.getConditionCard('vm_is_running'),
    };

    // Flow cards - Actions
    this.actions = {
      startArray: this.homey.flow.getActionCard('start_array'),
      stopArray: this.homey.flow.getActionCard('stop_array'),
      startParity: this.homey.flow.getActionCard('start_parity_check'),
      stopParity: this.homey.flow.getActionCard('stop_parity_check'),
      startMover: this.homey.flow.getActionCard('start_mover'),
      stopMover: this.homey.flow.getActionCard('stop_mover'),
      startContainer: this.homey.flow.getActionCard('start_container'),
      stopContainer: this.homey.flow.getActionCard('stop_container'),
      restartContainer: this.homey.flow.getActionCard('restart_container'),
      updateContainer: this.homey.flow.getActionCard('update_container'),
      startVm: this.homey.flow.getActionCard('start_vm'),
      stopVm: this.homey.flow.getActionCard('stop_vm'),
      rebootVm: this.homey.flow.getActionCard('reboot_vm'),
      pauseVm: this.homey.flow.getActionCard('pause_vm'),
      resumeVm: this.homey.flow.getActionCard('resume_vm'),
      sendNotification: this.homey.flow.getActionCard('send_unraid_notification'),
    };

    // Register autocomplete for container/VM names
    this._registerAutocomplete();
  }

  _registerAutocomplete() {
    // Container name autocomplete for conditions
    this.conditions.containerIsRunning.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getContainerAutocomplete(query);
    });

    // Container name autocomplete for actions
    this.actions.startContainer.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getContainerAutocomplete(query);
    });
    this.actions.stopContainer.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getContainerAutocomplete(query);
    });
    this.actions.restartContainer.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getContainerAutocomplete(query);
    });
    this.actions.updateContainer.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getContainerAutocomplete(query);
    });

    // VM name autocomplete for conditions
    this.conditions.vmIsRunning.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getVmAutocomplete(query);
    });

    // VM name autocomplete for actions
    this.actions.startVm.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getVmAutocomplete(query);
    });
    this.actions.stopVm.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getVmAutocomplete(query);
    });
    this.actions.rebootVm.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getVmAutocomplete(query);
    });
    this.actions.pauseVm.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getVmAutocomplete(query);
    });
    this.actions.resumeVm.registerArgumentAutocompleteListener('name', async (query) => {
      return this._getVmAutocomplete(query);
    });
  }

  async onPair(session) {
    this.log('🔥 onPair called');

    session.setHandler('list_devices', async () => {
      this.log('🔥 list_devices handler called');
      const devices = [{
        name: 'Unraid Server',
        data: {
          id: `unraid-${Date.now()}`,
        },
        settings: {
          baseUrl: 'http://tower:8080/graphql',
          apiKey: '',
          pollInterval: 60,
          pollArray: true,
          pollDocker: true,
          pollVms: true,
          pollShares: false,
          cpuThreshold: 80,
          diskTempThreshold: 60,
          allowControl: false,
        },
      }];
      this.log('🔥 Returning devices:', devices.length);
      return devices;
    });
  }

  async onPairListDevices() {
    // Fallback if Homey calls this directly
    this.log('🔥 onPairListDevices called (fallback)');
    return [{
      name: 'Unraid Server',
      data: { id: `unraid-${Date.now()}` },
    }];
  }

  async _getContainerAutocomplete(query) {
    const results = [];
    const devices = this.getDevices();

    for (const device of devices) {
      const containers = device.lastState?.containers || {};
      for (const [name, container] of Object.entries(containers)) {
        if (!query || name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            name: name,
            description: `State: ${container.state || 'unknown'}`,
          });
        }
      }
    }

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  async _getVmAutocomplete(query) {
    const results = [];
    const devices = this.getDevices();

    for (const device of devices) {
      const vms = device.lastState?.vms || {};
      for (const [name, vm] of Object.entries(vms)) {
        if (!query || name.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            name: name,
            description: `State: ${vm.state || 'unknown'}`,
          });
        }
      }
    }

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }
}

module.exports = UnraidDriver;

