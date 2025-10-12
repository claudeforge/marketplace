---
description: Rename git branches with proper naming conventions and update remote tracking
version: 2.0.0
---

# Branch Name Updater

Rename git branches following naming conventions and automatically update remote tracking.

## What It Does

- Analyzes current branch and changes
- Suggests descriptive branch names
- Renames local and remote branches
- Updates branch tracking
- Enforces naming conventions

## How to Use

Run on the branch you want to rename:

```bash
/update-branch-name
```

The command will suggest names based on your changes.

## Branch Naming Patterns

**Feature Development**
```
feature/user-profile-editor
feature/csv-export
feature/oauth-login
```

**Bug Fixes**
```
fix/validation-error
fix/memory-leak
fix/null-pointer
```

**Refactoring**
```
refactor/extract-utils
refactor/database-layer
refactor/api-structure
```

**Documentation**
```
docs/api-documentation
docs/setup-guide
docs/contributing
```

## Naming Best Practices

- Use lowercase letters
- Separate words with hyphens
- Include type prefix (feature, fix, docs, etc.)
- Be descriptive but concise
- Avoid generic names like "updates" or "changes"
- Include issue number if applicable

## Rename Workflow

**1. Check Current Branch**
```bash
git branch --show-current
# Output: temp-branch
```

**2. Analyze Changes**
```bash
git diff main...HEAD
# Review what you've changed
```

**3. Rename Locally**
```bash
git branch -m temp-branch feature/user-authentication
```

**4. Update Remote**
```bash
# Delete old remote branch
git push origin --delete temp-branch

# Push new branch and set upstream
git push -u origin feature/user-authentication
```

## Example: Renaming Process

**Scenario**: Working on search feature, branch named "test"

**Step 1: Analyze Changes**
```bash
git log main..HEAD --oneline
# Shows commits related to search functionality
```

**Step 2: Choose New Name**
```
Based on changes: feature/fuzzy-search
```

**Step 3: Rename**
```bash
git branch -m test feature/fuzzy-search
```

**Step 4: Update Remote**
```bash
git push origin --delete test
git push -u origin feature/fuzzy-search
```

## Use Cases

- **Clean Up Naming**: Rename temporary or unclear branch names
- **Enforce Standards**: Apply team naming conventions
- **Clarify Purpose**: Make branch purpose obvious from name
- **Before PR**: Rename before creating pull request
- **Team Collaboration**: Help others understand branch purpose

## Naming Conventions

**Type Prefixes**
- `feature/`: New features or functionality
- `fix/`: Bug fixes
- `hotfix/`: Critical production fixes
- `refactor/`: Code restructuring
- `docs/`: Documentation changes
- `test/`: Test additions or updates
- `chore/`: Build/config changes

**With Issue Numbers**
```
feature/123-user-dashboard
fix/456-login-error
docs/789-api-guide
```

**Team Member Prefix**
```
alice/feature/search
bob/fix/validation
```

## Safety Checks

Before renaming:

- [ ] Commit or stash all changes
- [ ] Verify branch is not protected (main/master)
- [ ] Check if others are working on this branch
- [ ] Ensure you have push permissions

## Common Scenarios

**Temporary Name to Descriptive**
```bash
# From: temp, test, branch1
# To: feature/shopping-cart
git branch -m temp feature/shopping-cart
```

**Fix Type After Work Changes**
```bash
# Started as feature, became refactor
# From: feature/update-api
# To: refactor/api-structure
git branch -m feature/update-api refactor/api-structure
```

**Add Issue Number**
```bash
# From: feature/notifications
# To: feature/234-notifications
git branch -m feature/notifications feature/234-notifications
```

## Verification

After renaming, verify:

```bash
# Check local branch
git branch --show-current

# Check remote tracking
git branch -vv

# Verify remote branch exists
git ls-remote --heads origin
```

## Troubleshooting

**Branch Already Exists**: Choose a different name

**Push Denied**: Check permissions, might need force push

**Lost Tracking**: Reset with `git branch --set-upstream-to=origin/new-name`

**Protected Branch**: Cannot rename main/master/develop

## Multiple Branches

Rename multiple branches:

```bash
# List all branches
git branch

# Rename each one
git branch -m old-name-1 new-name-1
git branch -m old-name-2 new-name-2
```

## Working with PRs

**Before PR Creation**: Rename to descriptive name

**After PR Created**: Avoid renaming (causes confusion)

**PR Already Open**: Update PR title/description instead

## Team Communication

When renaming shared branches:

1. Notify team members
2. Ensure no one else is working on it
3. Update any documentation referencing old name
4. Update CI/CD configs if needed

## Best Practices

- **Rename Early**: Do it before creating PR
- **Be Descriptive**: Make purpose clear from name
- **Follow Conventions**: Use team's naming standards
- **Update Remote**: Don't forget to update remote branch
- **Communicate**: Tell team about shared branch renames
- **Document**: Note rename in commit or PR if relevant

## Quality Checklist

A good branch name:
- [ ] Uses type prefix (feature/fix/docs/etc)
- [ ] Is descriptive of the work
- [ ] Uses lowercase and hyphens
- [ ] Is concise but clear
- [ ] Follows team conventions
- [ ] Includes issue number if applicable
