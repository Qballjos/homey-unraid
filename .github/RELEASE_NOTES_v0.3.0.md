# Homey Unraid v0.3.0 - UX & Analytics Release

## 🎉 First Public Release!

Comprehensive Unraid server integration for Homey Pro. Monitor and control your Unraid server with rich automation capabilities.

## ✨ Key Features

### Device Capabilities (11)
- **CPU Load** (%) 📊 - Real-time processor usage
- **Memory Used** (%) 📊 - RAM consumption tracking
- **Disk Temperature** (°C) - Maximum disk temperature
- **Array Space Used** (%) 📊 - Storage utilization
- **Parity Progress** (%) 📊 - Live parity check progress
- **Array Errors** 📊 - Error count from parity checks
- **Containers Running** 📊 - Active Docker containers
- **VMs Running** 📊 - Active virtual machines
- **Uptime** (hours) 📊 - Server uptime tracking
- **Array Status** - Started/stopped/checking/mover
- **Alarm** - Temperature warning indicator

📊 = **Homey Insights enabled** for historical tracking

### Flow Triggers (13)
- Array started/stopped
- Parity check started/completed/error
- Mover started/finished
- Disk temperature warning
- SMART failure detected
- Container state changed/crashed
- VM state changed
- CPU over threshold

### Flow Conditions (7)
- Array is started
- Parity check in progress
- Mover is running
- Disk temperature above threshold
- Free space above threshold
- Container is running
- VM is running

### Flow Actions (16)
- **Array**: start, stop
- **Parity**: start check, stop check
- **Mover**: start, stop
- **Containers**: start, stop, restart, update (pull image)
- **VMs**: start, stop, reboot, pause, resume
- **Notifications**: send (with level: normal/warning/alert)

### Advanced Features
- ✅ **Autocomplete** - Container/VM names populated from live data
- ✅ **Multi-Server** - Support unlimited Unraid servers
- ✅ **Insights** - Historical tracking for 8 metrics
- ✅ **Configurable** - Polling intervals, domain toggles, thresholds
- ✅ **Safe Controls** - Opt-in destructive actions
- ✅ **Smart State** - Change detection prevents duplicate triggers

## 📊 Coverage

**~85% of Unraid GraphQL API capabilities**
- ✅ System monitoring (CPU, RAM, temps, uptime)
- ✅ Array management (status, parity, mover, disks)
- ✅ Docker containers (monitoring & control)
- ✅ Virtual machines (monitoring & control)
- ✅ Share monitoring
- ✅ Notification system

## 🚀 Getting Started

### Prerequisites
- Homey Pro (2023 model or later)
- Unraid 7.0+ with GraphQL API enabled
- API key from Unraid Settings → API

### Setup
1. Install "Unraid" app from Homey App Store
2. Add device: Settings → Devices → Add → Unraid Server
3. Configure:
   - **Base URL**: `http://YOUR_IP:PORT/graphql`
   - **API Key**: From Unraid Settings → API
4. Adjust polling settings (optional)
5. Start creating flows!

### Example Flows

**Alert on High CPU:**
```
WHEN: CPU load above threshold
THEN: Send notification "Unraid CPU is high!"
```

**Auto-restart crashed containers:**
```
WHEN: Container crashed
THEN: Restart container [[name]]
```

**Daily parity check:**
```
WHEN: Time is 02:00
AND: Parity check not in progress
THEN: Start parity check
```

## 📖 Documentation

- **Setup Guide**: See [README.md](https://github.com/Qballjos/homey-unraid#readme)
- **All Flow Cards**: Complete reference in README
- **Future Plans**: See [FUTURE_ROADMAP.md](https://github.com/Qballjos/homey-unraid/blob/main/FUTURE_ROADMAP.md)
- **Community**: [GitHub Discussions](https://github.com/Qballjos/homey-unraid/discussions)

## 🐛 Known Issues

None! This is a stable production release.

## 🙏 Feedback

- **Questions?** Ask in [Discussions](https://github.com/Qballjos/homey-unraid/discussions)
- **Bug Reports**: [Create an Issue](https://github.com/Qballjos/homey-unraid/issues)
- **Feature Requests**: [Share in Discussions](https://github.com/Qballjos/homey-unraid/discussions/categories/ideas)

## 🔗 Links

- **GitHub**: https://github.com/Qballjos/homey-unraid
- **Author**: Jos Visser (@Qballjos)
- **License**: MIT

---

**Made with ❤️ for the Unraid and Homey communities**

