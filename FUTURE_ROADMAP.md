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

### Flow Triggers (6)
- ✅ Array started/stopped
- ✅ Parity check completed
- ✅ Container state changed
- ✅ VM state changed
- ✅ CPU over threshold

### Flow Conditions (3)
- ✅ Array is started
- ✅ Container is running
- ✅ VM is running

### Flow Actions (11)
- ✅ Start/stop array
- ✅ Start parity check
- ✅ Start/stop/restart/update container (4)
- ✅ Start/stop/reboot VM (3)
- ✅ Send Unraid notification

---

## Future Enhancements

### HIGH PRIORITY - Core Functionality

#### Triggers
- [ ] **Parity check started** - Know when check begins
- [ ] **Parity check error detected** - Alert on parity issues
- [ ] **Disk temperature warning** - Per-disk temp threshold
- [ ] **SMART failure detected** - Critical disk health alert
- [ ] **Share/cache low space** - Threshold-based space warning
- [ ] **Mover started/finished** - Cache mover activity
- [ ] **Container crashed** - Exit code != 0
- [ ] **Container restart loop** - Multiple restarts detected
- [ ] **Container update available** - New image version
- [ ] **VM high CPU/RAM** - Resource usage threshold per VM
- [ ] **Array disk error** - Disk read/write errors
- [ ] **UPS on battery** (if exposed by API) - Power event

#### Conditions
- [ ] **Parity check in progress** - Check if parity running
- [ ] **Mover is running** - Check if mover active
- [ ] **Disk temperature above/below** - Threshold check
- [ ] **SMART status healthy** - Check disk health
- [ ] **Free space above** - Space threshold check
- [ ] **Container exists** - Check if container present
- [ ] **VM exists** - Check if VM present
- [ ] **Array has errors** - Check for disk errors

#### Actions
- [ ] **Stop parity check** - Cancel running check
- [ ] **Spin disk up/down** - Power management
- [ ] **Start/stop mover** - Manual cache management
- [ ] **Pause/resume VM** - VM suspend/resume
- [ ] **Pull all container updates** - Batch update
- [ ] **Restart array** - Stop + start
- [ ] **Send notification with level** - Info/warn/error/alert
- [ ] **Set container autostart** - Enable/disable autostart
- [ ] **Execute Unraid user script** (if API supports)

### MEDIUM PRIORITY - Enhanced UX

#### Device Capabilities
- [ ] **Network throughput** (up/down in MB/s) - If API exposes
- [ ] **Disk I/O rate** (read/write MB/s) - If API exposes
- [ ] **Parity progress** (%) - During parity check
- [ ] **Mover progress** (%) - During mover operation
- [ ] **Array errors count** - Number of disk errors
- [ ] **Cache free space** (GB) - Absolute value
- [ ] **Share free space** (GB) - For largest share
- [ ] **Container restart count** - Today/week

#### Better Container/VM Selection
- [ ] **Autocomplete dropdown** - Populate from current containers/VMs
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
- [ ] **Homey Insights integration** - Track metrics over time
  - CPU/RAM usage graphs
  - Uptime tracking
  - Space usage trends
  - Container restart frequency
  - Temperature history

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

### Phase 1: Core Expansion (v0.2.0)
Focus: Essential triggers, conditions, actions
- Parity triggers (start/error)
- Mover triggers and actions
- Disk health triggers (SMART)
- Space threshold conditions
- More VM/container controls

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

