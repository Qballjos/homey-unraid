# Unraid for Homey (Pro Mini)

Lightweight Homey app to monitor and control an Unraid server via the official GraphQL API. Supports array status, parity, disk temps, Docker containers, VMs, shares (optional), and control actions (opt-in).

## Device Metrics (Displayed on Card)
- **CPU Load** - Current CPU usage (%)
- **Memory Used** - RAM usage (%)
- **Disk Temperature** - Maximum disk temperature (°C)
- **Array Space Used** - Cache pool usage (%)
- **Containers Running** - Number of active Docker containers
- **VMs Running** - Number of active virtual machines
- **Uptime** - Server uptime (hours)
- **Array Status** - Current status (started/stopped/parity check/mover)
- **Alarm** - Warning indicator for high disk temperature

## Requirements
- Node.js 18+
- Homey CLI (`npm install -g homey`)
- Unraid 7+ with the API enabled and an API key

## Setup
```bash
npm install
homey app validate --level publish
# run on your Homey for local testing
homey app run
```

## Configuration (device settings)
- `baseUrl`: Unraid URL (e.g., http://tower)
- `apiKey`: API key from Settings → Management Access → API Keys
- `pollInterval`: seconds (default 30)
- Domain toggles: array/disks, docker, vms, shares
- Thresholds: CPU %, disk temp °C
- `allowControl`: enable start/stop/restart/pull for containers, array ops, VM power

## Flows (current)
- **Triggers**: array started/stopped, parity completed, container state changed, VM state changed, CPU over threshold.
- **Conditions**: array started, container running, VM running.
- **Actions**: start/stop array, start parity check; start/stop/restart/update (pull) container; start/stop/reboot VM; send Unraid notification.

## Development notes
- Icons: `assets/icon-small.png` (250x175), `assets/icon-large.png` (500x350); driver icons 75x75 and 500x500.
- Custom capabilities defined inline in `app.json` (CPU, memory, disk usage, containers, VMs, uptime, array status).
- Control actions are guarded by the device `allowControl` setting.
- Polling is lightweight and configurable (10-300s intervals).

## CI
GitHub Actions workflow runs `homey app validate --level publish` on push/PR.

## License
MIT © Jos Visser (https://josvisserict.nl)

