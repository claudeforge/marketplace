---
name: openclaw-setup
description: |
  One command to install and secure OpenClaw AI Assistant.
  Generates 32-byte security token, applies hardened config, blocks dangerous tools.
userInvocable: true
---

# OpenClaw Setup

> **One command. Full security.** Set up your personal AI assistant the right way.

## Overview

OpenClaw Setup automates the complete installation and security hardening of [OpenClaw](https://openclaw.ai) AI Assistant. Instead of 15+ manual configuration steps, you run one command and get enterprise-grade security defaults.

## What is OpenClaw?

OpenClaw is a personal AI assistant that runs on your own devices. It connects to messaging channels you already use (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Microsoft Teams) and provides AI assistance across all of them.

## The Problem

Setting up OpenClaw securely requires:
- Installing the CLI
- Generating cryptographic tokens
- Configuring gateway authentication
- Setting up channel policies
- Enabling sandbox mode
- Blocking dangerous tools
- Hardening file permissions
- Running security audits

**15+ steps that most users skip or misconfigure.**

## The Solution

```bash
/openclaw-setup
```

One command. Done.

## Commands

| Command | Description |
|---------|-------------|
| `/openclaw-setup` | Full install + security hardening |
| `/openclaw-setup install` | Install OpenClaw only |
| `/openclaw-setup security` | Apply security config only |
| `/openclaw-setup audit` | Run security audit only |

## What Gets Configured

### Network Security

| Setting | Value | Effect |
|---------|-------|--------|
| Gateway Binding | `loopback` | Only local access allowed |
| Gateway Port | `18789` | Standard OpenClaw port |
| Authentication | `token` | 32-byte cryptographic token required |
| mDNS Discovery | `off` | No network broadcast |

### Access Control

| Setting | Value | Effect |
|---------|-------|--------|
| DM Policy | `pairing` | Pairing code required for new contacts |
| Group Policy | `requireMention` | Bot only responds when mentioned |
| Session Scope | `per-channel-peer` | Isolated sessions per contact |

### Sandbox Configuration

| Setting | Value | Effect |
|---------|-------|--------|
| Sandbox Mode | `all` | All tools run in sandbox |
| Sandbox Scope | `agent` | Per-agent isolation |
| Workspace Access | `ro` | Read-only workspace |

### Tool Permissions

**Blocked Tools (Dangerous):**
- `exec` - Shell command execution
- `write` - File writing
- `edit` - File modification
- `process` - Process control
- `browser` - Browser automation
- `apply_patch` - Code patching

**Allowed Tools (Safe):**
- `read` - File reading
- `search` - Code search
- `web_search` - Web searching
- `web_fetch` - Web page fetching

### Logging & Privacy

| Setting | Value | Effect |
|---------|-------|--------|
| Redact Sensitive | `tools` | Sensitive data redacted from tool logs |
| Redact Patterns | API keys, tokens, passwords | Auto-redacted in logs |

### File Permissions

| Path | Permission | Description |
|------|------------|-------------|
| `~/.openclaw/` | `700` | Directory only accessible by owner |
| `~/.openclaw/openclaw.json` | `600` | Config only readable by owner |
| `~/.openclaw/credentials/` | `700` | Credentials directory protected |
| `~/.openclaw/agents/` | `700` | Agent data protected |

## Execution Phases

### Phase 1: Installation Check

```bash
# Check if OpenClaw is installed
which openclaw || openclaw --version

# If not installed, install via npm or curl
npm i -g openclaw
# or
curl -fsSL https://openclaw.ai/install.sh | bash

# Verify installation
openclaw --version
```

### Phase 2: Token Generation

```bash
# Generate 32-byte cryptographic token
openssl rand -base64 32
```

**Important:** Save this token securely. You'll need it to authenticate with the gateway.

### Phase 3: Configuration

Creates `~/.openclaw/openclaw.json` with hardened security settings:

```json
{
  "gateway": {
    "bind": "loopback",
    "port": 18789,
    "auth": {
      "mode": "token",
      "token": "YOUR_GENERATED_TOKEN"
    }
  },
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",
      "groups": { "*": { "requireMention": true } }
    },
    "telegram": {
      "dmPolicy": "pairing",
      "groups": { "*": { "requireMention": true } }
    }
  },
  "agents": {
    "defaults": {
      "sandbox": {
        "mode": "all",
        "scope": "agent",
        "workspaceAccess": "ro"
      }
    }
  },
  "tools": {
    "allow": ["read", "search", "web_search", "web_fetch"],
    "deny": ["write", "edit", "exec", "process", "browser", "apply_patch"],
    "elevated": { "allowFrom": {} }
  },
  "logging": {
    "redactSensitive": "tools",
    "redactPatterns": ["api_key", "apiKey", "secret", "password", "token", "credential"]
  },
  "discovery": { "mdns": { "mode": "off" } },
  "session": { "dmScope": "per-channel-peer" }
}
```

### Phase 4: Permission Hardening

```bash
chmod 700 ~/.openclaw
chmod 600 ~/.openclaw/openclaw.json
chmod -R 700 ~/.openclaw/credentials 2>/dev/null || true
chmod -R 700 ~/.openclaw/agents 2>/dev/null || true
chmod 700 ~/.openclaw/identity 2>/dev/null || true
```

### Phase 5: Security Audit

```bash
openclaw security audit
```

**Goal:** Zero CRITICAL issues.

If issues are found:
```bash
openclaw security audit --fix  # Auto-fix issues
openclaw security audit --deep # Detailed audit
```

## After Setup

### 1. Complete Onboarding

```bash
openclaw onboard
```

This interactive wizard helps you:
- Configure your preferred AI model
- Set up your first channel
- Test the connection

### 2. Connect WhatsApp

```bash
openclaw channels login whatsapp
```

Scan the QR code with your phone to connect.

### 3. Verify Status

```bash
openclaw status
```

Expected output shows all systems operational.

## Troubleshooting

### Installation Fails

```bash
# Try npm install
npm i -g openclaw

# Verify Node.js version (22+ required)
node --version

# Check for permission issues
sudo npm i -g openclaw
```

### Security Audit Fails

```bash
# Auto-fix most issues
openclaw security audit --fix

# Deep audit for detailed analysis
openclaw security audit --deep

# Check configuration
openclaw doctor
openclaw doctor --fix
```

### Gateway Won't Start

```bash
# Check if port is in use
lsof -i :18789

# Restart with verbose logging
openclaw gateway run --verbose

# Check logs
tail -f ~/.openclaw/logs/gateway.log
```

## Security Rationale

### Why Loopback Binding?

Network binding exposes your AI assistant to anyone on your network. Loopback binding ensures only local processes can communicate with the gateway.

### Why Token Authentication?

Without authentication, any process on your machine could control your AI. Token authentication provides a shared secret that must be presented for access.

### Why Pairing Policy?

Without pairing, anyone who messages you could interact with your AI. Pairing requires explicit approval for each new contact.

### Why Sandbox Mode?

AI agents can execute code. Sandbox mode isolates execution to prevent filesystem or system damage.

### Why Tool Blocking?

Dangerous tools like `exec` and `write` could be exploited through prompt injection. Blocking them by default prevents the most severe attack vectors.

## Requirements

| Component | Version | Purpose |
|-----------|---------|---------|
| Node.js | 22+ | OpenClaw runtime |
| OpenSSL | Any | Token generation |
| Claude Code | 2.0.0+ | Plugin system |

## Links

- [OpenClaw Documentation](https://docs.openclaw.ai)
- [Security Guide](https://docs.openclaw.ai/security)
- [Plugin Repository](https://github.com/cathy-kim/openclaw-plugin)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-02-01 | Initial release |

---

**Version**: 1.0.0
**Author**: cathy-kim
**License**: MIT
