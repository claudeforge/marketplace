# ClaudeForge Marketplace v1.1

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg) ![Plugins](https://img.shields.io/badge/plugins-161-success.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Claude Code](https://img.shields.io/badge/Claude%20Code-compatible-purple.svg)

ClaudeForge Plugin Marketplace - Community-driven plugin ecosystem for Claude Code with 161 unique plugins including advanced super plugins with hooks and MCP servers.

**New in v1.1:** 49 practical development plugins for real-world coding including database optimization, Docker, Git workflows, REST APIs, caching, authentication, error handling, validation, file uploads, webhooks, GraphQL, microservices, serverless, CORS, SRE, regex, pagination, and more!

**⚠️ Important**: This is an **independent, community-maintained** project. **NOT** officially affiliated with Anthropic or Claude.

## Quick Start

### Installation
```bash
# Add ClaudeForge Marketplace to Claude Code
/plugin marketplace add https://github.com/claudeforge/marketplace.git

# Verify marketplace installation
/plugin marketplace list

# Expected output: claudeforge-marketplace (1.1.0) - 161 plugins available
```

**Installation Success Indicators:**
- ✅ Marketplace appears in `/plugin marketplace list` output
- ✅ All 161 plugins become accessible via `/plugin` command
- ✅ No error messages during marketplace addition
- ✅ Super plugins with hooks and MCP servers load correctly

### Using Plugins
```bash
# Browse available plugins
/plugin

# Install specific plugin
/plugin install [plugin-name]@claudeforge

# Install with specific version
/plugin install [plugin-name]@claudeforge@1.0.0

# Verify plugin installation
/plugin list | grep [plugin-name]
```

### Claude Code Integration
ClaudeForge Marketplace follows Claude Code's official marketplace standards.

**Recommended Installation Method:**
- **Git Repository** (Tested & Verified): `/plugin marketplace add https://github.com/claudeforge/marketplace.git`

**Alternative Installation Methods:**
- **GitHub Short URL**: `/plugin marketplace add claudeforge/marketplace`
- **Local Path**: `/plugin marketplace add ./claudeforge-marketplace`

**System Requirements:**
- Claude Code CLI (latest version recommended)
- Git installed and accessible in PATH
- Internet connection for GitHub-based installation
- Minimum 50MB disk space for all plugins

**Marketplace Management:**
```bash
# List installed marketplaces
/plugin marketplace list

# Update marketplace
/plugin marketplace update claudeforge

# Remove marketplace
/plugin marketplace remove claudeforge
```

## Marketplace Statistics

- **Total Plugins**: 161 (93 Agents + 65 Commands + 3 Super Plugins)
- **Categories**: 11 Enterprise Categories (including Super Plugins)
- **Quality**: 100% Original ClaudeForge Content
- **Structure**: Organized by type (agents/, commands/, super/)
- **Advanced Features**: Hooks, MCP Servers, Multi-component Plugins
- **Version**: 1.1.0 Stable Release
- **New in v1.1**: 49 Practical Development Plugins for Real-World Coding

## Featured Categories

### Security & Compliance
- Advanced security scanning and vulnerability assessment
- Compliance automation and governance
- Privacy protection and data security

### Development & Code Quality
- Code review and optimization
- Refactoring and best practices
- Architecture design and patterns

### DevOps & Infrastructure
- CI/CD pipeline automation
- Infrastructure as Code
- Monitoring and observability

### AI & Machine Learning
- ML model optimization
- AI ethics and governance
- Prompt engineering

### Testing & Quality Assurance
- Automated testing strategies
- Performance benchmarking
- Quality gates and validation

### Documentation & Knowledge
- Auto-documentation generation
- Knowledge base management
- Technical writing assistance

### Productivity & Automation
- Workflow automation
- Task management
- Efficiency optimization

### Design & UX
- Accessibility optimization
- UI/UX best practices
- Design system management

### Data & Analytics
- Data analysis and visualization
- Business intelligence
- Analytics reporting

### Enterprise & Business
- Enterprise architecture
- Business process automation
- Strategic planning

### 🚀 Super Plugins (Advanced)
- **Multi-component platforms** with commands, agents, hooks, and MCP servers
- **Automated validation** through hook systems
- **State management** via Model Context Protocol servers
- **Enterprise workspace management**
- **AI agent orchestration**
- **Complete DevOps automation**

## Plugin Structure

ClaudeForge Marketplace uses an organized structure by plugin type:

```
plugins/
├── agents/           # 93 AI Agent Plugins
│   ├── ai-architect/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   └── agents/
│   │       └── ai-engineer.md
│   ├── code-migrator/
│   ├── debugger/
│   ├── database-expert/        # NEW in v1.1
│   ├── docker-specialist/      # NEW in v1.1
│   ├── git-workflow-expert/    # NEW in v1.1
│   └── ... (83 more agents)
│
├── commands/         # 65 Command Plugins
│   ├── api-designer/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   └── commands/
│   │       └── api-designer.md
│   ├── code-review/
│   ├── env-validator/          # NEW in v1.1
│   ├── import-organizer/       # NEW in v1.1
│   ├── console-cleaner/        # NEW in v1.1
│   └── ... (51 more commands)
│
└── super/           # 3 Super Plugins (Advanced)
    ├── enterprise-workspace/
    │   ├── .claude-plugin/
    │   │   └── plugin.json      # With hooks & MCP config
    │   ├── commands/             # Multiple commands
    │   │   ├── workspace-init.md
    │   │   ├── workspace-sync.md
    │   │   └── workspace-audit.md
    │   ├── agents/               # Multiple agents
    │   │   ├── workspace-architect.md
    │   │   └── compliance-auditor.md
    │   ├── hooks/
    │   │   └── post-tool-use.md
    │   ├── scripts/
    │   │   └── validate-workspace.sh
    │   └── servers/
    │       └── workspace-server.js
    │
    ├── ai-studio-orchestrator/   # Task orchestration platform
    └── devops-platform/          # Complete DevOps automation
```

**Plugin Configuration Structure:**
- **Type-based organization**: Clear separation between agents, commands, and super plugins
- **Plugin.json**: Standard Claude Code plugin configuration with advanced features
- **Implementation files**: .md files for commands and agents
- **Hooks integration**: PostToolUse and PreToolUse event handlers
- **MCP Servers**: Model Context Protocol for state management
- **Scripts**: Automation and validation scripts
- **Consistent metadata**: Enterprise-grade descriptions and categorization

## Premium Features

### Standard Features
- **Curated Quality**: All plugins manually reviewed and enterprise-tested
- **Regular Updates**: Continuous maintenance and improvements
- **Enterprise Ready**: Production-grade reliability and scalability
- **Community Driven**: Open source contributions welcome
- **Security First**: Built-in security best practices and auditing
- **Performance Optimized**: Efficient and scalable architecture
- **100% Original Content**: Zero external dependencies or copycat plugins

### 🚀 Advanced Features (Super Plugins)
- **Hooks System**: Automated validation on Write/Edit operations
- **MCP Servers**: Model Context Protocol for state management
- **Multi-Component**: Commands, agents, hooks, and scripts in one package
- **Environment Variables**: Dynamic configuration with ${CLAUDE_PLUGIN_ROOT}
- **Automation Scripts**: Shell scripts for validation and workflows
- **Event-Driven**: Pre and post tool use event handling
- **Stateful Operations**: Track workspace, tasks, and deployments

## Security & Trust

**Important Disclaimer:**
- ⚠️ **Independent Project**: ClaudeForge Marketplace is an independent, community-driven project
- ⚠️ **Not Official**: This marketplace is NOT affiliated with, endorsed by, or officially connected to Anthropic or Claude
- ⚠️ **Community Maintained**: All plugins are created and maintained by the open-source community
- ⚠️ **Use at Your Own Risk**: Please review plugin code before use in production environments

**Security Measures:**
- All plugins scanned for security vulnerabilities
- Community-driven security standards
- Transparency reports available on GitHub
- No malicious code allowed (community moderation)
- **100% Original Content**: No external dependencies or copycat plugins
- **Static Analysis**: All plugins undergo security scanning before inclusion
- **Dependency Audit**: Zero third-party dependencies verified
- **Open Source**: All code publicly available for inspection on GitHub

**Best Practices for Users:**
- Review plugin source code before installation
- Test plugins in development environments first
- Report security issues via GitHub Issues
- Keep plugins updated to latest versions
- Follow principle of least privilege when using automation plugins

## Plugin Discovery & Usage

### Browse Plugins
```bash
# List all available plugins
/plugin

# Filter by category
/plugin --category agents
/plugin --category commands

# Search for specific functionality
/plugin search "security"
/plugin search "api design"
```

### Installation Examples
```bash
# Install agent plugins
/plugin install ai-architect@claudeforge
/plugin install code-migrator@claudeforge
/plugin install debugger@claudeforge

# Install command plugins
/plugin install api-designer@claudeforge
/plugin install code-review@claudeforge
/plugin install fix-github-issue@claudeforge

# Install super plugins (with hooks and MCP servers)
/plugin install enterprise-workspace@claudeforge
/plugin install ai-studio-orchestrator@claudeforge
/plugin install devops-platform@claudeforge
```

### Plugin Management
```bash
# List installed plugins
/plugin list

# Update specific plugin
/plugin update [plugin-name]@claudeforge

# Remove plugin
/plugin remove [plugin-name]@claudeforge

# Show plugin details
/plugin info [plugin-name]@claudeforge
```

## Validation & Troubleshooting

### Validate Marketplace
```bash
# Validate JSON syntax
claude plugin validate .

# Test marketplace installation
/plugin marketplace add ./test-marketplace

# Test plugin installation
/plugin install test-plugin@test-marketplace
```

### Common Issues & Solutions

**Marketplace Not Loading:**
- **Symptom**: Marketplace doesn't appear in `/plugin marketplace list`
- **Solution 1**: Verify `.claude-plugin/marketplace.json` exists in repository root
- **Solution 2**: Check JSON syntax with `claude plugin validate .`
- **Solution 3**: Ensure Git repository is accessible and cloned correctly
- **Solution 4**: Restart Claude Code CLI after adding marketplace

**Plugin Installation Failures:**
- **Symptom**: Error message "Plugin not found" or installation timeout
- **Solution 1**: Verify plugin source paths in marketplace.json are correct (./plugins/[type]/[name])
- **Solution 2**: Ensure all required plugin files exist (.claude-plugin/plugin.json, commands/*.md or agents/*.md)
- **Solution 3**: Check network connectivity for Git-based plugin sources
- **Solution 4**: Try installing with explicit version: `/plugin install [name]@claudeforge@1.0.0`

**Super Plugin Issues (Hooks & MCP Servers):**
- **Symptom**: Hooks not triggering or MCP server connection errors
- **Solution 1**: Verify ${CLAUDE_PLUGIN_ROOT} environment variable resolves correctly
- **Solution 2**: Check script permissions for validate-*.sh files (chmod +x on Linux/Mac)
- **Solution 3**: Ensure Node.js is installed for MCP server JavaScript files
- **Solution 4**: Review Claude Code logs for hook execution errors

**Performance Issues:**
- **Symptom**: Slow marketplace loading or plugin installation
- **Solution 1**: Check internet connection speed (GitHub clone performance)
- **Solution 2**: Verify available disk space (minimum 50MB required)
- **Solution 3**: Close unnecessary applications to free system resources
- **Solution 4**: Use local path installation for faster access after initial clone


## Community & Support

### Getting Help
- [Issue Tracker](https://github.com/claudeforge/marketplace/issues) - Report bugs and technical issues
- [Feature Requests](https://github.com/claudeforge/marketplace/discussions) - Propose new plugins or enhancements
- [Documentation](https://github.com/claudeforge/marketplace/wiki) - Comprehensive guides and tutorials

### Contributing
We welcome contributions from the community! Here's how you can help:

**Contributing New Plugins:**
1. Fork the repository
2. Create plugin structure in appropriate directory (agents/, commands/, or super/)
3. Follow plugin.json schema requirements
4. Add comprehensive documentation (200-700+ lines recommended)
5. Test thoroughly with Claude Code CLI
6. Submit pull request with detailed description

**Plugin Quality Standards:**
- Minimum 200 lines of documentation
- Real-world code examples and templates
- Phase-based methodologies
- Best practices and anti-patterns
- Quality metrics and KPIs
- Business impact analysis

**Contributing Plugin Ideas:**
- Open a GitHub Discussion with plugin proposal
- Describe use case and business value
- Provide examples of desired functionality
- Community votes on most valuable additions

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Maintain enterprise-grade quality standards

## License

MIT License - See [LICENSE](LICENSE) for details

Copyright (c) 2025 ClaudeForge Community

## Acknowledgments

Built with passion by the ClaudeForge community

**Special Thanks:**
- Anthropic for Claude Code CLI platform
- All plugin contributors and testers
- Enterprise users providing valuable feedback
- Open source community for inspiration

## Super Plugins Deep Dive

### 🏢 enterprise-workspace
**Complete workspace management platform**
- Initialize, synchronize, and audit enterprise workspaces
- Architecture governance and compliance tracking
- Automated validation through hooks
- State tracking via MCP server

**Components:**
- 3 Commands: init, sync, audit
- 2 Agents: workspace-architect, compliance-auditor
- 1 Hook: PostToolUse validation
- 1 MCP Server: workspace-state
- 1 Script: validate-workspace.sh

### 🤖 ai-studio-orchestrator
**Advanced multi-agent coordination platform**
- Orchestrate complex tasks across multiple agents
- Monitor performance and optimize workflows
- Task distribution and load balancing
- Real-time performance analytics

**Components:**
- 3 Commands: orchestrate-task, monitor-performance, optimize-workflow
- 2 Agents: task-coordinator, performance-analyzer
- 1 Hook: PreToolUse logging
- 1 MCP Server: orchestrator
- 1 Script: task-logger.sh

### 🔧 devops-platform
**Complete DevOps automation platform**
- Setup CI/CD pipelines (GitHub Actions, Jenkins, GitLab CI)
- Deploy applications with zero-downtime strategies
- Manage infrastructure as code (Terraform, CloudFormation)
- Security scanning and compliance checks

**Components:**
- 3 Commands: setup-pipeline, deploy-application, manage-infrastructure
- 2 Agents: cicd-architect, infrastructure-engineer
- 1 Hook: PostToolUse config validation
- 1 MCP Server: devops-state
- 1 Script: validate-devops-config.sh

---

## Plugin Quality Standards

All plugins meet these criteria:
- ✅ 200-700+ lines of comprehensive documentation
- ✅ Real-world code examples and templates
- ✅ Phase-based methodologies
- ✅ Integration capabilities
- ✅ Best practices and anti-patterns
- ✅ Quality metrics and KPIs
- ✅ Business impact analysis
- ✅ Troubleshooting guides

**Average Content Quality:**
- Agents: 250+ lines
- Commands: 280+ lines
- Super Plugins: 300+ lines per component

---

---

## What's New in v1.1

### 🎯 Practical Development Tools (37 New Plugins)

**Essential Daily Development Agents:**
- database-expert - SQL optimization and query tuning
- docker-specialist - Container optimization
- git-workflow-expert - Advanced Git strategies
- rest-api-designer - REST API best practices
- cache-strategist - Redis and caching patterns
- authentication-specialist - JWT, OAuth2, security
- error-handler - Error handling patterns
- form-validation-expert - Input validation
- file-upload-specialist - File handling and S3
- rate-limiter - Rate limiting and DDoS protection
- webhook-integrator - Webhook patterns
- graphql-specialist - GraphQL optimization
- microservices-architect - Microservices patterns
- serverless-engineer - Lambda and serverless

**Productivity Commands:**
- env-validator - Validate .env files
- import-organizer - Sort imports
- unused-code-finder - Find dead code
- console-cleaner - Remove console.log
- type-generator - JSON to TypeScript
- mock-data-generator - Generate test data
- sql-formatter - Beautify SQL
- json-validator - Validate JSON
- docker-compose-generator - Generate docker-compose.yml
- nginx-config-generator - Generate nginx configs

---

---

**ClaudeForge Marketplace v1.1** - *Practical Development Tools for Real-World Coding*

## Complete Success ✓
- 161 total plugins (93 agents + 65 commands + 3 super)
- 49 new practical plugins added in v1.1
- All JSON files validated
- All .md files created
- Ready for production use!