# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Parity progress capability** - Real-time parity check progress (%)
- **Array errors capability** - Error count from parity checks
- **Container/VM autocomplete** - Auto-populated dropdowns from live server data

### Enhanced
- All container and VM flow cards now use autocomplete instead of manual text entry
- Container/VM names pulled directly from server (no more typos!)
- Autocomplete shows current state (running/stopped) for each container/VM

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

[Unreleased]: https://github.com/Qballjos/homey-unraid/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/Qballjos/homey-unraid/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Qballjos/homey-unraid/releases/tag/v0.1.0

