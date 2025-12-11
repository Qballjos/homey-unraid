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
  }
}

module.exports = UnraidDriver;

