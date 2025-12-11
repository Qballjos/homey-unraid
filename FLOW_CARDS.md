# Flow Cards Reference

Complete reference for all available flow cards in the Homey Unraid app.

## 📢 Triggers (16)

Flow cards that trigger when specific events occur.

### Array & Parity

#### `array_started`
**When:** Array starts
**Tokens:** None

#### `array_stopped`
**When:** Array stops
**Tokens:** None

#### `parity_completed`
**When:** Parity check completes
**Tokens:** None

#### `parity_started`
**When:** Parity check starts
**Tokens:** None

#### `parity_error`
**When:** Parity check finds errors
**Tokens:**
- `{{errors}}` (number) - Number of errors found

**Example:**
```
WHEN Parity check error detected
  {{errors}} = 3
THEN Send notification:
  "⚠️ Parity check found {{errors}} errors!"
```

---

### Mover

#### `mover_started`
**When:** Cache mover starts
**Tokens:** None

#### `mover_finished`
**When:** Cache mover finishes
**Tokens:** None

---

### Disk Health

#### `disk_temp_warning`
**When:** Disk temperature exceeds threshold
**Tokens:**
- `{{name}}` (string) - Disk name
- `{{temp}}` (number) - Temperature in °C

**Example:**
```
WHEN Disk temperature warning
  {{name}} = "disk1"
  {{temp}} = 55°C
THEN Send notification:
  "🔥 Disk {{name}} is hot: {{temp}}°C"
```

#### `smart_failure`
**When:** SMART failure detected on disk
**Tokens:**
- `{{name}}` (string) - Disk name

**Example:**
```
WHEN SMART failure detected
  {{name}} = "disk2"
THEN Send urgent alert:
  "🚨 CRITICAL: Disk {{name}} SMART failure!"
```

---

### Docker Containers

#### `container_state_changed`
**When:** Container changes state (any transition)
**Tokens:**
- `{{container_name}}` (string) - Container name
- `{{old_state}}` (string) - Previous state
- `{{new_state}}` (string) - Current state
- `{{status}}` (string) - Status text (e.g., "Up 2 hours")
- `{{auto_start}}` (boolean) - Auto-start enabled

**Example:**
```
WHEN Container state changed
  {{container_name}} = "plex"
  {{new_state}} = "STOPPED"
THEN Log to file:
  "Container {{container_name}}: {{old_state}} → {{new_state}}"
```

#### `container_started`
**When:** Container starts running
**Tokens:**
- `{{container_name}}` (string) - Container name
- `{{status}}` (string) - Status text
- `{{auto_start}}` (boolean) - Auto-start enabled

**Example:**
```
WHEN Container started
  {{container_name}} = "jellyfin"
THEN Send notification:
  "✅ {{container_name}} is running"
```

#### `container_stopped`
**When:** Container stops
**Tokens:**
- `{{container_name}}` (string) - Container name
- `{{status}}` (string) - Status text
- `{{was_auto_start}}` (boolean) - Had auto-start enabled

**Example:**
```
WHEN Container stopped
  {{container_name}} = "traefik"
  {{was_auto_start}} = true
THEN Send urgent notification:
  "⚠️ Critical service {{container_name}} stopped!"
```

#### `container_crashed`
**When:** Container exits with non-zero exit code
**Tokens:**
- `{{container_name}}` (string) - Container name
- `{{exit_code}}` (number) - Exit code
- `{{status}}` (string) - Status text
- `{{auto_start}}` (boolean) - Auto-start enabled

**Example:**
```
WHEN Container crashed
  {{exit_code}} != 0
THEN Send alert:
  "❌ {{container_name}} crashed (exit {{exit_code}})"
```

---

### Virtual Machines

#### `vm_state_changed`
**When:** VM changes state (any transition)
**Tokens:**
- `{{vm_name}}` (string) - VM name
- `{{vm_id}}` (string) - VM UUID
- `{{old_state}}` (string) - Previous state
- `{{new_state}}` (string) - Current state

**Example:**
```
WHEN VM state changed
  {{vm_name}} contains "Windows"
  {{new_state}} = "RUNNING"
THEN Turn on desk lamp
```

#### `vm_started`
**When:** VM starts running
**Tokens:**
- `{{vm_name}}` (string) - VM name
- `{{vm_id}}` (string) - VM UUID

**Example:**
```
WHEN VM started
  {{vm_name}} = "Ubuntu Server"
THEN Send notification:
  "💻 {{vm_name}} is ready!"
```

#### `vm_stopped`
**When:** VM stops
**Tokens:**
- `{{vm_name}}` (string) - VM name
- `{{vm_id}}` (string) - VM UUID

**Example:**
```
WHEN VM stopped
THEN Log to spreadsheet:
  "VM {{vm_name}} stopped at {time}"
```

---

### System

#### `cpu_over_threshold`
**When:** CPU usage exceeds configured threshold
**Args:**
- `percent` (number) - CPU percentage

**Example:**
```
WHEN CPU usage over threshold
  percent = 85%
THEN Send warning
```

---

### Shares

#### `share_space_low`
**When:** Share exceeds space threshold
**Tokens:**
- `{{share_name}}` (string) - Share name
- `{{free_gb}}` (number) - Free space in GB
- `{{used_gb}}` (number) - Used space in GB
- `{{total_gb}}` (number) - Total size in GB
- `{{used_percent}}` (number) - Used percentage
- `{{free_percent}}` (number) - Free percentage

**Example:**
```
WHEN Share space low
  {{share_name}} = "media"
  {{used_percent}} >= 90%
THEN Send notification:
  "⚠️ Share {{share_name}} is {{used_percent}}% full!
   Only {{free_gb}}GB of {{total_gb}}GB remaining"
```

---

## ✅ Conditions (7)

Flow cards that check current state (true/false).

### Array

#### `array_is_started`
**Checks:** If array is currently started
**Returns:** true/false

**Example:**
```
IF Array is started
THEN Allow backup operations
```

#### `parity_in_progress`
**Checks:** If parity check is running
**Returns:** true/false

**Example:**
```
IF Parity check in progress
THEN Delay intensive operations
```

#### `mover_is_running`
**Checks:** If cache mover is running
**Returns:** true/false

**Example:**
```
IF Mover is running
THEN Show "Mover active" status
```

---

### Storage

#### `disk_temp_above`
**Checks:** If specific disk temperature exceeds threshold
**Args:**
- `name` (text) - Disk name (e.g., "disk1")
- `threshold` (number) - Temperature threshold in °C

**Returns:** true/false

**Example:**
```
IF Disk temperature above
  name = "disk1"
  threshold = 50°C
THEN Increase fan speed
```

#### `free_space_above`
**Checks:** If share/cache has more than X% free space
**Args:**
- `name` (text) - Share or cache name
- `threshold` (number) - Free space percentage

**Returns:** true/false

**Example:**
```
IF Free space above
  name = "media"
  threshold = 20%
THEN Download new content
ELSE Send low space warning
```

---

### Docker & VMs

#### `container_is_running`
**Checks:** If specific container is running
**Args:**
- `name` (autocomplete) - Container name

**Returns:** true/false

**Example:**
```
IF Container is running
  name = "plex"
THEN Allow media streaming
```

#### `vm_is_running`
**Checks:** If specific VM is running
**Args:**
- `name` (autocomplete) - VM name

**Returns:** true/false

**Example:**
```
IF VM is running
  name = "Windows 11"
THEN Turn on monitor
```

---

## ⚡ Actions (17)

Flow cards that perform operations.

### Array Management

#### `start_array`
**Action:** Start the Unraid array
**Args:** None
**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN Morning routine starts
THEN Start array
```

#### `stop_array`
**Action:** Stop the Unraid array
**Args:** None
**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN Everyone leaves home
THEN Stop array
```

---

### Parity Check

#### `start_parity_check`
**Action:** Start parity check
**Args:** None
**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN It's 3 AM on Sunday
THEN Start parity check
```

#### `stop_parity_check`
**Action:** Stop running parity check
**Args:** None
**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN CPU usage > 90%
AND Parity check in progress
THEN Stop parity check
```

---

### Cache Mover

#### `start_mover`
**Action:** Start cache mover
**Args:** None
**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN It's 4 AM daily
THEN Start mover
```

#### `stop_mover`
**Action:** Stop cache mover
**Args:** None
**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN High network activity detected
THEN Stop mover
```

---

### Docker Containers

#### `start_container`
**Action:** Start a Docker container
**Args:**
- `name` (autocomplete) - Container name

**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN Movie night starts
THEN Start container "plex"
```

#### `stop_container`
**Action:** Stop a Docker container
**Args:**
- `name` (autocomplete) - Container name

**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN Power saving mode
THEN Stop container "jellyfin"
```

#### `restart_container`
**Action:** Restart a Docker container
**Args:**
- `name` (autocomplete) - Container name

**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN Container "nginx" crashed
THEN Restart container "nginx"
```

#### `update_container`
**Action:** Update container (pull latest image)
**Args:**
- `name` (autocomplete) - Container name

**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN It's 3 AM on Monday
THEN Update container "plex"
```

---

### Virtual Machines

#### `start_vm`
**Action:** Start a virtual machine
**Args:**
- `name` (autocomplete) - VM name

**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN Work day starts
THEN Start VM "Windows 11"
```

#### `stop_vm`
**Action:** Stop a virtual machine
**Args:**
- `name` (autocomplete) - VM name

**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN Work day ends
THEN Stop VM "Ubuntu Server"
```

#### `reboot_vm`
**Action:** Reboot a virtual machine
**Args:**
- `name` (autocomplete) - VM name

**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN Windows update completed
THEN Reboot VM "Windows 11"
```

#### `pause_vm`
**Action:** Pause a virtual machine
**Args:**
- `name` (autocomplete) - VM name

**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN High CPU usage
THEN Pause VM "test-vm"
```

#### `resume_vm`
**Action:** Resume a paused virtual machine
**Args:**
- `name` (autocomplete) - VM name

**Requires:** `allowControl = true` in settings

**Example:**
```
WHEN CPU usage normal
THEN Resume VM "test-vm"
```

---

### Notifications

#### `send_unraid_notification`
**Action:** Send notification to Unraid dashboard
**Args:**
- `level` (dropdown) - Severity: normal/warning/alert
- `message` (text) - Notification message

**Example:**
```
WHEN Disk temperature > 60°C
THEN Send Unraid notification
  level = "alert"
  message = "Disk overheating!"
```

---

### Utility

#### `force_refresh`
**Action:** Force immediate data refresh from server
**Args:**
- `device` (device) - Unraid server device

**Example:**
```
WHEN Button pressed
THEN Force refresh data from Unraid server
```

---

## 📊 Quick Reference Table

### Triggers Summary

| Category | Trigger | Tokens |
|----------|---------|--------|
| **Array** | array_started | - |
| **Array** | array_stopped | - |
| **Parity** | parity_completed | - |
| **Parity** | parity_started | - |
| **Parity** | parity_error | errors |
| **Mover** | mover_started | - |
| **Mover** | mover_finished | - |
| **Disk** | disk_temp_warning | name, temp |
| **Disk** | smart_failure | name |
| **Container** | container_state_changed | container_name, old_state, new_state, status, auto_start |
| **Container** | container_started | container_name, status, auto_start |
| **Container** | container_stopped | container_name, status, was_auto_start |
| **Container** | container_crashed | container_name, exit_code, status, auto_start |
| **VM** | vm_state_changed | vm_name, vm_id, old_state, new_state |
| **VM** | vm_started | vm_name, vm_id |
| **VM** | vm_stopped | vm_name, vm_id |
| **CPU** | cpu_over_threshold | percent |
| **Share** | share_space_low | share_name, free_gb, used_gb, total_gb, used_percent, free_percent |

### Conditions Summary

| Category | Condition | Args |
|----------|-----------|------|
| **Array** | array_is_started | - |
| **Parity** | parity_in_progress | - |
| **Mover** | mover_is_running | - |
| **Disk** | disk_temp_above | name, threshold |
| **Storage** | free_space_above | name, threshold |
| **Container** | container_is_running | name (autocomplete) |
| **VM** | vm_is_running | name (autocomplete) |

### Actions Summary

| Category | Action | Args | Control Required |
|----------|--------|------|------------------|
| **Array** | start_array | - | ✅ |
| **Array** | stop_array | - | ✅ |
| **Parity** | start_parity_check | - | ✅ |
| **Parity** | stop_parity_check | - | ✅ |
| **Mover** | start_mover | - | ✅ |
| **Mover** | stop_mover | - | ✅ |
| **Container** | start_container | name (autocomplete) | ✅ |
| **Container** | stop_container | name (autocomplete) | ✅ |
| **Container** | restart_container | name (autocomplete) | ✅ |
| **Container** | update_container | name (autocomplete) | ✅ |
| **VM** | start_vm | name (autocomplete) | ✅ |
| **VM** | stop_vm | name (autocomplete) | ✅ |
| **VM** | reboot_vm | name (autocomplete) | ✅ |
| **VM** | pause_vm | name (autocomplete) | ✅ |
| **VM** | resume_vm | name (autocomplete) | ✅ |
| **Notification** | send_unraid_notification | level, message | - |
| **Utility** | force_refresh | device | - |

---

## 🎯 Advanced Flow Examples

### Example 1: Smart Container Recovery
```
WHEN Container stopped
  {{container_name}} = "plex"
  {{was_auto_start}} = true
AND Container is running "plex" = false
THEN 
  Wait 5 seconds
  Start container "plex"
  Send notification: "Restarted {{container_name}}"
```

### Example 2: Space Management
```
WHEN Share space low
  {{used_percent}} >= 90%
THEN
  Send notification:
    "⚠️ {{share_name}}: {{used_percent}}% full
     Free: {{free_gb}}GB / Total: {{total_gb}}GB"
  Start mover
  Log to Google Sheets
```

### Example 3: Temperature Monitoring
```
WHEN Disk temperature warning
  {{temp}} > 55°C
THEN
  Send urgent alert
  IF Parity check in progress
    THEN Stop parity check
  Start cooling protocol
```

### Example 4: VM Automation
```
WHEN VM started
  {{vm_name}} = "Windows 11"
THEN
  Wait 60 seconds
  Turn on monitor
  Set scene to "Work Mode"
  Send notification: "💻 {{vm_name}} ready!"
```

### Example 5: Maintenance Scheduler
```
WHEN It's 3 AM on Sunday
AND Array is started
AND Parity check in progress = false
THEN
  Start parity check
  Send notification: "Starting weekly parity check"
```

### Example 6: Container Health Dashboard
```
WHEN Container state changed
THEN
  Update variable:
    name = "last_container_event"
    value = "{{container_name}}: {{new_state}}"
  Log to file:
    "{{time}} | {{container_name}} | {{old_state}} → {{new_state}} | Auto: {{auto_start}}"
```

---

## 💡 Tips & Best Practices

### Using Autocomplete
- Container and VM names are populated from your live server
- Start typing to filter results
- Shows current state (running/stopped)
- No more typos in flow cards!

### Using Flow Tags
- All tags are available in THEN actions
- Use `{{tag_name}}` syntax in notifications, logic cards, etc.
- Tags update in real-time with current values
- Boolean tags: `{{auto_start}}` = true/false

### Control Actions
- **Security**: All control actions require `allowControl = true` in device settings
- Disabled by default for safety
- Enable only if you trust your Homey security

### Performance
- Use specific triggers (container_started) instead of generic (container_state_changed) when possible
- Combine conditions to reduce unnecessary flow executions
- Use Force Refresh sparingly (it polls the server immediately)

---

## 🔧 Configuration Notes

### Enable Poll Settings
To use certain triggers/conditions, enable their poll settings:
- **Share triggers**: Enable `pollShares` in device settings
- **Container triggers**: Enable `pollDocker` in device settings
- **VM triggers**: Enable `pollVms` in device settings
- **Array triggers**: Enable `pollArray` in device settings

### Thresholds
Configure in device settings:
- **CPU Threshold**: When to trigger cpu_over_threshold
- **Disk Temp Threshold**: When to trigger disk_temp_warning
- **Share Space Threshold**: When to trigger share_space_low

---

**Total Flow Cards: 40** (16 triggers + 7 conditions + 17 actions)

Perfect for comprehensive Unraid automation! 🚀

