const Homey = require('homey');

class UnraidDriver extends Homey.Driver {
  async onInit() {
    this.log('Unraid driver initialized');

    // Flow cards
    this.triggers = {
      arrayStarted: this.homey.flow.getTriggerCard('array_started'),
      arrayStopped: this.homey.flow.getTriggerCard('array_stopped'),
      parityCompleted: this.homey.flow.getTriggerCard('parity_completed'),
      containerChanged: this.homey.flow.getTriggerCard('container_state_changed'),
      vmChanged: this.homey.flow.getTriggerCard('vm_state_changed'),
      cpuOver: this.homey.flow.getTriggerCard('cpu_over_threshold'),
    };

    this.conditions = {
      arrayIsStarted: this.homey.flow.getConditionCard('array_is_started'),
      containerIsRunning: this.homey.flow.getConditionCard('container_is_running'),
      vmIsRunning: this.homey.flow.getConditionCard('vm_is_running'),
    };

    this.actions = {
      startArray: this.homey.flow.getActionCard('start_array'),
      stopArray: this.homey.flow.getActionCard('stop_array'),
      startParity: this.homey.flow.getActionCard('start_parity_check'),
      startContainer: this.homey.flow.getActionCard('start_container'),
      stopContainer: this.homey.flow.getActionCard('stop_container'),
      restartContainer: this.homey.flow.getActionCard('restart_container'),
      updateContainer: this.homey.flow.getActionCard('update_container'),
      startVm: this.homey.flow.getActionCard('start_vm'),
      stopVm: this.homey.flow.getActionCard('stop_vm'),
      rebootVm: this.homey.flow.getActionCard('reboot_vm'),
      sendNotification: this.homey.flow.getActionCard('send_unraid_notification'),
    };
  }
}

module.exports = UnraidDriver;

