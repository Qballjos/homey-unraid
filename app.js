const Homey = require('homey');

class UnraidApp extends Homey.App {
  async onInit() {
    this.log('Unraid app initialized');
  }
}

module.exports = UnraidApp;

