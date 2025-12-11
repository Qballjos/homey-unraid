# Enable GitHub Discussions - Quick Guide

## ⚡ 5-Minute Setup

### Step 1: Enable the Feature

1. Open your browser
2. Go to: **https://github.com/Qballjos/homey-unraid/settings**
3. Scroll to **"Features"** section (about halfway down)
4. Find the **"Discussions"** checkbox
5. ✅ Check it
6. Click **"Set up discussions"** button

### Step 2: GitHub Creates Welcome Discussion

GitHub will automatically:
- Create the discussions tab
- Prompt you to create a welcome post
- Set up default categories

### Step 3: Customize Welcome Post

Replace the default text with this:

```markdown
# 👋 Welcome to Homey Unraid Discussions!

## 🎉 What is this?

This is the community hub for **Homey Unraid** - integrate your Unraid server with Homey Pro!

## 🚀 Quick Start

### Current Status (v0.3.0)
- ✅ 11 device capabilities (8 with Insights)
- ✅ 36 flow cards (13 triggers, 7 conditions, 16 actions)
- ✅ ~85% coverage of Unraid GraphQL API
- ✅ Multi-server support

### What Can You Do?
- Monitor CPU, RAM, disk temp, array status
- Track containers and VMs with live data
- Get notified of parity checks, crashes, alerts
- Control array, containers, VMs via flows
- View historical trends with Homey Insights

## 💬 How to Use Discussions

### 🙋 Need Help?
**[Q&A Category](https://github.com/Qballjos/homey-unraid/discussions/categories/q-a)**
- Setup questions
- Troubleshooting
- Flow help
- Configuration issues

### 💡 Have an Idea?
**[Ideas Category](https://github.com/Qballjos/homey-unraid/discussions/categories/ideas)**
- Feature requests
- Enhancements
- Check the [roadmap](https://github.com/Qballjos/homey-unraid/blob/main/FUTURE_ROADMAP.md) first!

### 🎨 Built Something Cool?
**[Show & Tell Category](https://github.com/Qballjos/homey-unraid/discussions/categories/show-and-tell)**
- Share your flows
- Show automations
- Inspire others

### 📢 Stay Updated
**[Announcements](https://github.com/Qballjos/homey-unraid/discussions/categories/announcements)**
- New releases
- Important updates
- Breaking changes

## 📚 Resources

- 📖 [Documentation](https://github.com/Qballjos/homey-unraid#readme)
- 🗺️ [Roadmap](https://github.com/Qballjos/homey-unraid/blob/main/FUTURE_ROADMAP.md)
- 📋 [Discussion Guide](https://github.com/Qballjos/homey-unraid/blob/main/DISCUSSIONS_GUIDE.md)
- 🐛 [Report Bugs](https://github.com/Qballjos/homey-unraid/issues)

## 🤝 Community Guidelines

- **Search first** - Your question might be answered
- **Be specific** - Provide context and examples
- **Be respectful** - We're all here to help
- **Mark answers** - Help others find solutions
- **Share knowledge** - Answer when you can

Read the full [Discussion Guide](https://github.com/Qballjos/homey-unraid/blob/main/DISCUSSIONS_GUIDE.md)

## 🙏 Thank You!

This project is built by the community, for the community. Your feedback makes it better!

**Let's automate!** 🚀

---

**Maintainer**: [@Qballjos](https://github.com/Qballjos)  
**Website**: https://josvisserict.nl
```

### Step 4: Edit Categories (Optional but Recommended)

After creating welcome post, go to:
**https://github.com/Qballjos/homey-unraid/discussions/categories**

GitHub creates default categories. You can:
- Rename them
- Add these recommended ones:
  - 📢 Announcements (only maintainers can post)
  - 💡 Ideas
  - 🙋 Q&A (enable "mark as answer")
  - 🎨 Show and Tell
  - 🔧 Development
  - 📊 Polls
  - 🌍 General

### Step 5: Create Your First Discussion

Create a pinned FAQ in Q&A category:

**Title**: ⭐ Frequently Asked Questions

**Content**:
```markdown
## 🔑 How do I get my Unraid API key?

1. Open Unraid Web UI
2. Settings → API
3. Generate new API key
4. Copy and paste in Homey app settings

## 🔄 How often does it poll Unraid?

Default: 60 seconds (configurable in device settings)

## 🚨 Device shows "unavailable"?

Check:
- ✅ API URL format: `http://YOUR_IP:PORT/graphql`
- ✅ API key is correct
- ✅ Unraid API is enabled
- ✅ Network connectivity
- ✅ Firewall allows connections

## 🐳 How to restart a container?

Flow: THEN → Restart container → Select from dropdown

## 🖥️ Multiple servers?

Yes! Add multiple devices, one per server.

## 📊 Insights not showing?

Wait 1-2 poll cycles. Insights track changes over time.

_Add your question below!_
```

---

## ✅ That's It!

After enabling:
- ✅ Discussions will be live at: https://github.com/Qballjos/homey-unraid/discussions
- ✅ Tab appears in your repo navigation
- ✅ Community can start posting
- ✅ All templates and guides are ready to use

---

## 🎯 Quick Tips

1. **Pin important discussions** - FAQ, voting
2. **Respond quickly** - Sets a good tone
3. **Mark answers** - In Q&A category
4. **Watch announcements** - Turn on notifications
5. **Encourage sharing** - React and comment

---

## 🆘 Need Help?

All the templates are in:
- `.github/DISCUSSIONS_SETUP.md` - Full setup guide
- `.github/DISCUSSION_TEMPLATE.md` - Category templates
- `DISCUSSIONS_GUIDE.md` - Community guidelines

**Enable it now - takes 2 minutes!** ⏱️

