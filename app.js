const Homey = require('homey');

class UnraidApp extends Homey.App {
  async onInit() {
    this.log('Unraid app initialized');
    
    // Register settings handler for debug button
    this.homey.settings.on('set', async (key) => {
      if (key === 'refreshButton') {
        this.log('🔄 Debug: Force refresh triggered!');
        await this.forceRefreshAllDevices();
      }
    });
  }

  async forceRefreshAllDevices() {
    this.log('🔄 Force refreshing all Unraid devices...');
    
    const driver = this.homey.drivers.getDriver('unraid-server');
    const devices = driver.getDevices();
    
    this.log(`Found ${devices.length} Unraid device(s)`);
    
    for (const device of devices) {
      this.log(`🔄 Refreshing: ${device.getName()}`);
      try {
        await device._poll();
        this.log(`✅ ${device.getName()} refreshed successfully`);
      } catch (error) {
        this.error(`❌ Failed to refresh ${device.getName()}:`, error);
      }
    }
    
    this.log('🎉 Force refresh complete!');
  }
}

module.exports = UnraidApp;

