---
description: Create pull requests with formatted code, logical commits, and comprehensive descriptions
version: 1.0.0
---

# PR Creator

Automate pull request creation with code formatting, commit organization, and detailed PR descriptions.

## What It Does

- Formats code with your project's formatter
- Organizes changes into logical commits
- Creates feature branches with descriptive names
- Generates comprehensive PR descriptions
- Pushes to remote and opens PR

## How to Use

Run when you're ready to create a PR from your changes:

```bash
/create-pr
```

The command handles everything from formatting to PR submission.

## Workflow Steps

**1. Format Code**
```bash
# Run project formatter
npm run format
# or
biome format --write .
```

**2. Analyze Changes**
```bash
git status
git diff
```

**3. Create Feature Branch**
```bash
git checkout -b feature/user-profile-editor
```

**4. Organize Commits**
```bash
# Group related changes
git add src/components/Profile*.tsx
git commit -m "feat(profile): add profile editor component"

git add src/api/profile.ts
git commit -m "feat(api): add profile update endpoint"
```

**5. Push and Create PR**
```bash
git push -u origin feature/user-profile-editor
gh pr create --title "Add user profile editor" --body "..."
```

## PR Description Template

```markdown
## Summary
Brief overview of what this PR accomplishes

## Changes
- Added profile editor component
- Created profile update API endpoint
- Added form validation
- Wrote unit tests

## Type of Change
- [x] New feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentation update

## Testing
- All unit tests passing
- Manually tested on Chrome/Firefox
- Verified form validation edge cases

## Related Issues
Closes #234
```

## Example: Complete PR Creation

**Scenario**: Adding export functionality

**Step 1: Format**
```bash
npm run format
# Fixed formatting in 3 files
```

**Step 2: Create Branch**
```bash
git checkout -b feature/export-data
```

**Step 3: Commit Changes**
```bash
git add src/services/export.ts src/services/export.test.ts
git commit -m "feat(export): add data export service"

git add src/components/ExportButton.tsx
git commit -m "feat(ui): add export button to dashboard"

git add README.md
git commit -m "docs: add export feature documentation"
```

**Step 4: Create PR**
```bash
git push -u origin feature/export-data
gh pr create \
  --title "Add data export functionality" \
  --body "Closes #123. Adds CSV/JSON export with download button."
```

## Use Cases

- **Feature Development**: Create PRs for new features with proper structure
- **Bug Fixes**: Submit fixes with clear problem/solution description
- **Refactoring**: Document code improvements without behavior changes
- **Documentation**: Update docs with organized commits

## Best Practices

- **Format First**: Always format code before committing
- **Logical Commits**: Group related changes together
- **Clear Messages**: Write descriptive commit messages
- **Test Everything**: Run tests before pushing
- **Descriptive Titles**: Make PR title clear and specific
- **Link Issues**: Reference related issue numbers
- **Small PRs**: Keep changes focused and reviewable

## Commit Organization

**Good Organization**
```
✓ feat(auth): add login form component
✓ feat(auth): add authentication API
✓ test(auth): add login tests
✓ docs(auth): update authentication guide
```

**Poor Organization**
```
✗ update stuff
✗ WIP
✗ more changes
✗ fix
```

## Branch Naming

Use descriptive branch names with prefixes:

- `feature/add-dark-mode`
- `fix/validation-error`
- `refactor/extract-utils`
- `docs/api-documentation`

## Code Formatting

The command runs formatters automatically:

**JavaScript/TypeScript**
```bash
prettier --write .
# or
biome format --write .
```

**Python**
```bash
black .
ruff format .
```

**Go**
```bash
go fmt ./...
```

## PR Checklist

Before creating PR, verify:
- [ ] Code is formatted
- [ ] All tests pass
- [ ] Commits are logical and atomic
- [ ] Branch name is descriptive
- [ ] PR description is complete
- [ ] Related issues are linked
- [ ] No debug code remains

## Testing Before PR

```bash
# Run tests
npm test

# Run linter
npm run lint

# Build project
npm run build

# Type check (if TypeScript)
npm run typecheck
```

All checks must pass before creating PR.

## Multiple Reviewers

Request specific reviewers:

```bash
gh pr create \
  --reviewer alice,bob \
  --assignee charlie \
  --label "needs-review"
```

## Draft PRs

For work in progress:

```bash
gh pr create --draft --title "WIP: Feature in progress"
```

Mark ready when complete:

```bash
gh pr ready
```

## Troubleshooting

**Formatting Fails**: Check formatter config, fix errors manually

**Push Rejected**: Pull latest changes, rebase, try again

**PR Creation Fails**: Verify GitHub CLI is authenticated

**Tests Fail**: Fix tests before creating PR

**Merge Conflicts**: Resolve conflicts with base branch

## Quality Standards

A good PR includes:
- Formatted, lint-free code
- Logical, atomic commits
- Comprehensive description
- Linked issues
- Passing tests
- Clear title
- Appropriate reviewers assigned
