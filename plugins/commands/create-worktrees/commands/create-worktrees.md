---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: Create and manage Git worktrees for parallel development and efficient branch management
---

# Create Worktrees Command

Set up Git worktrees to work on multiple branches simultaneously without switching contexts.

## Usage

```bash
/create-worktrees <branch_name> [base_branch] [path]
```

**Examples:**
```bash
/create-worktrees feature/new-auth                    # Create worktree for new branch
/create-worktrees hotfix/security-patch main         # Create from main branch
/create-worktrees feature/api-v2 develop ../worktrees/api-v2  # Custom path
```

## What This Command Does

Creates Git worktrees that allow you to:

1. **Work on Multiple Branches**: Switch between features without stashing
2. **Parallel Development**: Build/test different branches simultaneously
3. **PR Reviews**: Check out PRs without affecting main work
4. **Hotfix Management**: Work on urgent fixes while continuing feature work
5. **Efficient Testing**: Compare changes across branches easily

## Git Worktrees Explained

A worktree is a linked working directory that shares the same Git repository:

```
project/
├── .git/                    # Main repository
├── src/                     # Main branch
└── ../worktrees/
    ├── feature-a/          # Worktree for feature-a branch
    ├── feature-b/          # Worktree for feature-b branch
    └── pr-123/             # Worktree for PR review
```

**Benefits**:
- No need to stash changes when switching branches
- Run tests on multiple branches simultaneously
- Keep builds for different branches ready
- Review PRs without disrupting current work

## Creating Worktrees

### Basic Worktree Creation

```bash
# Create worktree for new branch
git worktree add ../worktrees/feature-xyz -b feature/xyz

# Create from existing branch
git worktree add ../worktrees/hotfix origin/hotfix/security

# Create from specific commit
git worktree add ../worktrees/test-v1 abc123
```

### Recommended Workflow

**Step 1: Create Worktree**
```bash
# Create worktree directory structure
mkdir -p ../worktrees

# Add worktree for new feature
git worktree add ../worktrees/feature-auth -b feature/user-auth

# Navigate to worktree
cd ../worktrees/feature-auth
```

**Step 2: Work in Worktree**
```bash
# Make changes
vim src/auth/login.js

# Commit normally
git add .
git commit -m "Add user authentication"
git push -u origin feature/user-auth
```

**Step 3: List Worktrees**
```bash
git worktree list
# Output:
# /path/to/project              abc123 [main]
# /path/to/worktrees/feature-auth  def456 [feature/user-auth]
```

## Common Use Cases

### 1. PR Review Workflow

Review pull requests without affecting your current work:

```bash
# Fetch PR branch
gh pr checkout 123

# Or manually
git fetch origin pull/123/head:pr-123
git worktree add ../worktrees/pr-123 pr-123

# Review the code
cd ../worktrees/pr-123
npm install
npm test
npm run build

# Return to your work
cd ../../project
```

### 2. Multi-Feature Development

Work on multiple features simultaneously:

```bash
# Feature A
git worktree add ../worktrees/feature-a -b feature/payment-gateway
cd ../worktrees/feature-a
npm install
npm run dev # Runs on port 3000

# Feature B (in another terminal)
cd /path/to/project
git worktree add ../worktrees/feature-b -b feature/notification-system
cd ../worktrees/feature-b
npm install
PORT=3001 npm run dev # Runs on port 3001
```

### 3. Hotfix While Developing

Handle urgent fixes without stashing feature work:

```bash
# You're working on a feature
cd /path/to/worktrees/feature-dashboard

# Urgent hotfix needed
cd /path/to/project
git worktree add ../worktrees/hotfix-urgent -b hotfix/security-patch main
cd ../worktrees/hotfix-urgent

# Fix the issue
vim src/security/validator.js
git add .
git commit -m "Fix security vulnerability"
git push -u origin hotfix/security-patch

# Create PR for hotfix
gh pr create --title "Security patch" --base main

# Return to feature work
cd ../feature-dashboard
```

### 4. Testing Across Branches

Compare behavior across different branches:

```bash
# Main branch
cd /path/to/project
npm test

# Feature branch
cd ../worktrees/feature-new-api
npm test

# Compare results side by side
```

## Managing Worktrees

### List Worktrees

```bash
# List all worktrees
git worktree list

# Detailed view
git worktree list --porcelain
```

### Remove Worktrees

```bash
# Remove worktree (safe - checks for uncommitted changes)
git worktree remove ../worktrees/feature-completed

# Force remove (use with caution)
git worktree remove --force ../worktrees/abandoned-feature

# Or manually delete and prune
rm -rf ../worktrees/old-feature
git worktree prune
```

### Clean Up Stale Worktrees

```bash
# Show stale worktrees
git worktree prune --dry-run

# Remove stale references
git worktree prune
```

## Advanced Techniques

### Batch Create Worktrees for PRs

```bash
# Create worktrees for multiple PRs
gh pr list --json number,headRefName --limit 5 | \
  jq -r '.[] | "\(.number) \(.headRefName)"' | \
  while read -r pr_num branch; do
    git worktree add "../worktrees/pr-$pr_num" "$branch" 2>/dev/null || \
      git worktree add "../worktrees/pr-$pr_num" -b "$branch" "origin/$branch"
  done
```

### Worktree with Environment Setup

```bash
# Create worktree with automatic setup
create_worktree_with_setup() {
  local branch=$1
  local path="../worktrees/$branch"

  git worktree add "$path" -b "$branch"
  cd "$path"

  # Setup environment
  npm install
  cp ../.env.example .env

  # Run initial build
  npm run build

  echo "Worktree ready: $path"
}

create_worktree_with_setup "feature/new-feature"
```

### Shared Build Cache

Optimize build times by sharing node_modules:

```bash
# Symbolic link to shared node_modules
cd ../worktrees/feature-a
ln -s ../../project/node_modules node_modules
```

## Best Practices

### 1. Organize Worktrees

Keep worktrees in a dedicated directory:
```
project/
├── .git/
├── src/
└── ../worktrees/
    ├── features/
    │   ├── auth/
    │   └── dashboard/
    ├── hotfixes/
    │   └── security-patch/
    └── reviews/
        ├── pr-123/
        └── pr-124/
```

### 2. Naming Conventions

Use consistent naming:
- Features: `feature-{name}`
- Hotfixes: `hotfix-{issue}`
- PRs: `pr-{number}`
- Tests: `test-{scenario}`

### 3. Clean Up Regularly

Remove merged worktrees:
```bash
# After PR is merged
git worktree remove ../worktrees/feature-completed
git branch -d feature/completed
git push origin --delete feature/completed
```

### 4. Documentation

Track worktrees in your project:
```bash
# Create worktree registry
echo "# Active Worktrees" > .worktrees.md
git worktree list >> .worktrees.md
```

## Common Issues & Solutions

### Issue: "Already checked out"
```bash
# Error: branch is already checked out
# Solution: Use a worktree or checkout in different location
git worktree add --detach ../worktrees/temp
cd ../worktrees/temp
git checkout feature/branch
```

### Issue: "Worktree path exists"
```bash
# Error: directory already exists
# Solution: Remove existing directory
rm -rf ../worktrees/old-path
git worktree add ../worktrees/old-path -b new-branch
```

### Issue: Missing dependencies
```bash
# Each worktree needs its own node_modules
cd ../worktrees/new-feature
npm install

# Or use shared cache (use with caution)
npm ci --cache ../cache
```

## Performance Tips

1. **Limit Active Worktrees**: Keep 3-5 active worktrees max
2. **Share Git Objects**: Worktrees share the .git directory automatically
3. **Exclude from Backup**: Add worktrees directory to backup exclusions
4. **Use Shallow Clones**: For temporary review worktrees
5. **Clean Up Regularly**: Remove merged or abandoned worktrees

## Safety Guidelines

1. **Always commit before removing**: Ensure no uncommitted changes
2. **Check worktree status**: Use `git worktree list` before operations
3. **Avoid nested worktrees**: Don't create worktrees inside worktrees
4. **Backup important work**: Push branches before removing worktrees
5. **Use prune carefully**: Run `git worktree prune --dry-run` first

## Integration with IDEs

### VS Code
```bash
# Open worktree in new window
code ../worktrees/feature-auth

# Or add to workspace
code --add ../worktrees/feature-auth
```

### JetBrains IDEs
```bash
# Open worktree as new project
idea ../worktrees/feature-auth
```

## Methodology

Git worktrees enable efficient parallel development by:
- **Context Preservation**: Keep each branch's build and state separate
- **Quick Switching**: Move between branches instantly (just cd)
- **Parallel Builds**: Test multiple configurations simultaneously
- **Safe Experimentation**: Isolated environments for each branch
- **Efficient Reviews**: Check PRs without disrupting current work
