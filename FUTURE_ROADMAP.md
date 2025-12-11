# Homey Unraid - Future Roadmap

## Current Implementation Status ✅

### Device Capabilities (9)
- ✅ CPU Load (%)
- ✅ Memory Used (%)
- ✅ Disk Temperature (°C)
- ✅ Array Space Used (%)
- ✅ Containers Running
- ✅ VMs Running
- ✅ Uptime (hours)
- ✅ Array Status (text)
- ✅ Alarm (disk temp)

### Flow Triggers (13)
- ✅ Array started/stopped
- ✅ Parity check started/completed/error
- ✅ Mover started/finished
- ✅ Disk temperature warning
- ✅ SMART failure detected
- ✅ Container state changed/crashed
- ✅ VM state changed
- ✅ CPU over threshold

### Flow Conditions (7)
- ✅ Array is started
- ✅ Parity check in progress
- ✅ Mover is running
- ✅ Disk temperature above threshold
- ✅ Free space above threshold
- ✅ Container is running
- ✅ VM is running

### Flow Actions (16)
- ✅ Start/stop array
- ✅ Start/stop parity check
- ✅ Start/stop mover
- ✅ Start/stop/restart/update container (4)
- ✅ Start/stop/reboot/pause/resume VM (5)
- ✅ Send Unraid notification (with level)

---

## Future Enhancements

### HIGH PRIORITY - Core Functionality

#### Triggers
- [x] **Parity check started** - Know when check begins ✅ v0.2.0
- [x] **Parity check error detected** - Alert on parity issues ✅ v0.2.0
- [x] **Disk temperature warning** - Per-disk temp threshold ✅ v0.2.0
- [x] **SMART failure detected** - Critical disk health alert ✅ v0.2.0
- [ ] **Share/cache low space** - Threshold-based space warning
- [x] **Mover started/finished** - Cache mover activity ✅ v0.2.0
- [x] **Container crashed** - Exit code != 0 ✅ v0.2.0
- [ ] **Container restart loop** - Multiple restarts detected
- [ ] **Container update available** - New image version
- [ ] **VM high CPU/RAM** - Resource usage threshold per VM
- [ ] **Array disk error** - Disk read/write errors
- [ ] **UPS on battery** (if exposed by API) - Power event

#### Conditions
- [x] **Parity check in progress** - Check if parity running ✅ v0.2.0
- [x] **Mover is running** - Check if mover active ✅ v0.2.0
- [x] **Disk temperature above/below** - Threshold check ✅ v0.2.0
- [ ] **SMART status healthy** - Check disk health
- [x] **Free space above** - Space threshold check ✅ v0.2.0
- [ ] **Container exists** - Check if container present
- [ ] **VM exists** - Check if VM present
- [ ] **Array has errors** - Check for disk errors

#### Actions
- [x] **Stop parity check** - Cancel running check ✅ v0.2.0
- [ ] **Spin disk up/down** - Power management
- [x] **Start/stop mover** - Manual cache management ✅ v0.2.0
- [x] **Pause/resume VM** - VM suspend/resume ✅ v0.2.0
- [ ] **Pull all container updates** - Batch update
- [ ] **Restart array** - Stop + start
- [x] **Send notification with level** - Normal/warning/alert ✅ v0.2.0
- [ ] **Set container autostart** - Enable/disable autostart
- [ ] **Execute Unraid user script** (if API supports)

### MEDIUM PRIORITY - Enhanced UX

#### Device Capabilities
- [ ] **Network throughput** (up/down in MB/s) - If API exposes
- [ ] **Disk I/O rate** (read/write MB/s) - If API exposes
- [x] **Parity progress** (%) - During parity check ✅ v0.3.0
- [ ] **Mover progress** (%) - During mover operation
- [x] **Array errors count** - Number of disk errors ✅ v0.3.0
- [ ] **Cache free space** (GB) - Absolute value
- [ ] **Share free space** (GB) - For largest share
- [ ] **Container restart count** - Today/week

#### Better Container/VM Selection
- [x] **Autocomplete dropdown** - Populate from current containers/VMs ✅ v0.3.0
- [ ] **Device selection** - Pick from discovered containers/VMs
- [ ] **Tag/filter support** - Group containers by label
- [ ] **Favorite containers** - Quick access list
- [ ] **Container/VM status icons** - Visual indicators

#### Settings Enhancements
- [ ] **Multiple threshold profiles** - Day/night modes
- [ ] **Notification preferences** - Per-event enable/disable
- [ ] **Poll schedule** - Different intervals by time
- [ ] **Auto-disable on errors** - Prevent spam
- [ ] **Debug/verbose logging** - Troubleshooting mode
- [ ] **Container/VM filters** - Include/exclude by name pattern

### LOW PRIORITY - Advanced Features

#### Insights & Analytics
- [x] **Homey Insights integration** - Track metrics over time ✅ v0.3.0
  - ✅ CPU/RAM usage graphs
  - ✅ Uptime tracking
  - ✅ Space usage trends
  - ✅ Container/VM count history
  - ✅ Parity progress tracking
  - [ ] Container restart frequency (needs additional tracking)
  - [ ] Per-disk temperature history (would need sub-devices)

#### Notifications Integration
- [ ] **Pull Unraid notifications** - Fetch system notifications
- [ ] **Notification history** - Last N notifications
- [ ] **Notification triggers** - Fire on new Unraid notification
- [ ] **Acknowledge notifications** - Mark as read via Homey

#### Multi-Share/Disk Monitoring
- [ ] **Per-share capabilities** - Create sub-devices per share
- [ ] **Per-disk capabilities** - Create sub-devices per disk
- [ ] **Aggregate metrics** - Total throughput, total IOPS
- [ ] **Share usage alerts** - Individual share thresholds

#### Container Deep Integration
- [ ] **Container logs** - Fetch recent logs (if API supports)
- [ ] **Container stats** - Real-time CPU/RAM/NET per container
- [ ] **Container exec** - Run commands (if API supports)
- [ ] **Container port mapping** - View exposed ports
- [ ] **Container health checks** - Monitor healthcheck status

#### VM Advanced Control
- [ ] **VM snapshots** - Create/restore/list (if API supports)
- [ ] **VM console access** - VNC/SPICE link (if API supports)
- [ ] **VM resource allocation** - View/adjust CPU/RAM (if API supports)
- [ ] **VM passthrough devices** - List USB/PCI devices

#### Plugin/App Management (if API exposes)
- [ ] **List installed plugins** - Community Apps
- [ ] **Update plugins** - Apply updates
- [ ] **Start/stop plugins** - Enable/disable
- [ ] **Plugin update available** - Trigger on updates

#### User/Permission Management (if API exposes)
- [ ] **List users** - Show Unraid users
- [ ] **View shares per user** - Access control
- [ ] **Sessions active** - Current login sessions

#### Backup/Maintenance
- [ ] **Trigger Appdata backup** (if plugin API exposed)
- [ ] **Flash backup** - Backup USB config
- [ ] **Docker.img maintenance** - Trim/compact

#### Speech/Voice
- [ ] **Enhanced speech examples** - More natural phrases
- [ ] **Voice status reports** - "Hey Homey, Unraid status"
- [ ] **Voice container control** - "Hey Homey, restart Plex"

### RESEARCH NEEDED - API Limitations

Check if Unraid GraphQL API supports:
- [ ] Network interface throughput (real-time)
- [ ] Disk I/O rates per disk
- [ ] Historical metrics (or use Homey Insights)
- [ ] Container logs endpoint
- [ ] VM snapshot operations
- [ ] Plugin management endpoints
- [ ] User script execution
- [ ] Notification acknowledgment
- [ ] Share-level permissions/ACLs
- [ ] UPS status/metrics
- [ ] IPMI/BMC integration
- [ ] Fan speed control
- [ ] GPU passthrough status

---

## Implementation Phases

### Phase 1: Core Expansion (v0.2.0) ✅ COMPLETED
Focus: Essential triggers, conditions, actions
- ✅ Parity triggers (start/error)
- ✅ Mover triggers and actions
- ✅ Disk health triggers (SMART, temperature)
- ✅ Space threshold conditions
- ✅ More VM/container controls (pause/resume, crash detection)

### Phase 2: UX Improvements (v0.3.0)
Focus: Better usability
- Autocomplete for container/VM names
- More device capabilities (parity %, cache space)
- Enhanced settings (profiles, schedules)
- Better error handling and diagnostics

### Phase 3: Advanced Features (v0.4.0)
Focus: Power users
- Homey Insights integration
- Notification sync
- Per-share/disk monitoring
- Container stats and logs

### Phase 4: Enterprise/Pro (v1.0.0)
Focus: Complete management
- Plugin management
- Backup automation
- Multi-server orchestration
- Advanced analytics

---

## Community Requests

Add user-requested features here:
- [ ] _Open for suggestions_

## API Version Support

- **Current**: Unraid 7.x GraphQL API
- **Target**: Maintain compatibility with Unraid 7.0+
- **Future**: Monitor Unraid 8.x API changes

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow.

Priority features from this roadmap are tagged in GitHub Issues.

