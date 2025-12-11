# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2025-12-11

### 🎉 Major Feature Release - Flow Tags & Dynamic UI

#### Added
**Share Space Monitoring**
- `share_space_low` trigger with 6 rich flow tags:
  - `{{share_name}}` - Name of the share
  - `{{free_gb}}` - Free space in GB
  - `{{used_gb}}` - Used space in GB
  - `{{total_gb}}` - Total size in GB
  - `{{used_percent}}` - Used percentage
  - `{{free_percent}}` - Free percentage
- Configurable threshold (50-99%, default 90%)
- Smart triggering (only when crossing threshold, no spam)
- Auto-recovery tracking when space frees up

**Container Flow Tags (Enhanced)**
- `container_started` - New dedicated start trigger
- `container_stopped` - New dedicated stop trigger
- `container_state_changed` - Enhanced with rich tokens:
  - `{{container_name}}` - Clean name (no leading slash)
  - `{{old_state}}` / `{{new_state}}` - State transitions
  - `{{status}}` - Full status text ("Up 2 days", etc.)
  - `{{auto_start}}` - Auto-start enabled (true/false)
- `container_crashed` - Enhanced with:
  - `{{exit_code}}` - Exit code for crashes
  - `{{status}}` - Crash details
  - `{{auto_start}}` - Was auto-start enabled

**VM Flow Tags (Enhanced)**
- `vm_started` - New dedicated start trigger
- `vm_stopped` - New dedicated stop trigger  
- `vm_state_changed` - Enhanced with rich tokens:
  - `{{vm_name}}` - VM name
  - `{{vm_id}}` - VM unique ID
  - `{{old_state}}` / `{{new_state}}` - State transitions

**Dynamic Capability Visibility**
- Capabilities now hide/show based on poll settings
- `pollArray = false` → Hides array-related capabilities
- `pollDocker = false` → Hides container count
- `pollVms = false` → Hides VM count
- Instant update when changing settings
- Cleaner device tile (only shows what's monitored)

**Force Refresh Action**
- New flow action: "Force refresh data from Unraid server"
- Instantly polls server without waiting for next interval
- Useful for testing and on-demand updates
- Works with all devices

#### Enhanced
- **CPU Temperature Display**: Automatically prioritized on device tile
  - CPU temp now shows prominently (position 3)
  - Disk temp moved to end (still available for flows)
  - Automatic reordering for existing devices
  - No device removal needed
- **Share Space Validation**: Complete validation for NaN prevention
  - Checks `share.used` and `share.free` for null/undefined
  - Prevents NaN values in flow tokens
  - Allows zero values (empty shares)
- **Capability Management**: Protection against invalid capability errors
  - All `setCapabilityValue()` calls now check capability existence
  - Graceful handling when capabilities are hidden
  - No 404 errors for removed capabilities

#### Fixed
- **Invalid Capability Errors**: Fixed capability ID mismatches
  - `measure_disk_temperature` → `measure_temperature`
  - `measure_array_errors` → `meter_array_errors`
  - `measure_parity` → `measure_parity_progress`
  - `measure_array_usage` → `measure_disk_usage`
- **Share NaN Bug**: Validation now checks all required fields
- **Capability Order**: CPU temperature now shows before disk temperature
- **Hidden Capability Updates**: No longer tries to set values for hidden capabilities

#### Changed
- Container names now clean (leading slash removed)
- Flow token naming consistent across all triggers
- Capability order optimized for better UX
- Share polling triggers only on threshold crossings

### Technical Improvements
- Per-share state tracking (lowSpaceShares array)
- Capability existence checks before all value updates
- Automatic capability reordering on device init
- Enhanced logging with emojis for better debugging
- Comprehensive validation for all shared data

## [0.3.2] - 2025-12-11

### 🔧 Changed
- **Simplified pairing flow**: Device can now be added immediately
  - No credentials required during pairing
  - Configure URL and API key in device settings after adding
  - Faster device setup process
  - More user-friendly workflow

### Why This Change
The login_credentials template was causing pairing issues.
New approach: Add device first, configure settings second.

## [0.3.1] - 2025-12-11

### 🐛 Fixed
- **Critical**: Added missing pairing flow for device setup
  - Users can now add Unraid server devices properly
  - Pairing form shows URL and API key input fields
  - Connection validation during pairing
  - Automatic device naming from server hostname

### Technical
- Added `pair` configuration to `driver.compose.json`
- Implemented `onPair()` handler in `driver.js`
- Validates URL format (must include `/graphql`)
- Tests connection before completing pairing

## [0.3.0] - 2025-12-11

### 🎉 UX & Analytics Release

#### Added
- **Homey Insights integration** - 8 metrics now track historical data
  - CPU Load (%) - Resource usage over time
  - Memory Used (%) - RAM consumption trends
  - Array Space Used (%) - Storage growth tracking
  - Containers Running - Infrastructure changes
  - VMs Running - VM count history
  - Uptime (hours) - Stability tracking
  - Parity Progress (%) - Check duration patterns
  - Array Errors - Error count history
- **Parity progress capability** - Real-time parity check progress (%)
- **Array errors capability** - Error count from parity checks
- **Container/VM autocomplete** - Auto-populated dropdowns from live server data

### Enhanced
- All container and VM flow cards now use autocomplete instead of manual text entry
- Container/VM names pulled directly from server (no more typos!)
- Autocomplete shows current state (running/stopped) for each container/VM
- 8 capabilities now support Insights for trend analysis and graphing

## [0.2.0] - 2025-12-11

### 🎉 Major Feature Release - HIGH PRIORITY Items

#### Added
**Triggers (7 new, 13 total)**
- Parity check started - Detect when parity check begins
- Parity check error - Alert when errors found (with error count token)
- Mover started - Cache mover activity start
- Mover finished - Cache mover completion
- Disk temperature warning - Per-disk alerts with name & temp tokens
- SMART failure detected - Critical disk health warnings
- Container crashed - Exit code tracking (non-zero exits with code token)

**Conditions (4 new, 7 total)**
- Parity check in progress - Check if parity running
- Mover is running - Check if mover active
- Disk temperature above - Threshold check per disk
- Free space above - Space threshold for shares/cache

**Actions (5 new, 16 total)**
- Stop parity check - Cancel running check
- Start mover - Manually trigger cache mover
- Stop mover - Cancel mover operation
- Pause VM - Suspend virtual machine
- Resume VM - Resume paused VM

#### Enhanced
- Send notification action now supports level selection (normal/warning/alert)
- Per-disk temperature and SMART monitoring with historical comparison
- Container crash detection with exit code tracking
- Parity error counting and reporting
- Mover activity start/stop detection

#### Changed
- GraphQL queries now fetch `exitCode` for containers
- GraphQL queries now fetch parity `errors` count
- State tracking expanded for disks, parity progress, mover status
- Enhanced lastState management for trigger detection

#### Fixed
- CI pipeline failing due to npm lifecycle script conflict
- Renamed `install` script to `deploy` to avoid npm conflicts

### Technical Improvements
- Comprehensive state diffing for accurate trigger detection
- Historical disk state tracking (temperature, SMART status)
- Container state tracking (exitCode, restartCount)
- Parity progress and error tracking
- Mover running state management

## [0.1.0] - 2025-12-11

### Added
- Initial release of Homey Unraid app
- GraphQL API integration with Unraid 7+
- Device monitoring capabilities:
  - CPU load percentage
  - Memory usage percentage
  - Maximum disk temperature
  - Generic alarm for disk temperature threshold
- Flow triggers:
  - Array started/stopped
  - Parity check completed
  - Container state changed
  - VM state changed
  - CPU over threshold
- Flow conditions:
  - Array is started
  - Container is running
  - VM is running
- Flow actions:
  - Start/stop array
  - Start parity check
  - Start/stop/restart Docker containers
  - Update Docker container (pull image)
  - Start/stop/reboot VMs
  - Send Unraid notification
- Configurable settings:
  - Server URL and API key
  - Polling interval (10-300s)
  - Domain toggles (array, Docker, VMs, shares)
  - CPU and disk temperature thresholds
  - Allow control actions toggle
- Multi-server support (multiple devices)
- Lightweight polling with state diffing
- Automatic error recovery
- GitHub CI/CD with validation checks
- Branch protection and PR requirements
- Dependabot for dependency updates

### Security
- API keys stored securely via Homey settings
- Control actions require explicit opt-in
- No logging of sensitive credentials

[Unreleased]: https://github.com/Qballjos/homey-unraid/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/Qballjos/homey-unraid/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Qballjos/homey-unraid/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Qballjos/homey-unraid/releases/tag/v0.1.0

