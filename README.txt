Monitor and control your Unraid server with Homey Pro!

== FEATURES ==

Device Monitoring (with Homey Insights):
• CPU Load (%) - Real-time processor usage
• Memory Used (%) - RAM consumption
• Disk Temperature (°C) - Maximum disk temperature
• Array Space Used (%) - Storage utilization
• Parity Progress (%) - Live parity check tracking
• Array Errors - Error count from parity checks
• Containers Running - Active Docker containers
• VMs Running - Active virtual machines
• Uptime (hours) - Server uptime
• Array Status - Started/stopped/checking/mover
• Alarm - Temperature warning indicator

Flow Triggers (13):
• Array started/stopped
• Parity check started/completed/error detected
• Mover started/finished
• Disk temperature warning
• SMART failure detected
• Container state changed/crashed
• VM state changed
• CPU over threshold

Flow Conditions (7):
• Array is started
• Parity check in progress
• Mover is running
• Disk temperature above threshold
• Free space above threshold
• Container is running
• VM is running

Flow Actions (16):
• Start/stop array
• Start/stop parity check
• Start/stop mover
• Start/stop/restart/update Docker containers
• Start/stop/reboot/pause/resume virtual machines
• Send Unraid notifications (normal/warning/alert)

Advanced Features:
• Autocomplete - Container/VM names populated from your server
• Multi-server support - Monitor unlimited Unraid servers
• Homey Insights - Historical tracking for 8 metrics
• Configurable polling - Adjust intervals and domains
• Safe controls - Opt-in for destructive actions
• Smart triggers - No duplicate notifications

== REQUIREMENTS ==

• Unraid server 7.0 or later
• Unraid GraphQL API enabled
• API key from Unraid Settings → API
• Homey Pro on the same network as Unraid

== SETUP ==

1. Enable API in Unraid:
   - Open Unraid Web UI
   - Go to Settings → API
   - Enable API and generate new API key
   - Copy the API key

2. Add Device in Homey:
   - Open Homey app
   - Go to Settings → Devices → Add Device
   - Search for "Unraid"
   - Select "Unraid Server"

3. Configure Connection:
   - Base URL: http://YOUR_UNRAID_IP:PORT/graphql
     Example: http://192.168.1.100:8080/graphql
   - API Key: Paste the key from step 1
   - Poll Interval: 60 seconds (default)
   - Enable domains: Array, Docker, VMs, Shares
   - Set thresholds: CPU (80%), Disk Temp (60°C)
   - Enable "Allow Control Actions" if you want to start/stop services

4. Verify Connection:
   - Wait 1 minute for first poll
   - Check device card shows metrics
   - View Homey Insights after 10-15 minutes

== EXAMPLE FLOWS ==

Alert on High CPU:
• WHEN: CPU load above threshold
• THEN: Send push notification "Unraid CPU is high!"

Auto-restart Crashed Containers:
• WHEN: Container crashed
• THEN: Restart container [[name]]

Daily Parity Check:
• WHEN: Time is 02:00
• AND: Parity check not in progress
• THEN: Start parity check

Stop Array at Night:
• WHEN: Time is 23:00
• AND: Array is started
• THEN: Stop array

Monitor Disk Temperature:
• WHEN: Disk temperature warning
• THEN: Send notification "Disk [[name]] is hot: [[temp]]°C"

== CONFIGURATION OPTIONS ==

Polling Settings:
• Poll Interval: 30-300 seconds (default: 60)
• Poll Array: System, disks, parity, mover
• Poll Docker: Container monitoring
• Poll VMs: Virtual machine monitoring
• Poll Shares: Storage share monitoring

Thresholds:
• CPU Threshold: 0-100% (default: 80%)
• Disk Temp Threshold: 30-80°C (default: 60°C)

Safety:
• Allow Control Actions: Must be enabled to use start/stop/restart actions
  (Prevents accidental server control)

== HOMEY INSIGHTS ==

These metrics track historical data:
• CPU Load (%)
• Memory Used (%)
• Array Space Used (%)
• Containers Running
• VMs Running
• Uptime (hours)
• Parity Progress (%)
• Array Errors

View graphs to identify patterns, predict issues, and track server health over time.

== MULTI-SERVER SUPPORT ==

You can add multiple Unraid servers:
1. Add new device for each server
2. Configure each with its own URL and API key
3. Create separate flows for each server
4. Monitor all servers from one Homey

== TROUBLESHOOTING ==

Device shows "unavailable":
• Verify URL format: http://IP:PORT/graphql
• Check API key is correct
• Ensure Unraid API is enabled
• Verify network connectivity
• Check firewall allows port 8080

No data showing:
• Enable "Poll" toggles in device settings
• Wait 1-2 minutes for first poll
• Check Unraid Web UI is accessible
• Verify API key has not expired

Autocomplete not working:
• Wait for first successful poll
• Ensure containers/VMs exist on server
• Check device shows correct counts

Actions not working:
• Enable "Allow Control Actions" in device settings
• Verify you have permission in Unraid
• Check container/VM names are correct (use autocomplete)

== SUPPORT ==

• GitHub Issues: https://github.com/Qballjos/homey-unraid/issues
• Discussions: https://github.com/Qballjos/homey-unraid/discussions
• Documentation: https://github.com/Qballjos/homey-unraid

== ABOUT ==

Version: 0.3.0
Author: Jos Visser
License: MIT
Repository: https://github.com/Qballjos/homey-unraid

Made with ❤️ for the Unraid and Homey communities.

