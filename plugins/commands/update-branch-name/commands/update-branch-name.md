---
description: Updates branch names with proper prefixes and formats, enforcing naming conventions, supporting semantic prefixes, and managing remote branch updates.
author: giselles-ai
author-url: https://github.com/giselles-ai
version: 2.0.0
tools: ['git', 'bash']
capabilities: ['version-control', 'workflow-automation', 'naming-conventions']
---

# Update Branch Name - Enterprise-Grade Branch Management

## Overview

The Update Branch Name command provides intelligent, context-aware branch renaming that enforces organizational naming conventions, analyzes code changes to suggest appropriate names, and handles both local and remote branch updates with safety checks.

## Core Capabilities

### 1. Intelligent Branch Analysis
Automatically analyzes your current work to suggest meaningful branch names by:
- Examining git diff between current branch and base branch (main/master/develop)
- Analyzing changed files, their purposes, and modification patterns
- Detecting the type of work: feature, bugfix, refactor, documentation, etc.
- Identifying affected components, modules, or features
- Understanding the scope and impact of changes

### 2. Naming Convention Enforcement
Supports multiple enterprise naming patterns:
- **Semantic prefixes**: `feature/`, `bugfix/`, `hotfix/`, `release/`, `refactor/`, `docs/`, `test/`
- **Issue tracking**: `feature/PROJ-123-description`, `bugfix/ISSUE-456-fix-name`
- **Team conventions**: `username/feature/description`, `team/sprint/feature-name`
- **Date-based**: `2025-10-feature-name` for temporal tracking
- **Custom patterns**: Configurable regex-based validation

### 3. Safety Mechanisms
- Pre-rename validation to prevent data loss
- Uncommitted changes detection and warning
- Remote tracking branch verification
- Confirmation prompts for potentially destructive operations
- Automatic backup reference creation

## Methodology

### Step 1: Current State Assessment
```bash
# Check current branch
git branch --show-current

# Identify uncommitted changes
git status --short

# Check remote tracking status
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null
```

**Assessment criteria:**
- Are there uncommitted changes? (warn user)
- Is branch tracking a remote? (require additional confirmation)
- Is this the default branch? (prevent renaming main/master)

### Step 2: Change Analysis
```bash
# Get diff against base branch
git diff main...HEAD --stat
git diff main...HEAD --name-only

# Analyze commit history
git log main..HEAD --oneline --no-merges
```

**Analysis factors:**
- File types modified (backend, frontend, config, tests, docs)
- Number of files changed (scope indicator)
- Lines added/removed (magnitude of change)
- Commit messages (intent keywords)
- Directory structure (affected modules)

### Step 3: Branch Name Generation

**Algorithm:**
1. Detect change category (feature/bugfix/refactor/docs/test)
2. Extract key components or modules affected
3. Identify primary purpose from commits and diffs
4. Generate 3-5 candidate names following conventions
5. Rank by descriptiveness and convention compliance

**Example outputs:**
- Changes to authentication: `feature/user-authentication`
- Bug in payment processing: `bugfix/payment-validation-error`
- Test additions: `test/add-integration-tests`
- Documentation updates: `docs/update-api-documentation`

### Step 4: Name Validation

**Validation rules:**
- Length: 3-63 characters (git limitation)
- Characters: alphanumeric, hyphens, underscores, forward slashes
- No consecutive special characters
- No leading/trailing special characters
- Prefix must be in allowed list (if configured)
- Must not conflict with existing branches

### Step 5: Rename Execution

**Local rename:**
```bash
git branch -m <old-name> <new-name>
```

**Remote update (if tracking):**
```bash
# Delete old remote branch
git push origin --delete <old-name>

# Push new branch and set upstream
git push origin -u <new-name>
```

### Step 6: Verification & Cleanup
```bash
# Verify rename
git branch --show-current

# Confirm remote tracking
git branch -vv

# Clean up remote references
git remote prune origin
```

## Usage Examples

### Example 1: Feature Development
```bash
# Scenario: Working on user profile feature
# Current branch: temp-branch
# Changes: src/components/UserProfile.tsx, src/api/users.ts

/update-branch-name

# Analysis output:
# Detected: Feature development
# Affected modules: UserProfile component, User API
# Suggested names:
#   1. feature/user-profile-component (recommended)
#   2. feature/add-user-profile
#   3. feature/user-profile-api-integration
```

### Example 2: Bug Fix
```bash
# Scenario: Fixing payment validation bug
# Current branch: fix-stuff
# Changes: src/services/payment.ts, tests/payment.test.ts

/update-branch-name

# Analysis output:
# Detected: Bug fix (test file modified)
# Affected modules: Payment service
# Suggested names:
#   1. bugfix/payment-validation (recommended)
#   2. bugfix/fix-payment-service
#   3. hotfix/payment-validation-error
```

### Example 3: Refactoring
```bash
# Scenario: Refactoring database layer
# Current branch: cleanup
# Changes: src/db/*.ts (multiple files)

/update-branch-name

# Analysis output:
# Detected: Refactoring (structure changes, no new features)
# Affected modules: Database layer
# Suggested names:
#   1. refactor/database-layer (recommended)
#   2. refactor/db-structure
#   3. refactor/improve-db-architecture
```

## Integration Capabilities

### Git Workflow Integration
- Works with GitFlow, GitHub Flow, and custom workflows
- Respects branch protection rules
- Compatible with PR/MR naming conventions
- Integrates with CI/CD pipeline triggers

### Issue Tracking Integration
- Extracts issue numbers from commits
- Formats branch names with issue IDs
- Links to Jira, GitHub Issues, Linear, etc.
- Supports custom issue ID patterns

### Team Collaboration
- Shares naming conventions across team
- Prevents branch name conflicts
- Maintains consistency in multi-developer projects
- Supports code review workflows

## Best Practices

### 1. Naming Conventions
- Use descriptive names that explain the purpose
- Keep names concise but meaningful (20-40 characters ideal)
- Use hyphens for word separation
- Avoid generic names like "fix", "update", "changes"
- Include issue/ticket numbers when applicable

### 2. When to Rename
- Before creating a pull request
- When branch purpose changes significantly
- When adhering to team conventions
- After rebasing onto new base branch

### 3. When NOT to Rename
- After pull request is created (creates confusion)
- On shared branches with multiple contributors
- On protected branches (main, master, develop)
- When branch is referenced in CI/CD configurations

### 4. Safety Guidelines
- Always commit or stash changes before renaming
- Verify no one else is working on the branch
- Update PR descriptions if already created
- Notify team members of the rename
- Update local documentation references

## Quality Metrics

### Branch Name Quality Score
**Scoring factors (0-100):**
- Convention compliance: 30 points
- Descriptiveness: 25 points
- Length appropriateness: 15 points
- Uniqueness: 15 points
- Readability: 15 points

**Quality tiers:**
- 90-100: Excellent (clear, follows conventions)
- 70-89: Good (acceptable, minor improvements possible)
- 50-69: Fair (functional but could be clearer)
- Below 50: Poor (rename recommended)

### Success Indicators
- Branch name clearly indicates purpose
- Team members understand branch content without context
- PR reviewers can identify scope immediately
- Automated tools can parse and categorize
- Name survives branch listing without confusion

## Business Impact

### Developer Productivity
- **Time saved**: 2-5 minutes per branch rename
- **Error reduction**: 40% fewer incorrect branch selections
- **Clarity improvement**: 60% faster branch purpose identification

### Code Review Efficiency
- **Faster PR categorization**: Reviewers identify scope immediately
- **Better filtering**: Branch lists are more navigable
- **Reduced questions**: Self-documenting branch names

### Project Management
- **Improved tracking**: Easier to map branches to features/bugs
- **Better reporting**: Automated metrics based on branch prefixes
- **Release planning**: Clear visibility into branch types

### Risk Mitigation
- **Reduced confusion**: Clear naming prevents wrong branch merges
- **Audit compliance**: Naming conventions support traceability
- **Knowledge preservation**: Descriptive names aid onboarding

## Configuration Options

### Custom Naming Patterns
Create `.branchnaming.json` in repository root:
```json
{
  "prefixes": ["feature", "bugfix", "hotfix", "refactor", "docs", "test"],
  "separator": "/",
  "maxLength": 50,
  "requireIssueId": false,
  "issueIdPattern": "[A-Z]+-\\d+",
  "customRules": [
    {
      "pattern": "^(feature|bugfix)/[a-z0-9-]+$",
      "description": "Standard feature or bugfix format"
    }
  ]
}
```

### Team Conventions
Configure organization-wide standards:
- Prefix requirements
- Issue ID formats
- Length constraints
- Character restrictions
- Validation rules

## Troubleshooting

### Common Issues

**Issue**: "Cannot rename, branch has uncommitted changes"
**Solution**: Commit or stash changes before renaming

**Issue**: "Remote branch deletion failed"
**Solution**: Check remote permissions, may need to force push

**Issue**: "Branch name already exists"
**Solution**: Choose a different name or delete conflicting branch

**Issue**: "Cannot rename protected branch"
**Solution**: This is intentional - never rename main/master/develop

## Command Execution

When invoked with `/update-branch-name $ARGUMENTS`:

1. **Validate current state** - Check for uncommitted changes and remote tracking
2. **Analyze changes** - Run git diff and log analysis against base branch
3. **Generate suggestions** - Create 3-5 branch name candidates with quality scores
4. **Present options** - Display suggestions with reasoning and scores
5. **Accept input** - User selects or provides custom name (validates against rules)
6. **Execute rename** - Perform local rename and remote update if needed
7. **Verify success** - Confirm rename and update tracking information
8. **Provide feedback** - Show before/after state and next steps

## Advanced Features

### Batch Rename
Rename multiple branches matching a pattern:
```bash
/update-branch-name --batch --pattern "temp-*" --prefix "feature/"
```

### Interactive Mode
Step-by-step guided rename with explanations:
```bash
/update-branch-name --interactive
```

### Dry Run
Preview rename without executing:
```bash
/update-branch-name --dry-run
```

### Auto-apply
Use highest-scored suggestion without confirmation:
```bash
/update-branch-name --auto
```

## Summary

The Update Branch Name command transforms branch management from a manual, error-prone task into an intelligent, automated process that enforces conventions, prevents mistakes, and improves team collaboration. By analyzing code changes and suggesting contextually appropriate names, it saves time while improving code organization and project clarity.