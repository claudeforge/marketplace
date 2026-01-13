# Changelog

All notable changes to the ClaudeForge Marketplace will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2026-01-13

### 🔧 Fixed - Plugin Compliance

- **CRITICAL**: Removed invalid `commands` array field from all 65 command plugin.json files
- Command plugins now follow Claude Code auto-discovery pattern (commands/ folder)
- All 161 plugins validated for Claude Code CLI compatibility
- Super plugins retain proper multi-component structure (commands, agents, hooks, mcpServers)

### ✅ Validated

- All plugin.json files validated for proper JSON syntax
- All referenced files (agents/*.md, commands/*.md) verified to exist
- Consistent plugin metadata structure across all categories
- Updated marketplace version from 1.1.0 to 1.2.0

### 📝 Documentation

- Updated CLAUDE.md with v1.2.0 information
- Updated README.md version badges and "What's New" section
- Roadmap updated with completed v1.2.0 features
- Added v1.3.0 roadmap items

### 📊 Plugin Validation Summary

| Category | Count | Status |
|----------|-------|--------|
| Agent Plugins | 93 | ✅ Valid |
| Command Plugins | 65 | ✅ Fixed & Valid |
| Super Plugins | 3 | ✅ Valid |
| **Total** | **161** | **✅ All Compliant** |

---

## [1.1.0] - 2025-10-12

### 🚀 Added - 49 New Practical Plugins

**24 New Agent Plugins:**
- authentication-specialist - JWT, OAuth2, security patterns
- cache-strategist - Redis and caching strategies
- cors-security-expert - CORS configuration
- cost-optimizer - Cloud cost optimization (FinOps)
- database-expert - SQL optimization and database tuning
- docker-specialist - Container optimization
- error-handler - Error handling patterns
- file-upload-specialist - S3 integration
- form-validation-expert - Input validation
- git-workflow-expert - Git strategies
- graphql-specialist - GraphQL schema design
- iot-solutions-architect - IoT architecture
- localization-specialist - i18n and l10n
- microservices-architect - Microservices patterns
- pagination-expert - Pagination strategies
- quantum-computing-researcher - Quantum algorithms
- rate-limiter - Rate limiting and DDoS protection
- regex-master - Regular expression patterns
- rest-api-designer - REST API design
- serverless-engineer - Serverless architecture
- sql-query-optimizer - Advanced SQL optimization
- sre-reliability-engineer - SRE practices
- technical-writer-pro - Technical documentation
- webhook-integrator - Webhook patterns

**25 New Command Plugins:**
- api-contract-tester - API contract testing
- bundle-analyzer - JavaScript bundle analysis
- changelog-generator - Automated changelog generation
- console-cleaner - Remove console statements
- docker-compose-generator - Generate docker-compose files
- env-config-manager - Environment configuration
- env-validator - Validate .env files
- feature-flag-manager - Feature flag implementation
- git-commit-helper - Smart commit messages
- hotfix-deployer - Hotfix deployment workflows
- htaccess-generator - Apache .htaccess configuration
- import-organizer - Organize and sort imports
- incident-reporter - Incident reporting
- json-validator - JSON validation
- license-compliance - License compliance checking
- migration-helper - Database migration assistance
- mock-data-generator - Generate test data
- nginx-config-generator - Nginx configuration
- package-updater - Dependency update automation
- regex-tester - Regular expression testing
- robots-txt-generator - Generate robots.txt
- schema-generator - Schema generation utilities
- sql-formatter - SQL query formatting
- type-generator - TypeScript type generation
- unused-code-finder - Dead code detection

### 📊 Updated

- Total plugins: 112 → 161 (+49)
- Agent plugins: 69 → 93 (+24)
- Command plugins: 40 → 65 (+25)
- Super plugins: 3 (unchanged)

### 🔧 Configuration Changes

- Plugin Root Path: Changed from "." to ".." for proper plugin resolution
- Added comprehensive PLUGIN_CATALOG.md

---

## [1.0.0] - 2025-10-11

### 🚀 Added - Super Plugins
- **NEW**: Super Plugin category with advanced multi-component plugins
- **enterprise-workspace**: Complete workspace management platform with hooks and MCP server
- **ai-studio-orchestrator**: Multi-agent coordination platform with task orchestration
- **devops-platform**: Complete DevOps automation with CI/CD and infrastructure management
- Advanced plugin.json configuration with hooks, MCP servers, and environment variables
- ${CLAUDE_PLUGIN_ROOT} environment variable support across all super plugins
- PostToolUse and PreToolUse hook implementations
- Model Context Protocol (MCP) server integrations for state management

### ✨ Enhanced - Plugin Quality
- Expanded 10 short plugins to enterprise-grade quality (200-700+ lines)
  - update-branch-name: 15 → 360 lines (+2,300%)
  - data-analyst: 18 → 449 lines (+2,394%)
  - mobile-optimization-expert: 18 → 592 lines (+3,189%)
  - quality-validator: 18 → 392 lines (+2,078%)
  - fix-github-issue: 19 → 480 lines (+2,426%)
  - pr-creator: 26 → 434 lines (+1,569%)
  - code-quality-expert: 27 → 521 lines (+1,830%)
  - intelligent-commit: 27 → 614 lines (+2,174%)
  - debugger: 28 → 676 lines (+2,314%)
  - issue-analyzer: 28 → 719 lines (+2,468%)
- Added 5,000+ lines of comprehensive enterprise-grade documentation
- Enhanced all plugins with phase-based methodologies
- Added real-world code examples and templates
- Included business impact analysis and ROI metrics
- Added troubleshooting guides and best practices sections

### 📊 Improved
- Updated marketplace.json with 112 total plugins (69 agents + 40 commands + 3 super)
- Enhanced README.md with super plugin documentation
- Added comprehensive plugin structure visualization
- Improved categorization with 11 enterprise categories
- Enhanced installation and usage examples
- Added quality standards documentation
- Version bumped to 2.0 to reflect major improvements

### 📝 Documentation
- Added CHANGELOG.md for version tracking
- Enhanced README.md with super plugin deep dive
- Updated plugin quality standards
- Added super plugin configuration examples
- Documented hooks and MCP server usage
- Added component breakdowns for each super plugin

### 🔧 Technical
- Implemented hooks system for automated validation
- Integrated MCP servers for stateful operations
- Added automation scripts for workspace, tasks, and DevOps
- Enhanced plugin.json schema with advanced features
- Standardized frontmatter across all agents and commands

---

## Release Summary

### v1.0.0 - Initial Release (2025-10-11)

**Complete enterprise-grade plugin ecosystem with advanced features:**

- 112 Total Plugins (69 Agents + 40 Commands + 3 Super Plugins)
- 15,000+ lines of professional documentation
- Advanced features: Hooks, MCP Servers, Multi-component architecture
- Enterprise-grade quality across all plugins
- 100% original ClaudeForge content
- Full Claude Code marketplace compliance

**What's Included:**
- Comprehensive plugin catalog covering all development needs
- Super plugins with automation and state management
- Professional documentation and examples
- Security-first design
- Community-driven development

---

[1.2.0]: https://github.com/claudeforge/marketplace/releases/tag/v1.2.0
[1.1.0]: https://github.com/claudeforge/marketplace/releases/tag/v1.1.0
[1.0.0]: https://github.com/claudeforge/marketplace/releases/tag/v1.0.0
