# Contributing to ClaudeForge Marketplace

Thank you for your interest in contributing to the ClaudeForge Marketplace! This document provides guidelines and information for contributors.

## 🎯 Our Mission

ClaudeForge Marketplace aims to be the premier destination for high-quality, enterprise-grade plugins that extend Claude Code's capabilities. We believe in:

- **Quality over Quantity**: Every plugin should be well-crafted and thoroughly tested
- **Security First**: All plugins must follow security best practices
- **User Experience**: Plugins should be intuitive and user-friendly
- **Community Driven**: We welcome contributions from the entire community
- **Continuous Improvement**: We're always working to make the marketplace better

## 🚀 Getting Started

### Prerequisites

- Basic understanding of Markdown
- Familiarity with Git and GitHub
- Knowledge of Claude Code and its capabilities
- Understanding of plugin structure (commands vs agents)

### Development Setup

1. **Fork the Repository**
   ```bash
   # Fork the repository on GitHub
   # Clone your fork locally
   git clone https://github.com/claudeforge/marketplace.git
   cd marketplace
   ```

2. **Set Up Development Environment**
   ```bash
   # Install development tools
   npm install -g markdownlint-cli
   npm install -g yaml-lint

   # Run validation to check setup
   npm run validate
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/my-new-plugin
   ```

## 📝 Plugin Development

### Plugin Types

#### Commands (Slash Commands)
Commands add custom slash commands to Claude Code. They're perfect for:

- Automation tasks
- Code analysis
- System operations
- Quick actions

**Example Structure:**
```markdown
---
allowed-tools: [Bash, Read, Grep]
description: Analyze code for security vulnerabilities
tags: [security, analysis, scanning]
---

# Security Scan

Perform comprehensive security vulnerability scanning...

## Usage
```bash
/security-scan [options]
```
```

#### Agents (AI Agents)
Agents add specialized AI assistants with specific expertise. They're ideal for:

- Specialized knowledge domains
- Complex problem solving
- Consultation and advice
- Creative assistance

**Example Structure:**
```markdown
---
description: Expert in code review and security analysis
capabilities: [code-review, security, expertise]
tools: [Read, Grep, Bash]
version: 1.0.0
---

# Code Reviewer

Expert code review specialist focused on security...

## Capabilities
- Security vulnerability identification
- Performance optimization
- Best practices enforcement
```

#### 🚀 Super Plugins (Advanced)
Super plugins are multi-component platforms combining commands, agents, hooks, and MCP servers. They're ideal for:

- Complete automation platforms
- Multi-agent coordination
- Stateful operations
- Enterprise workspace management
- Complex workflows with validation

**Example Structure:**
```
super-plugin/
├── .claude-plugin/
│   └── plugin.json       # With hooks & MCP config
├── commands/              # Multiple commands
│   ├── command1.md
│   ├── command2.md
│   └── command3.md
├── agents/                # Multiple agents
│   ├── agent1.md
│   └── agent2.md
├── hooks/
│   └── post-tool-use.md
├── scripts/
│   └── validate.sh
└── servers/
    └── mcp-server.js
```

**plugin.json Example:**
```json
{
  "name": "my-super-plugin",
  "version": "1.0.0",
  "category": "super",
  "commands": [
    "./commands/command1.md",
    "./commands/command2.md"
  ],
  "agents": [
    "./agents/agent1.md",
    "./agents/agent2.md"
  ],
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{"type": "command", "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"}]
    }]
  },
  "mcpServers": {
    "state-tracker": {
      "command": "node",
      "args": ["${CLAUDE_PLUGIN_ROOT}/servers/mcp-server.js"]
    }
  },
  "strict": false
}
```

### Development Guidelines

#### Quality Standards
- ✅ **Functionality**: Plugin must work as described
- ✅ **Documentation**: Complete, clear documentation
- ✅ **Security**: Follow security best practices
- ✅ **Performance**: Efficient resource usage
- ✅ **User Experience**: Intuitive and helpful

#### Content Requirements
- Clear, concise description
- Step-by-step usage instructions
- Examples with expected outputs
- Troubleshooting information
- Support contact information

#### Technical Standards
- Valid Markdown with proper formatting
- Complete YAML frontmatter
- Appropriate tool permissions
- Graceful error handling
- Resource efficiency

## 🧪 Testing Your Plugin

### Local Testing
1. **Create Test Files**: Set up test scenarios
2. **Manual Testing**: Test all functionality manually
3. **Edge Cases**: Test unusual inputs and conditions
4. **Error Handling**: Verify graceful error handling
5. **Performance**: Check resource usage and response times

### Validation
```bash
# Run comprehensive validation
npm run validate

# Check plugin structure
npm run check-structure

# Lint markdown files
npm run lint-md

# Validate YAML
npm run lint-yaml
```

## 📤 Submission Process

### Before Submitting
- [ ] Plugin thoroughly tested and working
- [ ] Documentation complete and accurate
- [ ] Security review completed
- [ ] Performance optimized
- [ ] All validation checks pass
- [ ] License information included
- [ ] Support information provided

### Submitting Your Plugin

1. **Create Pull Request**
   ```bash
   git add .
   git commit -m "Add new plugin: [plugin-name]"
   git push origin feature/my-new-plugin
   # Create PR on GitHub
   ```

2. **PR Description**
   - Clear description of plugin functionality
   - Usage examples
   - Testing procedures
   - Any special considerations

3. **Review Process**
   - Automated validation checks
   - Community review
   - Security review
   - Final approval

## 🔍 Review Process

### What We Look For
- **Quality**: High-quality, well-crafted plugins
- **Security**: Secure coding practices
- **Documentation**: Clear, comprehensive documentation
- **User Experience**: Intuitive, user-friendly design
- **Innovation**: Creative solutions to real problems
- **Performance**: Efficient resource usage

### Review Timeline
- **Initial Review**: 2-3 business days
- **Community Feedback**: 3-5 business days
- **Final Decision**: 1-2 business days after feedback

### Feedback Process
- Reviewers will provide constructive feedback
- Authors should address feedback promptly
- Multiple review cycles may be necessary
- We'll work with you to improve your plugin

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and improve
- Focus on what's best for the community
- Show empathy towards other community members

### Communication
- Use clear, professional language
- Provide specific, actionable feedback
- Ask questions when you need clarification
- Share knowledge and experience
- Celebrate contributions and successes

### Collaboration
- Work together to solve problems
- Share ideas and suggestions
- Mentor new contributors
- Build on each other's work
- Create a positive, supportive environment

## 📚 Resources

### Documentation
- [Plugin Development Guide](docs/plugin-development.md)
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs/claude-code)
- [Markdown Guide](https://www.markdownguide.org/)
- [YAML Frontmatter](https://jekyllrb.com/docs/front-matter/)

### Tools and Resources
- [Markdown Editors](https://www.markdownguide.org/tools/)
- [Code Editors](https://code.visualstudio.com/)
- [Git and GitHub](https://guides.github.com/)
- [Development Tools](https://github.com/features)

### Community
- [ClaudeForge Discord](https://discord.gg/claudeforge)
- [GitHub Discussions](https://github.com/claudeforge/marketplace/discussions)
- [Community Forums](https://community.claudeforge.dev)

## 🏆 Recognition

### Contributor Recognition
- Contributors listed in README
- Annual contributor awards
- Special badges for active contributors
- Opportunities for leadership roles

### Plugin Success
- Featured plugins in marketplace
- Success stories and case studies
- User testimonials and reviews
- Performance metrics and analytics

## 📞 Getting Help

### Support Channels
- **GitHub Issues**: [Create an issue](https://github.com/claudeforge/marketplace/issues)
- **Discord Community**: [Join our Discord](https://discord.gg/claudeforge)
- **Email**: support@claudeforge.dev
- **Documentation**: [Plugin Development Guide](docs/plugin-development.md)

### Common Questions
- **How do I test my plugin?** See testing section above
- **What tools can I use?** Check allowed-tools in documentation
- **How long does review take?** Usually 7-14 days
- **Can I submit multiple plugins?** Yes, absolutely!

## 📈 Roadmap

### Future Plans
- Plugin analytics and metrics
- Automated testing infrastructure
- Enhanced documentation tools
- Community rewards program
- Plugin marketplace improvements

### How to Contribute to Roadmap
- Share ideas and suggestions
- Vote on feature requests
- Participate in planning discussions
- Help implement roadmap items
- Provide feedback on new features

---

## 🎉 Thank You!

Thank you for considering contributing to the ClaudeForge Marketplace! Your contributions help make Claude Code more powerful and useful for everyone.

Whether you're submitting your first plugin or you're an experienced contributor, we appreciate your time and effort.

Together, we're building something amazing! 🚀

---

### Need Help?

If you have any questions or need assistance with your contribution, don't hesitate to reach out:

- **GitHub Issues**: [Create an issue](https://github.com/claudeforge/marketplace/issues)
- **Discord**: [Join our community](https://discord.gg/claudeforge)
- **Email**: support@claudeforge.dev

We're here to help you succeed! 🤝