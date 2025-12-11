# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **7 new triggers**: parity started/error, mover started/finished, disk temp warning, SMART failure, container crashed
- **4 new conditions**: parity in progress, mover running, disk temp above, free space above
- **5 new actions**: stop parity check, start/stop mover, pause/resume VM
- Enhanced notification action with level selection (normal/warning/alert)
- Per-disk temperature and SMART monitoring with historical tracking
- Container crash detection (non-zero exit codes)
- Mover activity tracking
- Parity error detection and reporting

### Changed
- Updated GraphQL queries to include exit codes and parity errors
- Enhanced state tracking for disks, parity, and mover

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

[Unreleased]: https://github.com/Qballjos/homey-unraid/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Qballjos/homey-unraid/releases/tag/v0.1.0

