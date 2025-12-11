# Homey Unraid - Future Roadmap

## Current Implementation Status ✅

**Coverage**: ~85% of Unraid GraphQL API capabilities  
**Status**: Production-ready for most use cases

### Device Capabilities (11)
- ✅ CPU Load (%) 📊
- ✅ Memory Used (%) 📊
- ✅ Disk Temperature (°C)
- ✅ Array Space Used (%) 📊
- ✅ Parity Progress (%) 📊
- ✅ Array Errors 📊
- ✅ Containers Running 📊
- ✅ VMs Running 📊
- ✅ Uptime (hours) 📊
- ✅ Array Status (text)
- ✅ Alarm (disk temp)

**📊 = Homey Insights enabled** (8/11 capabilities)

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

#### Triggers (Feasible)
- [x] **Parity check started** - Know when check begins ✅ v0.2.0
- [x] **Parity check error detected** - Alert on parity issues ✅ v0.2.0
- [x] **Disk temperature warning** - Per-disk temp threshold ✅ v0.2.0
- [x] **SMART failure detected** - Critical disk health alert ✅ v0.2.0
- [ ] **Share/cache low space** - Threshold-based space warning
- [x] **Mover started/finished** - Cache mover activity ✅ v0.2.0
- [x] **Container crashed** - Exit code != 0 ✅ v0.2.0
- [ ] **Container restart loop** - Multiple restarts detected (track restartCount)
- [ ] **Array disk error** - Disk read/write errors (if API exposes error field)

#### Conditions (Feasible)
- [x] **Parity check in progress** - Check if parity running ✅ v0.2.0
- [x] **Mover is running** - Check if mover active ✅ v0.2.0
- [x] **Disk temperature above/below** - Threshold check ✅ v0.2.0
- [ ] **SMART status healthy** - Check disk health (simple string check)
- [x] **Free space above** - Space threshold check ✅ v0.2.0
- [ ] **Container exists** - Check if container in lastState
- [ ] **VM exists** - Check if VM in lastState

#### Actions (Feasible)
- [x] **Stop parity check** - Cancel running check ✅ v0.2.0
- [ ] **Spin disk up/down** - Power management (if API mutation exists)
- [x] **Start/stop mover** - Manual cache management ✅ v0.2.0
- [x] **Pause/resume VM** - VM suspend/resume ✅ v0.2.0
- [ ] **Pull all container updates** - Iterate through containers
- [ ] **Restart array** - Sequential stop + start action
- [x] **Send notification with level** - Normal/warning/alert ✅ v0.2.0
- [ ] **Set container autostart** - If API supports autostart mutation

### MEDIUM PRIORITY - Enhanced UX

#### Device Capabilities (API-Dependent)
- [x] **Parity progress** (%) - During parity check ✅ v0.3.0
- [x] **Array errors count** - Number of disk errors ✅ v0.3.0
- [ ] **Mover progress** (%) - If API exposes mover progress field
- [ ] **Cache free space** (GB) - Calculate from existing data
- [ ] **Share free space** (GB) - From shares query

#### Better Container/VM Selection
- [x] **Autocomplete dropdown** - Populate from current containers/VMs ✅ v0.3.0
- [ ] **Enhanced autocomplete** - Show additional metadata (CPU/RAM if API provides)
- [ ] **Container filtering** - Filter by state in settings

#### Settings Enhancements (Feasible)
- [ ] **Additional thresholds** - Memory %, disk space %, container restart count
- [ ] **Per-event toggles** - Enable/disable specific triggers
- [ ] **Retry settings** - Backoff strategy for failed polls
- [ ] **Container/VM filters** - Include/exclude by name pattern (regex)

### LOW PRIORITY - Advanced Features

#### Insights & Analytics
- [x] **Homey Insights integration** - Track metrics over time ✅ v0.3.0
  - ✅ CPU/RAM usage graphs
  - ✅ Uptime tracking
  - ✅ Space usage trends
  - ✅ Container/VM count history
  - ✅ Parity progress tracking

#### Additional Monitoring (API-Dependent)
- [ ] **Container restart tracking** - Track restartCount changes over time
- [ ] **Share/cache low space trigger** - Use existing shares data with thresholds
- [ ] **Array disk read/write errors** - If API exposes errorCount per disk
- [ ] **Container resource usage** - If API exposes per-container CPU/RAM/NET stats

#### Advanced Settings
- [ ] **Trigger enable/disable toggles** - Turn off unwanted notifications
- [ ] **Custom thresholds per metric** - Memory %, space %, restart count
- [ ] **Container/VM name filters** - Regex include/exclude patterns

### Realistic Future Additions

Based on Unraid GraphQL API capabilities:

#### Quick Wins (Easy to Add)
- [ ] **Container restart loop detection** - Track restartCount increases
- [ ] **Share low space trigger** - Use existing shares data
- [ ] **Container exists condition** - Check lastState
- [ ] **VM exists condition** - Check lastState
- [ ] **Pull all containers action** - Loop through containers
- [ ] **Restart array action** - Sequential stop/start

#### Requires API Verification
- [ ] **Network throughput** - Check if API exposes network stats
- [ ] **Disk I/O rates** - Check if API exposes disk stats
- [ ] **Container resource stats** - Check if per-container CPU/RAM available
- [ ] **UPS status** - Check if API exposes UPS metrics

#### Not Possible with Current API
- ❌ **Container logs** - Not in GraphQL API
- ❌ **Container exec** - Security risk, not exposed
- ❌ **VM snapshots** - Likely not in GraphQL API
- ❌ **VM console access** - VNC/SPICE outside API scope
- ❌ **Plugin management** - No API endpoints
- ❌ **User script execution** - Security concern
- ❌ **Flash backup** - System-level operation
- ❌ **IPMI/BMC** - Separate interface
- ❌ **Fan control** - Hardware-specific

---

## Implementation Phases

### Phase 1: Core Expansion (v0.2.0) ✅ COMPLETED
Focus: Essential triggers, conditions, actions
- ✅ Parity triggers (start/error)
- ✅ Mover triggers and actions
- ✅ Disk health triggers (SMART, temperature)
- ✅ Space threshold conditions
- ✅ More VM/container controls (pause/resume, crash detection)

### Phase 2: UX & Analytics (v0.3.0) ✅ COMPLETED
Focus: Better usability and tracking
- ✅ Autocomplete for container/VM names
- ✅ Parity progress and array errors capabilities
- ✅ Homey Insights integration (8 metrics)
- ✅ Enhanced state tracking

### Phase 3: Refinement (v0.4.0) - OPTIONAL
Focus: Polish and edge cases
- [ ] Container restart loop detection
- [ ] Share low space trigger
- [ ] Batch container updates
- [ ] Additional conditions (exists checks, SMART healthy)
- [ ] Enhanced settings (per-event toggles, filters)

### Phase 4: API-Dependent Features (v1.0.0) - IF API SUPPORTS
Focus: Advanced features requiring API expansion
- [ ] Network throughput (needs API data)
- [ ] Disk I/O rates (needs API data)
- [ ] Per-container resource stats (needs API data)
- [ ] UPS monitoring (needs API data)

**Note**: Phase 4 depends on Unraid API exposing additional data fields

---

## Community Requests

Add user-requested features here:
- [ ] _Open for suggestions_

## Technical Notes

### API Capabilities (Unraid GraphQL)
**✅ Confirmed Working:**
- System: CPU, RAM, uptime, temperature
- Array: status, disks, parity (status, progress, errors)
- Docker: containers (name, state, exitCode, restartCount, image)
- VMs: name, state, resource allocation
- Shares: name, free, used
- Mover: status, running state
- Control: start/stop array, containers, VMs, parity, mover, notifications

**⚠️ Needs API Verification:**
- Network stats (throughput, bandwidth)
- Disk I/O rates per disk
- Per-container CPU/RAM/network usage
- UPS metrics (battery, runtime)

**❌ Not Available in GraphQL API:**
- Container logs (would need Docker socket)
- Container exec (security risk)
- VM snapshots/console (libvirt specific)
- Plugin management (no API)
- User scripts (no API)
- System backups (plugin-specific)

## API Version Support

- **Current**: Unraid 7.x GraphQL API (7.0+)
- **Tested**: Unraid 7.0.0-beta.2
- **Future**: Will monitor Unraid 8.x API changes

---

## Realistic Remaining Potential

### Easy Wins (v0.4.0)
Can be added without API changes:
- Container restart loop detection (track restartCount)
- Share low space trigger (use existing shares data)
- Container/VM exists conditions (check lastState)
- Batch container updates (iterate existing API)
- Restart array action (sequential stop+start)

**Estimated coverage gain**: +5% → 90% total

### Requires API Research (v1.0.0+)
Need to verify API support:
- Network throughput stats
- Disk I/O rates
- Per-container resource usage
- UPS monitoring

**Estimated coverage gain**: +10% IF available → 100% possible total

### Out of Scope
These features are NOT possible with current API architecture:
- Container logs/exec (Docker socket required)
- VM snapshots/console (libvirt access required)
- Plugin management (no API endpoints)
- System backups (plugin-specific)
- User scripts (security risk)
- IPMI/BMC (separate interface)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow.

Priority features from this roadmap are tagged in GitHub Issues.

**Note**: Only features confirmed possible via Unraid GraphQL API will be accepted.

