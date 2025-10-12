---
description: Create well-formatted git commits with conventional commit format and proper staging
version: 1.0.0
---

# Intelligent Commit

Create meaningful git commits following conventional commit standards with proper staging and validation.

## What It Does

- Analyzes your git changes to understand what was modified
- Generates descriptive commit messages in conventional format
- Stages files appropriately based on change type
- Runs pre-commit checks (linting, tests)
- Creates clean, atomic commits

## How to Use

Run the command when you have changes to commit:

```bash
/commit
```

The command will analyze your changes and create appropriate commits.

## Conventional Commit Format

Commits follow this structure:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

## Commit Types

- **feat**: New feature or functionality
- **fix**: Bug fix
- **docs**: Documentation changes only
- **style**: Code formatting (no logic changes)
- **refactor**: Code restructuring without changing behavior
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, configs

## Example Commits

**Feature Addition**
```
feat(auth): add password reset functionality

Implement email-based password reset flow with token generation
and expiration handling.

Closes #145
```

**Bug Fix**
```
fix(validation): handle special characters in usernames

Previously usernames with dashes caused validation errors.
Updated regex pattern to allow hyphens and underscores.
```

**Refactoring**
```
refactor(api): extract common error handling logic

Move duplicate error handling code into reusable middleware
to improve maintainability.
```

## Workflow

**1. Check Status**
```bash
git status
git diff
```

**2. Analyze Changes**
- Identify what files changed
- Understand the purpose of changes
- Group related modifications

**3. Run Pre-Commit Checks**
```bash
npm run lint
npm test
```

**4. Stage Files**
```bash
git add src/auth.ts src/auth.test.ts
```

**5. Create Commit**
```bash
git commit -m "feat(auth): add two-factor authentication"
```

## Use Cases

- **Clean History**: Maintain organized, readable git history
- **Team Consistency**: Ensure all team members follow same commit standards
- **Automated Changelogs**: Enable automatic changelog generation
- **Easy Rollback**: Clear commit messages make reverting easier
- **Better Reviews**: Help reviewers understand changes quickly

## Best Practices

- **Atomic Commits**: One logical change per commit
- **Present Tense**: Use "add feature" not "added feature"
- **Descriptive**: Explain what and why, not just what
- **Short Subject**: Keep first line under 72 characters
- **Reference Issues**: Link to issue numbers when applicable
- **Test Before Commit**: Ensure tests pass before committing
- **Group Related Changes**: Stage and commit related files together

## Smart Commit Splitting

If you have multiple unrelated changes, split them:

**Example**: Both feature work and bug fix in working directory

```bash
# Commit the feature first
git add src/features/export.ts src/features/export.test.ts
git commit -m "feat(export): add CSV export functionality"

# Then commit the bug fix
git add src/validation.ts
git commit -m "fix(validation): correct email regex pattern"
```

## Commit Message Guidelines

**Good Messages**
```
feat(api): add rate limiting middleware
fix(db): prevent SQL injection in user queries
docs(readme): update installation instructions
```

**Bad Messages**
```
update stuff
fixed bug
WIP
changes
```

## Scope Examples

Use scopes to indicate the area of change:

- `auth`: Authentication/authorization
- `api`: API endpoints
- `ui`: User interface
- `db`: Database
- `config`: Configuration
- `deps`: Dependencies

## Pre-Commit Validation

The command runs these checks:

```bash
# Lint code
npm run lint

# Type check (TypeScript)
npm run typecheck

# Run tests
npm test

# Check build
npm run build
```

If any check fails, the commit is blocked until fixed.

## Breaking Changes

For breaking changes, add exclamation mark and footer:

```
feat(api)!: redesign user endpoint structure

BREAKING CHANGE: User API response format has changed.
Old format: { name, email }
New format: { profile: { name, email } }

See migration guide for details.
```

## Amending Commits

To update the last commit:

```bash
# Add forgotten files
git add forgotten-file.ts
git commit --amend --no-edit

# Update commit message
git commit --amend -m "new message"
```

## Troubleshooting

**Commit Blocked by Tests**: Fix failing tests before committing

**Lint Errors**: Run `npm run lint --fix` to auto-fix issues

**Unclear What Changed**: Review `git diff` carefully

**Too Many Changes**: Split into multiple focused commits

## Quality Checklist

Before committing, verify:
- [ ] All tests pass
- [ ] Linting passes
- [ ] Commit message is descriptive
- [ ] Changes are focused and related
- [ ] No debug code or commented-out code
- [ ] Documentation updated if needed
- [ ] Follows conventional commit format
