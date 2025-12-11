# Contributing to Homey Unraid

Thank you for considering contributing to the Homey Unraid app! 

## Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Qballjos/homey-unraid.git
   cd homey-unraid
   ```

2. **Install Node.js 18+**
   ```bash
   nvm install
   nvm use
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Install Homey CLI**
   ```bash
   npm install -g homey
   ```

## Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Update locales if adding UI strings
   - Add flow cards to `app.json` if needed
   - Update README if adding features

3. **Test locally**
   ```bash
   homey app run
   ```

4. **Validate**
   ```bash
   homey app validate --level publish
   ```

5. **Commit with conventional commits**
   ```
   feat: add new flow card for X
   fix: resolve polling issue
   docs: update README with new feature
   chore: update dependencies
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Guidelines

- Use async/await for asynchronous code
- Handle errors gracefully
- Keep polling lightweight
- Log important events with `this.log()` or `this.error()`
- Follow Homey app best practices: https://apps.developer.homey.app/
- Keep dependencies minimal

## Pull Request Process

1. Ensure CI passes (validation check)
2. Update documentation if needed
3. Get at least 1 approval from maintainer
4. Branch protection requires passing status checks

## Adding New Features

### Flow Cards
1. Add to `app.json` under `flow.triggers`, `flow.conditions`, or `flow.actions`
2. Add localized strings to `locales/en.json`
3. Register handlers in `driver.js` or `device.js`
4. Document in README.md

### Settings
1. Add to `drivers/unraid-server/driver.compose.json` settings array
2. Handle in `device.js` `_applySettings()` method
3. Document in README.md

## Questions?

Open an issue for discussion before major changes.

