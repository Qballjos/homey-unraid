# Unraid for Homey

[![GitHub release](https://img.shields.io/github/v/release/Qballjos/homey-unraid)](https://github.com/Qballjos/homey-unraid/releases)
[![License](https://img.shields.io/github/license/Qballjos/homey-unraid)](LICENSE)

Comprehensive Homey app for monitoring and controlling Unraid servers via the official GraphQL API (Unraid 7+). Monitor system health, manage Docker containers & VMs, track parity checks, and automate server operations—all from your Homey smart home.

---

## 🚀 Current Release

**Version 0.4.2** - Documentation & Polish Update

📦 **[Test Build Available on Homey App Store](https://homey.app/nl-nl/app/com.unraid/Unraid/test/)**

### What's New in v0.4.2:
- 📚 **Complete Flow Cards Documentation** - All 40 flow cards fully documented
- 📖 **Real-World Examples** - Practical examples for every trigger, condition, and action
- 🎯 **Quick Reference** - Organized tables by category
- ✨ **Rich Flow Tags** - Share space alerts, container/VM events with detailed tokens
- 🌡️ **Temperature Monitoring** - CPU & disk temperature automation
- 💾 **Memory Optimized** - Only ~40MB RAM usage
- 🔄 **Force Refresh** - Instant data updates via Flow action

### Available Flow Cards:
- **16 Triggers** with rich flow tags (container events, VM automation, share alerts, etc.)
- **7 Conditions** for smart logic (status checks, temperature monitoring, etc.)
- **17 Actions** for full control (array management, parity checks, container/VM control, etc.)

📚 **[View Complete Flow Cards Reference](FLOW_CARDS.md)**  
📝 **[View Full Changelog](CHANGELOG.md)**

---

## Device Metrics (Displayed on Card)

All metrics with 📊 support **Homey Insights** for historical tracking and graphs!

### Always Visible (Core Metrics)
- **CPU Load** 📊 - Current CPU usage (%)
- **Memory Used** 📊 - RAM usage (%)
- **CPU Temperature** 📊 - Processor temperature (°C) - *Prominent display!*
- **Uptime** 📊 - Server uptime (hours)

### Dynamic (Based on Poll Settings)
- **Disk Temperature** 📊 - Maximum disk temperature (°C) - *When `pollArray` enabled*
- **Array Space Used** 📊 - Disk array usage (%) - *When `pollArray` enabled*
- **Parity Progress** 📊 - Live parity check progress (%) - *When `pollArray` enabled*
- **Array Errors** 📊 - Error count from parity checks - *When `pollArray` enabled*
- **Array Status** - Current status (started/stopped/parity check/mover) - *When `pollArray` enabled*
- **Containers Running** 📊 - Number of active Docker containers - *When `pollDocker` enabled*
- **VMs Running** 📊 - Number of active virtual machines - *When `pollVms` enabled*
- **Alarm** - Warning indicator for high disk temperature

> **New**: Capabilities automatically hide when their poll setting is disabled for a cleaner device tile!

### Insights Integration
View historical trends in Homey Insights:
- **CPU/RAM usage** over time - Identify resource patterns
- **Disk space growth** - Predict when storage will fill
- **Container/VM counts** - Track infrastructure changes
- **Uptime trends** - Monitor server stability
- **Parity progress** - Historical parity check durations
- **Temperature patterns** - Identify cooling issues

## Features

### 🔍 Comprehensive Monitoring
- **System Metrics**: CPU, RAM, uptime, temperatures
- **Array Status**: Real-time status, parity progress, disk health
- **Storage**: Cache pool usage, share space, disk temperatures
- **Docker**: Running container count, state changes, crash detection
- **VMs**: Active VM count, state transitions

### ⚡ Smart Automation (16 Triggers with Rich Tags)
- **Array & Parity**: started/stopped/completed/error (with error count)
- **Mover**: started/finished
- **Disk Health**: temperature warnings, SMART failures (per-disk with name & temp)
- **Containers**: state changes, started, stopped, crashed (with {{status}}, {{auto_start}}, {{exit_code}})
- **VMs**: state changes, started, stopped (with {{vm_name}}, {{vm_id}})
- **Shares**: space low (with {{share_name}}, {{free_gb}}, {{used_gb}}, {{total_gb}}, {{used_percent}})
- **CPU**: threshold alerts

> **New**: All triggers include rich flow tags for detailed automation!

### 🎮 Full Control (17 Actions)
- **Array Management**: start/stop, parity check control
- **Cache Mover**: start/stop control
- **Docker Containers**: start/stop/restart/update with **autocomplete** ✨
- **Virtual Machines**: start/stop/reboot/pause/resume with **autocomplete** ✨
- **Notifications**: send with severity levels (normal/warning/alert)
- **Force Refresh**: instantly poll server for latest data

> **New**: Force refresh action for on-demand updates without waiting!

### 🔧 Advanced Conditions (7)
- Check array/parity/mover status
- Monitor disk temperatures & free space
- Verify container/VM states

## Requirements
- **Homey**: Pro (2016/2019/2023) or Cloud
- **Unraid**: Version 7.0+ with GraphQL API
- **API Key**: Generated in Unraid Settings → Management Access → API Keys

## Installation

### From Homey App Store (Coming Soon)
Search for "Unraid" in the Homey mobile app.

### Manual Installation (Development)
```bash
# Clone repository
git clone https://github.com/Qballjos/homey-unraid.git
cd homey-unraid

# Install dependencies
npm install

# Install Homey CLI (if not already installed)
npm install -g homey

# Run on your Homey
npm run run
```

## Setup

1. **Enable Unraid API**
   - Navigate to `Settings → Management Access → Developer Options`
   - Enable the API/GraphQL Sandbox

2. **Create API Key**
   - Go to `Settings → Management Access → API Keys`
   - Click "Generate API Key"
   - Copy the key (you'll need it in Homey)

3. **Add Device in Homey**
   - Open Homey app → Devices → Add Device
   - Select "Unraid" → "Unraid Server"
   - Enter your server details:
     - **Server URL**: `http://tower` (or your server IP/hostname)
     - **API Key**: Paste the key from step 2
     - **Polling Interval**: 30-60s recommended

4. **Configure Settings**
   - **Data to poll**: Toggle array/Docker/VMs/shares monitoring
   - **Thresholds**: CPU % and disk temperature limits
   - **Allow control actions**: Enable to allow start/stop operations

## Configuration

### Device Settings
| Setting | Description | Default |
|---------|-------------|---------|
| `Server URL` | Unraid WebGUI URL | `http://tower` |
| `API Key` | API key from Unraid | Required |
| `Polling interval` | Update frequency (seconds) | 30 |
| `Poll Array & disks` | Monitor array status | ✅ |
| `Poll Docker containers` | Monitor containers | ✅ |
| `Poll VMs` | Monitor virtual machines | ✅ |
| `Poll Shares/cache` | Monitor storage | ❌ |
| `CPU threshold` | CPU alert percentage | 90% |
| `Disk temp threshold` | Disk temperature alert (°C) | 60°C |
| `Allow control actions` | Enable start/stop/restart | ❌ |

## Flow Examples

### Example 1: Prevent Operations During Parity Check
```
WHEN: Container needs restart
AND: Parity check in progress
THEN: Send notification "Waiting for parity to complete"
```

### Example 2: High Temperature Alert
```
WHEN: Disk temperature warning (disk [[name]] at [[temp]]°C)
THEN: Send push notification
AND: Start mover (move data off hot disk)
```

### Example 3: Container Crash Recovery
```
WHEN: Container crashed (exit code [[code]])
THEN: Wait 30 seconds
AND: Start container [[name]]
AND: Send alert notification "Container [[name]] restarted"
```

### Example 4: Scheduled Mover
```
WHEN: Time is 02:00
AND: Array is started
AND: Mover is NOT running
THEN: Start mover
```

### Example 5: Parity Error Notification
```
WHEN: Parity check error (found [[errors]] errors)
THEN: Send alert notification "⚠️ Parity check found [[errors]] errors!"
```

## Available Flow Cards

### Triggers (13)
| Trigger | Description | Tokens |
|---------|-------------|--------|
| Array started | Array comes online | - |
| Array stopped | Array goes offline | - |
| Parity check started | Parity check begins | - |
| Parity check completed | Parity check finishes | - |
| Parity check error | Errors found during check | `errors` |
| Mover started | Cache mover begins | - |
| Mover finished | Cache mover completes | - |
| Disk temperature warning | Disk exceeds temp threshold | `name`, `temp` |
| SMART failure | Disk SMART failure detected | `name` |
| Container state changed | Container state transition | `name`, `from`, `to` |
| Container crashed | Container exit code ≠ 0 | `name`, `code` |
| VM state changed | VM state transition | `name`, `from`, `to` |
| CPU over threshold | CPU exceeds limit | `percent` |

### Conditions (7)
- Array is started
- Parity check in progress
- Mover is running
- Disk temperature above `threshold`
- Free space above `threshold` (for share/cache)
- Container `name` is running
- VM `name` is running

### Actions (16)
- Start/stop array
- Start/stop parity check
- Start/stop mover
- Start/stop/restart/update container
- Start/stop/reboot/pause/resume VM
- Send Unraid notification (normal/warning/alert)

## Troubleshooting

### Device Shows "Unavailable"
- Check server URL is correct and accessible
- Verify API key is valid
- Ensure Unraid API is enabled in Developer Options
- Check Homey and Unraid are on same network (or network allows access)

### Capabilities Show Zero/Unknown
- Enable corresponding polling domain in device settings
- Check API key has necessary permissions
- Verify Unraid server is responding (check in GraphQL sandbox)

### Actions Don't Work
- Ensure "Allow control actions" is enabled in device settings
- Verify API key has write permissions
- Check Homey app logs for errors

## Development

### Local Development
```bash
npm install              # Install dependencies
npm run lint             # Check code quality
npm test                 # Run local tests
npm run validate         # Validate Homey app
npm run test:all         # Run all checks
npm run run              # Install on Homey device
npm run deploy           # Deploy to device
```

### Project Structure
```
homey-unraid/
├── app.js                          # Main app entry
├── app.json                        # Manifest (capabilities, flow cards)
├── drivers/unraid-server/
│   ├── device.js                   # Device logic (polling, state)
│   ├── driver.js                   # Driver (flow card registration)
│   └── driver.compose.json         # Device settings
├── lib/graphql.js                  # GraphQL client
├── locales/en.json                 # Translations
└── assets/                         # Icons

```

### Technical Details
- **API**: GraphQL (Unraid 7+ native)
- **Authentication**: Bearer token (API key)
- **Polling**: Configurable interval with domain toggles
- **State Management**: Diff-based trigger detection
- **Capabilities**: Custom inline definitions for flexibility
- **Security**: Control actions opt-in, API key secure storage

### Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow and guidelines.

## Roadmap
See [FUTURE_ROADMAP.md](FUTURE_ROADMAP.md) for planned features and implementation status.

## Support & Community

### 💬 GitHub Discussions
Join the community! [View Discussions](https://github.com/Qballjos/homey-unraid/discussions)

- **🙋 Need Help?** Ask in [Q&A](https://github.com/Qballjos/homey-unraid/discussions/categories/q-a)
- **💡 Have an Idea?** Share in [Ideas](https://github.com/Qballjos/homey-unraid/discussions/categories/ideas)
- **🎨 Built Something Cool?** Show off in [Show & Tell](https://github.com/Qballjos/homey-unraid/discussions/categories/show-and-tell)
- **📢 Stay Updated**: Watch [Announcements](https://github.com/Qballjos/homey-unraid/discussions/categories/announcements)

See the [Discussion Guide](DISCUSSIONS_GUIDE.md) for templates and guidelines.

### 🐛 Bug Reports
Found a bug? [Create an Issue](https://github.com/Qballjos/homey-unraid/issues)

## License
MIT © [Jos Visser](https://josvisserict.nl)

---

**Made with ❤️ for the Unraid and Homey communities**

