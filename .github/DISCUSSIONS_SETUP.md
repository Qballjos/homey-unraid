# GitHub Discussions Setup Instructions

## 🎯 Enabling Discussions on Your Repository

Follow these steps to enable GitHub Discussions for the Homey Unraid project:

### Step 1: Enable Discussions

1. Go to: https://github.com/Qballjos/homey-unraid/settings
2. Scroll down to the **Features** section
3. Check the box next to **Discussions**
4. Click **Set up discussions**

### Step 2: Create Welcome Post

GitHub will prompt you to create a welcome post. Use this template:

```markdown
# 👋 Welcome to Homey Unraid Discussions!

## 🎉 What is this?

This is the community hub for Homey Unraid - the best way to integrate your Unraid server with Homey Pro!

## 🚀 Quick Links

- 📖 [Documentation](https://github.com/Qballjos/homey-unraid#readme)
- 🗺️ [Roadmap](https://github.com/Qballjos/homey-unraid/blob/main/FUTURE_ROADMAP.md)
- 📋 [Discussion Guide](https://github.com/Qballjos/homey-unraid/blob/main/DISCUSSIONS_GUIDE.md)
- 🐛 [Report Bugs](https://github.com/Qballjos/homey-unraid/issues)

## 💬 How to Use Discussions

### 🙋 Need Help?
Use **Q&A** category to ask questions about setup, flows, or troubleshooting.

### 💡 Have an Idea?
Use **Ideas** category to propose new features. Check the [roadmap](https://github.com/Qballjos/homey-unraid/blob/main/FUTURE_ROADMAP.md) first!

### 🎨 Built Something Cool?
Use **Show & Tell** to share your awesome Homey flows and automations.

### 📢 Stay Updated
Watch **Announcements** for new releases and important updates.

## ✨ Current Status

- **Version**: v0.3.0
- **Capabilities**: 11 device metrics (8 with Insights)
- **Flow Cards**: 36 total (13 triggers, 7 conditions, 16 actions)
- **Coverage**: ~85% of Unraid GraphQL API

## 🎯 What Can You Do?

With this app, you can:
- ✅ Monitor CPU, RAM, disk temp, array status
- ✅ Track containers and VMs
- ✅ Get notified of parity checks, mover activity, crashes
- ✅ Control array, containers, VMs via Homey flows
- ✅ View historical trends with Homey Insights
- ✅ And much more!

## 🤝 Guidelines

- **Search first** before posting
- **Be respectful** and helpful
- **Share knowledge** - help others when you can
- **Mark answers** that solve your problem
- Read the full [Discussion Guide](https://github.com/Qballjos/homey-unraid/blob/main/DISCUSSIONS_GUIDE.md)

## 🙏 Thank You!

This project is built by the community, for the community. Your feedback and contributions make it better!

**Let's automate!** 🚀

---

**Maintainer**: [@Qballjos](https://github.com/Qballjos)
```

### Step 3: Configure Categories

After enabling, go to: https://github.com/Qballjos/homey-unraid/discussions/categories

Configure these categories:

#### 📢 Announcements
- **Format**: Announcement
- **Description**: Official updates, releases, and important news from maintainers
- **Settings**: Only maintainers can post, everyone can comment

#### 💡 Ideas
- **Format**: Open-ended discussion
- **Description**: Propose new features and enhancements. Check the roadmap first!
- **Settings**: Everyone can post and comment

#### 🙋 Q&A
- **Format**: Question/Answer
- **Description**: Get help with setup, troubleshooting, and usage
- **Settings**: Everyone can post and comment, mark answers

#### 🎨 Show and Tell
- **Format**: Open-ended discussion
- **Description**: Share your awesome Homey flows and automation ideas
- **Settings**: Everyone can post and comment

#### 🔧 Development
- **Format**: Open-ended discussion
- **Description**: Technical discussions for contributors
- **Settings**: Everyone can post and comment

#### 📊 Polls
- **Format**: Poll
- **Description**: Vote on features and provide feedback
- **Settings**: Everyone can post and comment

#### 🌍 General
- **Format**: Open-ended discussion
- **Description**: Anything else related to Homey Unraid
- **Settings**: Everyone can post and comment

### Step 4: Pin Important Discussions

After creating the welcome post, pin these discussions:

1. **Welcome Post** (already created)
2. Create and pin: **"Frequently Asked Questions"**
3. Create and pin: **"Feature Voting - What's Next?"**

---

## 🎯 Suggested First Discussions

### FAQ Discussion

**Category**: Q&A  
**Title**: ⭐ Frequently Asked Questions

```markdown
## 🔑 How do I get my Unraid API key?

1. Open Unraid Web UI
2. Go to Settings → API
3. Generate a new API key
4. Copy the key and paste it in Homey app settings

## 🔄 How often does the app poll Unraid?

Default: 60 seconds. You can adjust this in device settings.

## 🚨 My device shows "unavailable", what's wrong?

Common causes:
1. Wrong API URL or key
2. Unraid API not enabled
3. Network connectivity issues
4. Firewall blocking requests

Check Homey app logs for details.

## 🐳 How do I restart a container in a flow?

1. WHEN: [your trigger]
2. THEN: **Restart container** action
3. SELECT: Container name (autocomplete)
4. Done!

## 🖥️ Can I monitor multiple Unraid servers?

Yes! Add multiple devices, one per server.

## 📊 What metrics support Insights?

8 metrics:
- CPU Load
- Memory Used
- Array Space Used
- Containers Running
- VMs Running
- Uptime
- Parity Progress
- Array Errors

_Add your question below!_
```

### Feature Voting Discussion

**Category**: Polls  
**Title**: 🗳️ What Features Should We Build Next?

```markdown
Vote on the features you want most! See the full [roadmap](https://github.com/Qballjos/homey-unraid/blob/main/FUTURE_ROADMAP.md).

## Quick Wins (Easy to Add)
- [ ] Container restart loop detection
- [ ] Share low space trigger
- [ ] Container/VM exists conditions
- [ ] Batch container updates
- [ ] Restart array action

## Requires API Research
- [ ] Network throughput stats
- [ ] Disk I/O rates
- [ ] Per-container CPU/RAM usage
- [ ] UPS monitoring

Vote by reacting with 👍 to features you want!

Comment with your use case to help prioritize.
```

### Show & Tell Starter

**Category**: Show and Tell  
**Title**: 🎨 Share Your Best Flows!

```markdown
Got a cool Homey flow using Unraid? Share it here!

## Template

**What it does**: [description]

**My flow**:
1. WHEN: [trigger]
2. AND IF: [condition]
3. THEN: [action]

**Why I built it**: [use case]

**Screenshot**: [optional]

---

_Be the first to share!_
```

---

## 📧 After Setup

Once discussions are enabled:

1. Update README.md to link to discussions
2. Announce on social media (if applicable)
3. Invite beta testers to discussions
4. Monitor and respond to first posts

---

## 🎯 Moderation Guidelines

### As Maintainer

**Do**:
- ✅ Respond within 24-48 hours
- ✅ Mark helpful answers in Q&A
- ✅ Pin important discussions
- ✅ Welcome new members
- ✅ Convert feature requests to issues when approved
- ✅ Lock resolved discussions after 30 days

**Don't**:
- ❌ Delete discussions unless spam/abuse
- ❌ Close discussions prematurely
- ❌ Ignore feedback
- ❌ Let discussions become issue trackers

### Handling Issues

**Spam**: Lock and hide immediately  
**Off-topic**: Politely redirect to appropriate category  
**Duplicate**: Link to original and lock  
**Toxic behavior**: Warn once, then ban

---

## 🚀 Launch Checklist

- [ ] Enable Discussions in repository settings
- [ ] Create welcome post
- [ ] Configure 7 categories
- [ ] Create and pin FAQ discussion
- [ ] Create and pin feature voting discussion
- [ ] Create show & tell starter
- [ ] Update README with discussions link
- [ ] Announce to users
- [ ] Monitor daily for first week

---

**Ready to build a great community!** 🎉

