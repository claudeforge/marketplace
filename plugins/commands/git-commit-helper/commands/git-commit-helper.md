---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: Generate conventional commit messages with templates, validation, and best practices for git workflows
---

# Git Commit Helper

A comprehensive guide to writing effective git commits using Conventional Commits format, with templates, automation tools, and best practices.

## Table of Contents

- [Introduction](#introduction)
- [Conventional Commits Format](#conventional-commits-format)
- [Commit Message Templates](#commit-message-templates)
- [Automated Commit Generation](#automated-commit-generation)
- [Git Hooks Integration](#git-hooks-integration)
- [Commit Message Linting](#commit-message-linting)
- [Interactive Commit Tools](#interactive-commit-tools)
- [Best Practices](#best-practices)

## Introduction

Well-crafted commit messages are essential for maintaining a clean, understandable git history. They help teams collaborate effectively, make code reviews easier, and simplify debugging and project maintenance.

### Why Good Commits Matter

```javascript
const commitBenefits = {
  collaboration: [
    'Clear communication of changes',
    'Easier code reviews',
    'Better understanding of project history'
  ],
  maintenance: [
    'Quick identification of breaking changes',
    'Easier to find when bugs were introduced',
    'Simplified changelog generation',
    'Better git bisect results'
  ],
  automation: [
    'Automatic semantic versioning',
    'Automated changelog generation',
    'Automated release notes',
    'CI/CD trigger rules'
  ]
};
```

## Conventional Commits Format

The Conventional Commits specification provides a structured format for commit messages.

### Format Structure

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Commit Types

```javascript
const commitTypes = {
  feat: {
    description: 'A new feature',
    example: 'feat(auth): add OAuth2 login support',
    semver: 'MINOR',
    emoji: '✨'
  },
  fix: {
    description: 'A bug fix',
    example: 'fix(api): resolve null pointer exception in user service',
    semver: 'PATCH',
    emoji: '🐛'
  },
  docs: {
    description: 'Documentation changes',
    example: 'docs(readme): update installation instructions',
    semver: 'PATCH',
    emoji: '📝'
  },
  style: {
    description: 'Code style changes (formatting, semicolons, etc.)',
    example: 'style(components): apply prettier formatting',
    semver: 'PATCH',
    emoji: '💄'
  },
  refactor: {
    description: 'Code refactoring without feature changes',
    example: 'refactor(auth): simplify token validation logic',
    semver: 'PATCH',
    emoji: '♻️'
  },
  perf: {
    description: 'Performance improvements',
    example: 'perf(database): add index on user email column',
    semver: 'PATCH',
    emoji: '⚡'
  },
  test: {
    description: 'Adding or updating tests',
    example: 'test(auth): add unit tests for login flow',
    semver: 'PATCH',
    emoji: '✅'
  },
  build: {
    description: 'Build system or dependency changes',
    example: 'build(deps): upgrade react to version 18',
    semver: 'PATCH',
    emoji: '📦'
  },
  ci: {
    description: 'CI/CD configuration changes',
    example: 'ci(github): add automated release workflow',
    semver: 'PATCH',
    emoji: '👷'
  },
  chore: {
    description: 'Other changes that dont modify src or test files',
    example: 'chore(gitignore): add .env to ignored files',
    semver: 'PATCH',
    emoji: '🔧'
  },
  revert: {
    description: 'Revert a previous commit',
    example: 'revert: revert "feat(auth): add OAuth2 login"',
    semver: 'PATCH',
    emoji: '⏪'
  }
};
```

### Breaking Changes

```javascript
// Breaking change examples
const breakingChangeExamples = [
  {
    format: 'feat!: remove deprecated API endpoints',
    description: 'Exclamation mark indicates breaking change',
    semver: 'MAJOR'
  },
  {
    format: `feat(api): redesign authentication flow

BREAKING CHANGE: The authentication endpoint has been moved from /auth to /v2/auth.
All clients must update their configuration to use the new endpoint.`,
    description: 'BREAKING CHANGE footer provides details',
    semver: 'MAJOR'
  },
  {
    format: `refactor(database)!: change primary key type to UUID

BREAKING CHANGE: Database migration required. All integer IDs converted to UUIDs.
See migration guide at docs/migrations/uuid-migration.md`,
    description: 'Breaking change with migration instructions',
    semver: 'MAJOR'
  }
];
```

### Complete Examples

```javascript
// Good commit examples
const goodCommits = [
  {
    message: `feat(auth): add two-factor authentication support

Implements TOTP-based 2FA using the speakeasy library.
Users can enable 2FA in their profile settings.

Closes #123`,
    explanation: 'Clear subject, detailed body, references issue'
  },
  {
    message: `fix(api): prevent race condition in order processing

Added mutex lock around order status updates to prevent
concurrent modifications that could result in invalid state.

The race condition occurred when multiple workers processed
the same order simultaneously, leading to duplicate charges.

Fixes #456`,
    explanation: 'Explains problem and solution'
  },
  {
    message: `perf(queries): optimize user search with database indexes

Added composite index on (email, created_at) columns.
Reduced average query time from 1.2s to 45ms.

Benchmarks:
- Before: 1200ms avg, 2500ms p95
- After: 45ms avg, 120ms p95`,
    explanation: 'Includes performance metrics'
  },
  {
    message: `docs(api): add OpenAPI specification

Generated OpenAPI 3.0 spec from route definitions.
Documentation now available at /api/docs.

The spec includes:
- All endpoints with request/response schemas
- Authentication requirements
- Rate limiting information
- Example requests and responses`,
    explanation: 'Lists what was added'
  }
];

// Bad commit examples (to avoid)
const badCommits = [
  {
    message: 'fix bug',
    problem: 'Too vague - which bug? What was fixed?'
  },
  {
    message: 'update stuff',
    problem: 'Not specific - what was updated and why?'
  },
  {
    message: 'WIP',
    problem: 'Work in progress - should not be in main history'
  },
  {
    message: 'Fixed issue with login and also updated the homepage design and refactored the database queries',
    problem: 'Too many unrelated changes in one commit'
  },
  {
    message: 'feat: Add new feature',
    problem: 'Subject is too generic - what feature?'
  }
];
```

## Commit Message Templates

### Basic Template

```bash
# .gitmessage template
# Place in ~/.gitmessage and configure with:
# git config --global commit.template ~/.gitmessage

# <type>(<scope>): <subject>
# |<---- Using a maximum of 50 characters ---->|

# Explain why this change is being made
# |<---- Try to limit each line to a maximum of 72 characters ---->|

# Provide links to any relevant tickets, articles or other resources
# Example: Fixes #23

# --- COMMIT END ---
# Type can be:
#   feat     (new feature)
#   fix      (bug fix)
#   docs     (documentation changes)
#   style    (formatting, missing semicolons, etc.)
#   refactor (code restructuring)
#   perf     (performance improvement)
#   test     (adding tests)
#   build    (build system changes)
#   ci       (CI/CD changes)
#   chore    (other changes)
# --------------------
# Remember to:
#   - Use the imperative mood in the subject line
#   - Do not end the subject line with a period
#   - Separate subject from body with a blank line
#   - Use the body to explain what and why vs. how
#   - Can use multiple lines with "-" or "*" for bullet points in body
```

### Interactive Template Generator

```javascript
#!/usr/bin/env node
// commit-helper.js

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const commitTypes = [
  { value: 'feat', name: 'feat:     A new feature' },
  { value: 'fix', name: 'fix:      A bug fix' },
  { value: 'docs', name: 'docs:     Documentation changes' },
  { value: 'style', name: 'style:    Code style changes' },
  { value: 'refactor', name: 'refactor: Code refactoring' },
  { value: 'perf', name: 'perf:     Performance improvement' },
  { value: 'test', name: 'test:     Adding or updating tests' },
  { value: 'build', name: 'build:    Build system changes' },
  { value: 'ci', name: 'ci:       CI/CD changes' },
  { value: 'chore', name: 'chore:    Other changes' }
];

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function showTypes() {
  console.log('\nAvailable commit types:\n');
  commitTypes.forEach((type, index) => {
    console.log(`${index + 1}. ${type.name}`);
  });
  console.log();
}

async function getGitDiff() {
  try {
    const diff = execSync('git diff --cached --stat', { encoding: 'utf8' });
    return diff;
  } catch (error) {
    return null;
  }
}

async function generateCommit() {
  console.log('=== Git Commit Helper ===\n');

  // Show staged changes
  const diff = await getGitDiff();
  if (diff) {
    console.log('Staged changes:');
    console.log(diff);
  }

  // Select type
  showTypes();
  const typeIndex = await question('Select commit type (1-10): ');
  const type = commitTypes[parseInt(typeIndex) - 1]?.value;

  if (!type) {
    console.log('Invalid type selection');
    rl.close();
    return;
  }

  // Get scope
  const scope = await question('Enter scope (optional, press enter to skip): ');

  // Get subject
  const subject = await question('Enter commit subject (required): ');

  if (!subject) {
    console.log('Subject is required');
    rl.close();
    return;
  }

  // Get body
  console.log('\nEnter commit body (optional, press enter twice to finish):');
  let body = '';
  let line = '';
  let emptyLineCount = 0;

  while (emptyLineCount < 2) {
    line = await question('');
    if (line === '') {
      emptyLineCount++;
    } else {
      emptyLineCount = 0;
      body += line + '\n';
    }
  }

  // Check for breaking change
  const isBreaking = await question('Is this a breaking change? (y/N): ');
  const breaking = isBreaking.toLowerCase() === 'y';

  // Get breaking change description if applicable
  let breakingDesc = '';
  if (breaking) {
    breakingDesc = await question('Describe the breaking change: ');
  }

  // Get issue reference
  const issueRef = await question('Enter issue reference (e.g., #123) or press enter to skip: ');

  // Build commit message
  let commitMessage = '';

  // Subject line
  const scopeStr = scope ? `(${scope})` : '';
  const breakingIndicator = breaking ? '!' : '';
  commitMessage += `${type}${scopeStr}${breakingIndicator}: ${subject}\n`;

  // Body
  if (body.trim()) {
    commitMessage += `\n${body.trim()}\n`;
  }

  // Footer
  let footer = '';
  if (breaking && breakingDesc) {
    footer += `BREAKING CHANGE: ${breakingDesc}\n`;
  }
  if (issueRef) {
    footer += `Closes ${issueRef}\n`;
  }

  if (footer) {
    commitMessage += `\n${footer}`;
  }

  // Preview
  console.log('\n=== Commit Message Preview ===\n');
  console.log(commitMessage);
  console.log('==============================\n');

  const confirm = await question('Create this commit? (Y/n): ');

  if (confirm.toLowerCase() !== 'n') {
    try {
      // Write message to temp file
      const fs = require('fs');
      const tempFile = '/tmp/commit-msg.txt';
      fs.writeFileSync(tempFile, commitMessage);

      // Execute git commit
      execSync(`git commit -F ${tempFile}`, { stdio: 'inherit' });

      console.log('\n✅ Commit created successfully!');
    } catch (error) {
      console.error('\n❌ Error creating commit:', error.message);
    }
  } else {
    console.log('\nCommit cancelled.');
  }

  rl.close();
}

generateCommit();
```

## Automated Commit Generation

### Commit Message Generator from Git Diff

```javascript
// generate-commit.js
const { execSync } = require('child_process');
const fs = require('fs');

class CommitGenerator {
  constructor() {
    this.changes = {
      added: [],
      modified: [],
      deleted: []
    };
  }

  analyzeChanges() {
    try {
      // Get staged files
      const status = execSync('git diff --cached --name-status', {
        encoding: 'utf8'
      });

      const lines = status.trim().split('\n');

      lines.forEach(line => {
        const [status, file] = line.split('\t');

        switch (status) {
          case 'A':
            this.changes.added.push(file);
            break;
          case 'M':
            this.changes.modified.push(file);
            break;
          case 'D':
            this.changes.deleted.push(file);
            break;
        }
      });

      return this.changes;
    } catch (error) {
      console.error('Error analyzing changes:', error.message);
      return null;
    }
  }

  inferCommitType() {
    const { added, modified, deleted } = this.changes;

    // Check for new features
    if (added.some(f => f.includes('feature') || f.includes('component'))) {
      return 'feat';
    }

    // Check for tests
    if (added.some(f => f.includes('test')) || modified.some(f => f.includes('test'))) {
      if (this.changes.added.length + this.changes.modified.length === 1) {
        return 'test';
      }
    }

    // Check for docs
    if (added.concat(modified).every(f =>
      f.includes('.md') || f.includes('docs/') || f.includes('README')
    )) {
      return 'docs';
    }

    // Check for config changes
    if (added.concat(modified).every(f =>
      f.includes('config') || f.includes('.json') || f.includes('.yml') ||
      f.includes('.yaml') || f.includes('package.json')
    )) {
      return 'chore';
    }

    // Check for CI changes
    if (added.concat(modified).some(f =>
      f.includes('.github') || f.includes('.gitlab') || f.includes('ci/')
    )) {
      return 'ci';
    }

    // Default to fix for modifications
    if (modified.length > 0 && added.length === 0) {
      return 'fix';
    }

    // Default to feat for additions
    if (added.length > 0) {
      return 'feat';
    }

    return 'chore';
  }

  inferScope() {
    const allFiles = [
      ...this.changes.added,
      ...this.changes.modified,
      ...this.changes.deleted
    ];

    // Extract common directory
    if (allFiles.length === 0) return '';

    const paths = allFiles.map(f => f.split('/'));

    // Find common prefix
    let commonPath = paths[0];

    for (let i = 1; i < paths.length; i++) {
      const path = paths[i];
      const newCommon = [];

      for (let j = 0; j < Math.min(commonPath.length, path.length); j++) {
        if (commonPath[j] === path[j]) {
          newCommon.push(commonPath[j]);
        } else {
          break;
        }
      }

      commonPath = newCommon;
    }

    // Use the last directory in common path as scope
    if (commonPath.length > 0) {
      return commonPath[commonPath.length - 1];
    }

    return '';
  }

  generateSubject() {
    const { added, modified, deleted } = this.changes;

    if (added.length === 1 && modified.length === 0 && deleted.length === 0) {
      const file = added[0].split('/').pop();
      return `add ${file}`;
    }

    if (modified.length === 1 && added.length === 0 && deleted.length === 0) {
      const file = modified[0].split('/').pop();
      return `update ${file}`;
    }

    if (deleted.length === 1 && added.length === 0 && modified.length === 0) {
      const file = deleted[0].split('/').pop();
      return `remove ${file}`;
    }

    // Multiple files
    const total = added.length + modified.length + deleted.length;

    if (added.length > 0) {
      return `add ${added.length} new file${added.length > 1 ? 's' : ''}`;
    }

    if (modified.length > 0) {
      return `update ${modified.length} file${modified.length > 1 ? 's' : ''}`;
    }

    return `modify ${total} file${total > 1 ? 's' : ''}`;
  }

  generateCommitMessage() {
    this.analyzeChanges();

    const type = this.inferCommitType();
    const scope = this.inferScope();
    const subject = this.generateSubject();

    const scopeStr = scope ? `(${scope})` : '';
    const message = `${type}${scopeStr}: ${subject}`;

    return message;
  }

  generateDetailedBody() {
    const { added, modified, deleted } = this.changes;
    const lines = [];

    if (added.length > 0) {
      lines.push('Added:');
      added.forEach(file => lines.push(`- ${file}`));
      lines.push('');
    }

    if (modified.length > 0) {
      lines.push('Modified:');
      modified.forEach(file => lines.push(`- ${file}`));
      lines.push('');
    }

    if (deleted.length > 0) {
      lines.push('Deleted:');
      deleted.forEach(file => lines.push(`- ${file}`));
    }

    return lines.join('\n');
  }
}

// Usage
const generator = new CommitGenerator();
const message = generator.generateCommitMessage();
console.log('Suggested commit message:');
console.log(message);
console.log('\nDetailed changes:');
console.log(generator.generateDetailedBody());
```

## Git Hooks Integration

### Commit Message Hook (commit-msg)

```bash
#!/bin/sh
# .git/hooks/commit-msg

# Conventional Commits validation hook

commit_msg_file=$1
commit_msg=$(cat "$commit_msg_file")

# Regex for conventional commits
conventional_commit_regex='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9\-]+\))?!?: .{1,50}'

# Check if commit message matches conventional commits format
if ! echo "$commit_msg" | grep -iqE "$conventional_commit_regex"; then
    echo "❌ Invalid commit message format"
    echo ""
    echo "Commit message must follow Conventional Commits format:"
    echo "  <type>(<scope>): <subject>"
    echo ""
    echo "Example: feat(auth): add login functionality"
    echo ""
    echo "Valid types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert"
    echo ""
    exit 1
fi

# Check subject length (should be <= 50 chars)
subject_line=$(echo "$commit_msg" | head -n1)
subject_length=${#subject_line}

if [ $subject_length -gt 72 ]; then
    echo "⚠️  Warning: Commit subject line is too long ($subject_length chars, should be <= 72)"
    echo ""
    echo "Current subject: $subject_line"
    echo ""
fi

# Check for imperative mood
if echo "$subject_line" | grep -qE "(ed|ing)$"; then
    echo "⚠️  Warning: Use imperative mood in subject line"
    echo "   Bad:  'Added feature' or 'Adding feature'"
    echo "   Good: 'Add feature'"
    echo ""
fi

echo "✅ Commit message format is valid"
exit 0
```

### Prepare Commit Message Hook

```bash
#!/bin/sh
# .git/hooks/prepare-commit-msg

commit_msg_file=$1
commit_source=$2

# Only run for regular commits (not merge, squash, etc.)
if [ -z "$commit_source" ]; then
    # Get current branch name
    branch=$(git symbolic-ref --short HEAD 2>/dev/null)

    # Extract issue number from branch name (e.g., feature/ABC-123-description)
    issue=$(echo "$branch" | grep -oE '[A-Z]+-[0-9]+' | head -n1)

    if [ -n "$issue" ]; then
        # Check if issue number is already in commit message
        if ! grep -q "$issue" "$commit_msg_file"; then
            # Add issue reference to commit message
            echo "" >> "$commit_msg_file"
            echo "Refs: $issue" >> "$commit_msg_file"
        fi
    fi
fi
```

## Commit Message Linting

### Commitlint Configuration

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // Type enum
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert'
      ]
    ],

    // Type case
    'type-case': [2, 'always', 'lower-case'],

    // Type empty
    'type-empty': [2, 'never'],

    // Scope case
    'scope-case': [2, 'always', 'lower-case'],

    // Subject case
    'subject-case': [2, 'always', 'lower-case'],

    // Subject empty
    'subject-empty': [2, 'never'],

    // Subject full stop
    'subject-full-stop': [2, 'never', '.'],

    // Subject max length
    'subject-max-length': [2, 'always', 50],

    // Body leading blank
    'body-leading-blank': [2, 'always'],

    // Body max line length
    'body-max-line-length': [2, 'always', 72],

    // Footer leading blank
    'footer-leading-blank': [2, 'always'],

    // Custom rules
    'header-max-length': [2, 'always', 72]
  },

  // Custom plugins
  plugins: [
    {
      rules: {
        'ticket-reference': (parsed) => {
          const { body, footer } = parsed;
          const text = (body || '') + (footer || '');

          // Check for ticket reference (e.g., #123, JIRA-123)
          const hasTicket = /(?:#\d+|[A-Z]+-\d+)/.test(text);

          return [
            hasTicket,
            'Commit must reference a ticket (e.g., #123 or JIRA-123)'
          ];
        }
      }
    }
  ]
};
```

### Husky Integration

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "prepare": "husky install"
  },
  "devDependencies": {
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0",
    "husky": "^8.0.0"
  },
  "commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  }
}
```

```bash
# Install husky and commitlint
npm install --save-dev @commitlint/cli @commitlint/config-conventional husky

# Initialize husky
npx husky install

# Add commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
```

## Interactive Commit Tools

### Commitizen Setup

```bash
# Install commitizen
npm install --save-dev commitizen cz-conventional-changelog

# Initialize
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

```json
{
  "scripts": {
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }
}
```

### Custom Commitizen Adapter

```javascript
// .cz-config.js
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     A new feature' },
    { value: 'fix', name: 'fix:      A bug fix' },
    { value: 'docs', name: 'docs:     Documentation only changes' },
    { value: 'style', name: 'style:    Code style changes' },
    { value: 'refactor', name: 'refactor: Code change that neither fixes a bug nor adds a feature' },
    { value: 'perf', name: 'perf:     Performance improvement' },
    { value: 'test', name: 'test:     Adding or updating tests' },
    { value: 'build', name: 'build:    Build system or external dependencies' },
    { value: 'ci', name: 'ci:       CI configuration files and scripts' },
    { value: 'chore', name: 'chore:    Other changes that don\'t modify src or test files' },
    { value: 'revert', name: 'revert:   Revert to a commit' }
  ],

  scopes: [
    { name: 'api' },
    { name: 'auth' },
    { name: 'database' },
    { name: 'ui' },
    { name: 'components' },
    { name: 'services' },
    { name: 'utils' },
    { name: 'config' },
    { name: 'deps' }
  ],

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
  skipQuestions: [],

  subjectLimit: 50,
  breaklineChar: '|',

  footerPrefix: 'ISSUES CLOSED:',

  messages: {
    type: 'Select the type of change that you\'re committing:',
    scope: 'What is the scope of this change (e.g. component or file name):',
    customScope: 'Denote the scope of this change:',
    subject: 'Write a SHORT description of the change:\n',
    body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    footer: 'List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?'
  }
};
```

## Best Practices

```javascript
const commitBestPractices = {
  content: [
    'Write clear, concise commit messages',
    'Use imperative mood ("Add feature" not "Added feature")',
    'Start subject line with lowercase',
    'Don\'t end subject line with a period',
    'Limit subject line to 50 characters',
    'Separate subject from body with a blank line',
    'Wrap body at 72 characters',
    'Explain what and why, not how',
    'Reference issues and pull requests'
  ],

  structure: [
    'Make atomic commits (one logical change per commit)',
    'Commit complete, working code',
    'Don\'t commit commented-out code',
    'Don\'t commit debugging statements',
    'Review your changes before committing (git diff --staged)',
    'Use interactive staging when needed (git add -p)'
  ],

  workflow: [
    'Commit often with meaningful messages',
    'Don\'t commit work-in-progress to main branch',
    'Use feature branches for new development',
    'Squash commits before merging to main',
    'Write commit message when committing, not later',
    'Use git commit hooks to enforce standards'
  ],

  team: [
    'Follow team conventions consistently',
    'Agree on commit message format',
    'Use commit templates',
    'Configure linting tools',
    'Review commit history during code reviews',
    'Document commit conventions in CONTRIBUTING.md'
  ]
};

// Example workflow
const exampleWorkflow = `
# 1. Stage specific changes
git add src/auth/login.js

# 2. Review staged changes
git diff --staged

# 3. Commit with conventional message
git commit -m "feat(auth): implement OAuth2 login flow

Add OAuth2 authentication using passport.js library.
Supports Google and GitHub providers.

Closes #42"

# 4. Or use interactive tool
npm run commit

# 5. Verify commit message
git log -1 --pretty=format:"%s%n%n%b"
`;
```

This comprehensive guide provides everything needed to implement effective git commit practices with Conventional Commits format, automation tools, and team workflows.
