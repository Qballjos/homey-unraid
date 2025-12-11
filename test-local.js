#!/usr/bin/env node
/**
 * Local test script to verify basic app functionality
 * Tests syntax, imports, and basic object structure
 */

console.log('🧪 Running local tests...\n');

// Test 1: App.js syntax
console.log('Test 1: Checking app.js syntax...');
try {
  const fs = require('fs');
  const appCode = fs.readFileSync('./app.js', 'utf8');
  if (!appCode.includes('module.exports')) {
    throw new Error('app.js should export a module');
  }
  if (!appCode.includes('class') && !appCode.includes('function')) {
    throw new Error('app.js should define a class or function');
  }
  console.log('✓ app.js structure looks correct\n');
} catch (err) {
  console.error('✗ Failed to validate app.js:', err.message);
  process.exit(1);
}

// Test 2: Driver syntax
console.log('Test 2: Checking driver.js syntax...');
try {
  const fs = require('fs');
  const driverCode = fs.readFileSync('./drivers/unraid-server/driver.js', 'utf8');
  if (!driverCode.includes('module.exports')) {
    throw new Error('driver.js should export a module');
  }
  if (!driverCode.includes('class') && !driverCode.includes('Driver')) {
    throw new Error('driver.js should define a Driver class');
  }
  console.log('✓ driver.js structure looks correct\n');
} catch (err) {
  console.error('✗ Failed to validate driver.js:', err.message);
  process.exit(1);
}

// Test 3: Device syntax
console.log('Test 3: Checking device.js syntax...');
try {
  const fs = require('fs');
  const deviceCode = fs.readFileSync('./drivers/unraid-server/device.js', 'utf8');
  if (!deviceCode.includes('module.exports')) {
    throw new Error('device.js should export a module');
  }
  if (!deviceCode.includes('class') && !deviceCode.includes('Device')) {
    throw new Error('device.js should define a Device class');
  }
  // Check for key methods
  const requiredMethods = ['onInit', 'onSettings', '_poll', '_updateState'];
  for (const method of requiredMethods) {
    if (!deviceCode.includes(method)) {
      throw new Error(`device.js missing method: ${method}`);
    }
  }
  console.log('✓ device.js structure looks correct\n');
} catch (err) {
  console.error('✗ Failed to validate device.js:', err.message);
  process.exit(1);
}

// Test 4: GraphQL client
console.log('Test 4: Checking GraphQL client...');
try {
  const fs = require('fs');
  const clientCode = fs.readFileSync('./lib/graphql.js', 'utf8');

  if (!clientCode.includes('module.exports')) {
    throw new Error('graphql.js should export a module');
  }

  if (!clientCode.includes('class') && !clientCode.includes('function')) {
    throw new Error('graphql.js should define a class or function');
  }

  // Check for key functionality
  if (!clientCode.includes('graphql') || !clientCode.includes('request')) {
    throw new Error('GraphQL client should have request functionality');
  }

  if (!clientCode.includes('Authorization') || !clientCode.includes('Bearer')) {
    throw new Error('GraphQL client should use Bearer token authentication');
  }

  console.log('✓ GraphQL client structure looks correct\n');
} catch (err) {
  console.error('✗ Failed to validate GraphQL client:', err.message);
  process.exit(1);
}

// Test 5: Manifest validation
console.log('Test 5: Validating app.json...');
try {
  const manifest = require('./app.json');

  // Check required fields
  const required = ['id', 'version', 'name', 'description', 'category', 'drivers'];
  for (const field of required) {
    if (!manifest[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Check driver structure
  if (!Array.isArray(manifest.drivers) || manifest.drivers.length === 0) {
    throw new Error('Drivers should be a non-empty array');
  }

  const driver = manifest.drivers[0];
  if (!driver.id || !driver.name || !driver.class) {
    throw new Error('Driver missing required fields');
  }

  // Check flow cards
  if (!manifest.flow) {
    throw new Error('Missing flow configuration');
  }

  const { triggers, conditions, actions } = manifest.flow;
  console.log(`  - ${triggers.length} triggers`);
  console.log(`  - ${conditions.length} conditions`);
  console.log(`  - ${actions.length} actions`);

  // Check all flow cards have required fields
  for (const trigger of triggers) {
    if (!trigger.id || !trigger.title) {
      throw new Error(`Trigger missing required fields: ${JSON.stringify(trigger)}`);
    }
  }

  console.log('✓ app.json is valid\n');
} catch (err) {
  console.error('✗ Invalid app.json:', err.message);
  process.exit(1);
}

// Test 6: Locales
console.log('Test 6: Checking locales...');
try {
  const locales = require('./locales/en.json');
  if (typeof locales !== 'object') {
    throw new Error('Locales should be an object');
  }
  console.log(`  - ${Object.keys(locales).length} locale keys`);
  console.log('✓ Locales file is valid\n');
} catch (err) {
  console.error('✗ Invalid locales:', err.message);
  process.exit(1);
}

// Test 7: Package.json
console.log('Test 7: Validating package.json...');
try {
  const pkg = require('./package.json');

  if (pkg.name !== 'com.unraid') {
    throw new Error('Package name should match app ID');
  }

  if (!pkg.version || !pkg.description) {
    throw new Error('Missing version or description');
  }

  if (!pkg.dependencies || !pkg.dependencies['node-fetch']) {
    throw new Error('Missing node-fetch dependency');
  }

  console.log(`  - Version: ${pkg.version}`);
  console.log(`  - Dependencies: ${Object.keys(pkg.dependencies).join(', ')}`);
  console.log('✓ package.json is valid\n');
} catch (err) {
  console.error('✗ Invalid package.json:', err.message);
  process.exit(1);
}

console.log('✅ All local tests passed!\n');
console.log('To test on a real Homey device:');
console.log('  1. Ensure your Homey is on the same network');
console.log('  2. Run: homey app run');
console.log('  3. Add a device through the Homey app\n');

