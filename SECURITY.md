# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability in this Homey app, please report it privately:

1. **Email**: qballjos@gmail.com
2. **Subject**: [Security] Homey Unraid vulnerability

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Do not** open a public issue for security vulnerabilities.

## Security Best Practices

### API Key Storage
- API keys are stored securely via Homey's settings system
- Never commit API keys to the repository
- API keys are never logged

### Network Security
- All communication with Unraid server uses HTTPS (if configured)
- API bearer tokens are sent in headers
- No credentials stored in plain text

### Control Actions
- Destructive actions (stop array, etc.) require explicit opt-in via "Allow control actions" setting
- All mutations are guarded by control permission check
- Failed auth attempts mark device unavailable

## Dependency Security

We use:
- GitHub Dependabot for automated dependency updates
- Minimal dependencies (only `node-fetch`)
- Regular audits via `npm audit`

To check for vulnerabilities:
```bash
npm audit
```

## Responsible Disclosure

We follow responsible disclosure practices and will:
1. Acknowledge receipt within 48 hours
2. Provide an estimated timeline for fix
3. Notify you when fix is released
4. Credit you (if desired) in release notes

Thank you for helping keep Homey Unraid secure!


