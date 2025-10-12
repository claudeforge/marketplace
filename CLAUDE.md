# ClaudeForge Marketplace

## Overview

**ClaudeForge Marketplace** is the ultimate plugin ecosystem for Claude Code CLI, providing 161 enterprise-grade plugins including 93 AI agents, 65 commands, and 3 advanced super plugins. This community-driven marketplace transforms Claude Code from a powerful AI coding assistant into a comprehensive development platform with specialized capabilities across all aspects of software development, DevOps, security, and business operations.

**Version**: 1.1.0
**Repository**: https://github.com/claudeforge/marketplace
**License**: MIT
**Status**: Production Ready

### Key Features

- **161 Production-Ready Plugins**: Curated, tested, and enterprise-validated
- **Zero Dependencies**: Fully audited code with no external dependencies
- **Advanced Features**: Hooks, MCP servers, and event-driven automation
- **Comprehensive Documentation**: 250+ lines per plugin with real-world examples
- **Security First**: All plugins manually reviewed and security scanned
- **Community Driven**: Open source with active contributor community

## Architecture

### Repository Structure

```
claudeforge-marketplace/
├── .claude-plugin/
│   └── marketplace.json          # Central marketplace registry (v1.1.0)
│                                  # - 161 plugin definitions
│                                  # - Metadata and versioning
│                                  # - Plugin source paths
│
├── plugins/
│   ├── agents/                    # 93 AI Agent Plugins
│   │   ├── ai-architect/
│   │   │   ├── .claude-plugin/
│   │   │   │   └── plugin.json   # Agent metadata
│   │   │   └── agents/
│   │   │       └── ai-engineer.md # Agent prompt template
│   │   │
│   │   ├── authentication-specialist/  # v1.1 - JWT/OAuth2 expert
│   │   ├── cache-strategist/           # v1.1 - Redis/caching patterns
│   │   ├── cors-security-expert/       # v1.1 - CORS configuration
│   │   ├── cost-optimizer/             # v1.1 - Cloud cost optimization
│   │   ├── database-expert/            # v1.1 - SQL optimization
│   │   ├── docker-specialist/          # v1.1 - Container optimization
│   │   ├── error-handler/              # v1.1 - Error handling patterns
│   │   ├── file-upload-specialist/     # v1.1 - S3/file handling
│   │   ├── form-validation-expert/     # v1.1 - Input validation
│   │   ├── git-workflow-expert/        # v1.1 - Git strategies
│   │   ├── graphql-specialist/         # v1.1 - GraphQL design
│   │   ├── microservices-architect/    # v1.1 - Microservices patterns
│   │   ├── pagination-expert/          # v1.1 - Pagination strategies
│   │   ├── rate-limiter/               # v1.1 - Rate limiting
│   │   ├── regex-master/               # v1.1 - Regex patterns
│   │   ├── rest-api-designer/          # v1.1 - REST API design
│   │   ├── serverless-engineer/        # v1.1 - Serverless architecture
│   │   ├── sql-query-optimizer/        # v1.1 - SQL optimization
│   │   ├── sre-reliability-engineer/   # v1.1 - SRE practices
│   │   ├── technical-writer-pro/       # v1.1 - Documentation
│   │   └── webhook-integrator/         # v1.1 - Webhook patterns
│   │   └── ... (70 more agents)
│   │
│   ├── commands/                  # 65 Command Plugins
│   │   ├── api-contract-tester/        # v1.1 - API testing
│   │   ├── bundle-analyzer/            # v1.1 - Bundle analysis
│   │   ├── changelog-generator/        # v1.1 - Changelog automation
│   │   ├── console-cleaner/            # v1.1 - Remove console logs
│   │   ├── docker-compose-generator/   # v1.1 - Docker compose files
│   │   ├── env-config-manager/         # v1.1 - Environment config
│   │   ├── env-validator/              # v1.1 - .env validation
│   │   ├── feature-flag-manager/       # v1.1 - Feature flags
│   │   ├── git-commit-helper/          # v1.1 - Smart commits
│   │   ├── hotfix-deployer/            # v1.1 - Hotfix workflows
│   │   ├── htaccess-generator/         # v1.1 - Apache config
│   │   ├── import-organizer/           # v1.1 - Import sorting
│   │   ├── incident-reporter/          # v1.1 - Incident management
│   │   ├── json-validator/             # v1.1 - JSON validation
│   │   ├── license-compliance/         # v1.1 - License checking
│   │   ├── migration-helper/           # v1.1 - DB migrations
│   │   ├── mock-data-generator/        # v1.1 - Test data
│   │   ├── nginx-config-generator/     # v1.1 - Nginx config
│   │   ├── package-updater/            # v1.1 - Dependency updates
│   │   ├── regex-tester/               # v1.1 - Regex testing
│   │   ├── robots-txt-generator/       # v1.1 - Robots.txt
│   │   ├── schema-generator/           # v1.1 - Schema generation
│   │   ├── sql-formatter/              # v1.1 - SQL beautification
│   │   ├── type-generator/             # v1.1 - TypeScript types
│   │   └── unused-code-finder/         # v1.1 - Dead code detection
│   │   └── ... (40 more commands)
│   │
│   └── super/                     # 3 Super Plugins (Advanced)
│       ├── enterprise-workspace/
│       │   ├── .claude-plugin/
│       │   │   └── plugin.json    # With hooks & MCP server config
│       │   ├── commands/          # workspace-init, workspace-sync, workspace-audit
│       │   ├── agents/            # workspace-architect, compliance-auditor
│       │   ├── scripts/           # validate-workspace.sh
│       │   └── servers/           # workspace-state MCP server
│       │
│       ├── ai-studio-orchestrator/
│       │   ├── commands/          # orchestrate-task, monitor-performance, optimize-workflow
│       │   ├── agents/            # task-coordinator, performance-analyzer
│       │   ├── scripts/           # task-logger.sh
│       │   └── servers/           # orchestrator-state MCP server
│       │
│       └── devops-platform/
│           ├── commands/          # setup-pipeline, deploy-application, manage-infrastructure
│           ├── agents/            # cicd-architect, infrastructure-engineer
│           ├── scripts/           # validate-devops-config.sh
│           └── servers/           # devops-state MCP server
│
├── PLUGIN_CATALOG.md             # Complete plugin catalog with usage examples
├── README.md                     # User-facing documentation
├── CHANGELOG.md                  # Version history and changes
├── CONTRIBUTING.md               # Contribution guidelines
└── LICENSE                       # MIT License
```

### Plugin Types

#### 1. Agent Plugins (93 total)
AI-powered development assistants that provide specialized expertise and can be invoked using the Task tool in Claude Code.

**Structure:**
```
plugins/agents/{plugin-name}/
├── .claude-plugin/
│   └── plugin.json          # Metadata: name, version, category, keywords
└── agents/
    └── {agent-name}.md      # Agent prompt template with expertise and workflows
```

**Categories:**
- Development & Code Quality (25 plugins)
- Security & Authentication (15 plugins)
- Data & APIs (18 plugins)
- DevOps & Infrastructure (12 plugins)
- Testing & QA (10 plugins)
- UI/UX & Design (8 plugins)
- Documentation (5 plugins)

#### 2. Command Plugins (65 total)
Instant productivity tools that provide slash commands for common development tasks.

**Structure:**
```
plugins/commands/{plugin-name}/
├── .claude-plugin/
│   └── plugin.json          # Metadata
└── commands/
    └── {command-name}.md    # Command prompt and instructions
```

**Categories:**
- Git & Version Control (12 plugins)
- Code Quality & Analysis (10 plugins)
- Configuration & Setup (15 plugins)
- Testing & Validation (8 plugins)
- Documentation (6 plugins)
- DevOps & Deployment (14 plugins)

#### 3. Super Plugins (3 total)
Advanced multi-component platforms with hooks, MCP servers, and complex automation.

**Components:**
- Multiple commands (3+ per plugin)
- Multiple agents (2+ per plugin)
- Automation scripts (bash/shell)
- MCP servers (Node.js/TypeScript)
- Event hooks (PreToolUse/PostToolUse)

## Setup & Installation

### Prerequisites

- **Claude Code CLI** (latest version recommended)
- **Git** (for marketplace installation)
- **Node.js** (optional, required for super plugins with MCP servers)

### Installation Steps

1. **Add ClaudeForge Marketplace**
```bash
/plugin marketplace add https://github.com/claudeforge/marketplace.git
```

2. **Verify Installation**
```bash
/plugin marketplace list
# Expected output: claudeforge-marketplace (1.1.0) - 161 plugins available
```

3. **Install Plugins**
```bash
# Browse available plugins
/plugin

# Install specific plugin
/plugin install ai-architect@claudeforge

# Install super plugin (with hooks & MCP)
/plugin install enterprise-workspace@claudeforge
```

### Marketplace Configuration

The marketplace is configured via `.claude-plugin/marketplace.json`:

```json
{
  "name": "claudeforge-marketplace",
  "owner": {
    "name": "ClaudeForge Community",
    "email": "community@claudeforge.dev",
    "url": "https://github.com/claudeforge/marketplace"
  },
  "metadata": {
    "description": "ClaudeForge Plugin Marketplace - Premium enterprise-grade plugins for Claude Code",
    "version": "1.1.0",
    "homepage": "https://github.com/claudeforge/marketplace",
    "repository": "https://github.com/claudeforge/marketplace",
    "pluginRoot": ".."
  },
  "plugins": [
    // 161 plugin definitions...
  ]
}
```

**Key Configuration:**
- `pluginRoot: ".."` - Resolves plugin paths relative to parent directory
- Each plugin has `source` pointing to `./plugins/{category}/{plugin-name}`
- Plugin metadata includes name, description, version, author, category, keywords

## Development Workflow

### Plugin Management

```bash
# List installed plugins
/plugin list

# Update specific plugin
/plugin update ai-architect@claudeforge

# Update all plugins from marketplace
/plugin marketplace update claudeforge

# Remove plugin
/plugin remove debugger@claudeforge

# Search for plugins
/plugin search "security"
/plugin search "api design"

# Show plugin details
/plugin info ai-architect@claudeforge
```

### Using Agent Plugins

Agent plugins are invoked through Claude Code's Task tool:

```bash
# Example: Using the database-expert agent
User: "Optimize this SQL query for better performance"
Claude: [Uses Task tool with database-expert agent]

# Example: Using the git-workflow-expert agent
User: "Help me resolve this merge conflict"
Claude: [Uses Task tool with git-workflow-expert agent]
```

### Using Command Plugins

Command plugins provide slash commands:

```bash
# Environment validation
/env-validator

# Import organization
/import-organizer src/

# Code cleanup
/console-cleaner src/components/

# Type generation
/type-generator api-response.json

# Git operations
/git-commit-helper
/update-branch-name feature/new-design
```

### Creating New Plugins

#### Agent Plugin Template

1. Create directory structure:
```bash
mkdir -p plugins/agents/my-agent/.claude-plugin
mkdir -p plugins/agents/my-agent/agents
```

2. Create `plugin.json`:
```json
{
  "name": "my-agent",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  },
  "category": "agents",
  "homepage": "https://github.com/claudeforge/marketplace/tree/main/plugins/agents/my-agent",
  "keywords": ["claudeforge", "agent", "my", "agent"]
}
```

3. Create agent prompt in `agents/my-specialist.md` (200-700+ lines recommended)

4. Add to marketplace.json:
```json
{
  "name": "my-agent",
  "source": "./plugins/agents/my-agent",
  "description": "Clear, concise description of agent capabilities",
  "version": "1.0.0",
  "author": { "name": "Your Name" },
  "category": "agents",
  "homepage": "https://github.com/claudeforge/marketplace/tree/main/plugins/agents/my-agent",
  "keywords": ["claudeforge", "agent", "my", "agent"]
}
```

#### Command Plugin Template

1. Create directory structure:
```bash
mkdir -p plugins/commands/my-command/.claude-plugin
mkdir -p plugins/commands/my-command/commands
```

2. Create `plugin.json` (same format as agents)

3. Create command prompt in `commands/my-command.md`

4. Add to marketplace.json

### Quality Standards

All plugins must meet these standards:

- ✅ **Documentation**: Minimum 200 lines with real-world examples
- ✅ **Code Examples**: Practical templates and patterns
- ✅ **Methodology**: Phase-based workflows
- ✅ **Best Practices**: Industry standards and anti-patterns
- ✅ **Testing**: Validated with Claude Code CLI
- ✅ **Security**: No external dependencies, audited code

## Plugin Categories & Use Cases

### 🔧 Development Tools

**Key Plugins:**
- `database-expert` - SQL optimization, indexing, query tuning
- `docker-specialist` - Container optimization, multi-stage builds
- `git-workflow-expert` - Gitflow, merge conflicts, rebasing
- `rest-api-designer` - RESTful design, versioning, pagination
- `graphql-specialist` - Schema design, DataLoader, subscriptions

**Use Cases:**
- Optimize database queries and indexes
- Debug Docker container issues
- Resolve complex merge conflicts
- Design scalable REST APIs
- Implement GraphQL schemas with type safety

### 🔐 Security & Authentication

**Key Plugins:**
- `authentication-specialist` - JWT, OAuth2, 2FA, session management
- `cors-security-expert` - CORS configuration and security
- `rate-limiter` - DDoS protection, token bucket algorithms
- `form-validation-expert` - XSS prevention, input sanitization
- `security-scanner` - Vulnerability detection and remediation

**Use Cases:**
- Implement secure authentication flows
- Configure CORS policies
- Prevent SQL injection and XSS attacks
- Set up rate limiting for APIs
- Audit code for security vulnerabilities

### 🗄️ Data & APIs

**Key Plugins:**
- `cache-strategist` - Redis patterns, cache invalidation
- `webhook-integrator` - HMAC verification, retry logic
- `microservices-architect` - Service decomposition, API gateway
- `serverless-engineer` - Lambda optimization, event-driven architecture
- `pagination-expert` - Cursor-based, offset pagination

**Use Cases:**
- Implement efficient caching strategies
- Integrate third-party webhooks securely
- Design microservices architecture
- Optimize serverless functions
- Add pagination to large datasets

### 🧪 Testing & Quality

**Key Plugins:**
- `error-handler` - Custom errors, Sentry integration, logging
- `api-contract-tester` - Contract testing, API validation
- `bundle-analyzer` - Bundle size optimization
- `unused-code-finder` - Dead code detection
- `type-generator` - Generate TypeScript types from JSON

**Use Cases:**
- Implement comprehensive error handling
- Test API contracts and schemas
- Reduce JavaScript bundle sizes
- Clean up unused code and imports
- Generate type-safe interfaces

### ⚡ Productivity Commands

**Key Plugins:**
- `env-validator` - Validate environment variables
- `import-organizer` - Sort and group imports
- `console-cleaner` - Remove debug statements
- `git-commit-helper` - Smart commit messages
- `changelog-generator` - Automated changelogs

**Use Cases:**
- Validate .env files before deployment
- Organize imports automatically
- Clean production code
- Generate conventional commits
- Maintain changelog documentation

## Recent Updates (Updated: 2025-10-12)

### Version 1.1.0 - Major Feature Release

#### New Plugins Added (49 total)

**Practical Development Agents (24 new):**
1. `authentication-specialist` - JWT, OAuth2, and security patterns
2. `cache-strategist` - Redis and caching strategies
3. `cors-security-expert` - CORS configuration and best practices
4. `cost-optimizer` - Cloud cost optimization (FinOps)
5. `database-expert` - SQL optimization and database tuning
6. `docker-specialist` - Container optimization and debugging
7. `error-handler` - Error handling patterns and logging
8. `file-upload-specialist` - S3 integration and file handling
9. `form-validation-expert` - Input validation and sanitization
10. `git-workflow-expert` - Git strategies and workflows
11. `graphql-specialist` - GraphQL schema design
12. `iot-solutions-architect` - IoT architecture patterns
13. `localization-expert` - i18n and l10n strategies
14. `microservices-architect` - Microservices patterns
15. `pagination-expert` - Pagination strategies
16. `quantum-computing-specialist` - Quantum algorithms
17. `rate-limiter` - Rate limiting and DDoS protection
18. `regex-master` - Regular expression patterns
19. `rest-api-designer` - REST API design and best practices
20. `serverless-engineer` - Serverless architecture
21. `sql-query-optimizer` - Advanced SQL optimization
22. `sre-reliability-engineer` - SRE practices and incident response
23. `technical-writer-pro` - Technical documentation
24. `webhook-integrator` - Webhook patterns and integration

**Practical Development Commands (25 new):**
1. `api-contract-tester` - API contract testing
2. `bundle-analyzer` - JavaScript bundle analysis
3. `changelog-generator` - Automated changelog generation
4. `console-cleaner` - Remove console statements
5. `docker-compose-generator` - Generate docker-compose files
6. `env-config-manager` - Environment configuration management
7. `env-validator` - Validate .env files
8. `feature-flag-manager` - Feature flag implementation
9. `git-commit-helper` - Smart commit message generation
10. `hotfix-deployer` - Hotfix deployment workflows
11. `htaccess-generator` - Apache .htaccess configuration
12. `import-organizer` - Organize and sort imports
13. `incident-reporter` - Incident reporting and tracking
14. `json-validator` - JSON validation and formatting
15. `license-compliance` - License compliance checking
16. `migration-helper` - Database migration assistance
17. `mock-data-generator` - Generate test data
18. `nginx-config-generator` - Nginx configuration
19. `package-updater` - Dependency update automation
20. `regex-tester` - Regular expression testing
21. `robots-txt-generator` - Generate robots.txt
22. `schema-generator` - Schema generation utilities
23. `sql-formatter` - SQL query formatting
24. `type-generator` - TypeScript type generation
25. `unused-code-finder` - Dead code detection

#### Configuration Changes

- **Marketplace Version**: Updated from 1.0.0 to 1.1.0
- **Plugin Root Path**: Changed from "." to ".." for proper plugin resolution
- **Total Plugins**: Increased from 112 to 161 plugins
- **Documentation**: Added comprehensive PLUGIN_CATALOG.md

#### Architecture Improvements

- **Standardized Plugin Structure**: All plugin.json files now follow strict schema
- **Enhanced Documentation**: Each new plugin includes 200-700+ lines of documentation
- **Real-World Examples**: Added practical code examples and templates
- **Quality Metrics**: Implemented comprehensive validation and testing

#### Bug Fixes

- Fixed plugin source paths to reference parent directory correctly
- Removed invalid "commands" field from plugin.json files
- Fixed trailing commas in JSON configuration files
- Corrected repository URLs in marketplace metadata
- Standardized all agent and command plugins to Claude Code specifications

#### Documentation Updates

- Created comprehensive PLUGIN_CATALOG.md with all 161 plugins
- Enhanced README.md with better navigation and categorization
- Added troubleshooting section for common issues
- Expanded contributing guidelines with quality standards
- Added security measures and best practices documentation

### Breaking Changes

None. All v1.0.0 plugins remain fully compatible.

### Migration Notes

If you installed plugins before v1.1.0:
1. Update marketplace: `/plugin marketplace update claudeforge`
2. Reinstall affected plugins to get latest versions
3. Review new plugin categories and install relevant tools

## Important Notes

### ⚠️ Disclaimer

**ClaudeForge Marketplace is an independent, community-driven project:**
- ❌ **NOT** affiliated with Anthropic or Claude
- ❌ **NOT** officially endorsed by Anthropic
- ✅ **Community maintained** by open-source contributors
- ⚠️ **Use at your own risk** - always review plugin code before production use

### Security Considerations

**Our Security Practices:**
- ✅ All plugins manually reviewed before inclusion
- ✅ Zero external dependencies policy
- ✅ Static code analysis on all submissions
- ✅ Open source transparency - all code visible
- ✅ Regular security audits
- ✅ Community moderation and reporting

**Your Responsibilities:**
- 🔍 Always review plugin source code before installation
- 🧪 Test plugins in development environment first
- 🐛 Report security issues via GitHub
- 🔄 Keep plugins updated to latest versions
- 🔒 Follow least privilege principle
- 📖 Read plugin documentation carefully

### Plugin Development Guidelines

1. **Documentation First**: Write comprehensive docs (200+ lines minimum)
2. **Real-World Focus**: Include practical examples and use cases
3. **Security Minded**: No external dependencies, security-first design
4. **Quality Standards**: Follow enterprise-grade coding practices
5. **Testing**: Validate thoroughly with Claude Code CLI
6. **Community**: Engage with feedback and iterate

### Performance Tips

- **Selective Installation**: Only install plugins you actively use
- **Regular Updates**: Keep marketplace and plugins updated
- **Local Development**: Clone marketplace locally for faster access
- **Resource Management**: Monitor system resources with multiple plugins

### Support & Community

- **Issues**: Report bugs on [GitHub Issues](https://github.com/claudeforge/marketplace/issues)
- **Discussions**: Join conversations on [GitHub Discussions](https://github.com/claudeforge/marketplace/discussions)
- **Contributing**: See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines
- **Documentation**: Browse [PLUGIN_CATALOG.md](PLUGIN_CATALOG.md) for complete plugin list

## Roadmap

### Upcoming Features (v1.2.0)

- Plugin dependency management
- Plugin version pinning and rollback
- Automated plugin testing framework
- Plugin usage analytics
- Enhanced search and discovery
- Plugin collections/bundles

### Long-term Vision

- Plugin marketplace web interface
- Community ratings and reviews
- Verified publisher program
- Premium plugin support
- Integration with CI/CD pipelines
- Cross-marketplace plugin sharing

---

**ClaudeForge Marketplace** - Transforming Claude Code into the ultimate development platform.

*Last Updated: 2025-10-12*
