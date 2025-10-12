---
description: Generate pull requests with proper title formatting, structured descriptions, and GitHub CLI integration
version: 1.0.0
---

# Pull Request Generator

Generate well-formatted pull requests using GitHub CLI with consistent titles, structured descriptions, and proper templates.

## What It Does

- Creates pull requests using GitHub CLI
- Formats PR titles with conventional commit prefixes
- Generates structured PR descriptions
- Links related issues automatically
- Sets appropriate labels and reviewers

## How to Use

Run after committing and pushing your changes:

```bash
/create-pull-request
```

The command will guide you through PR creation.

## PR Title Format

Use conventional commit format with optional emoji:

```
<type>(<scope>): <description>

Examples:
feat(auth): add OAuth2 login support
fix(api): resolve rate limiting issue
docs(readme): update installation guide
```

## Common Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code restructuring
- `test`: Test additions or modifications
- `chore`: Build/config changes

## PR Description Template

```markdown
## Summary
Brief 1-2 sentence overview of changes

## Changes Made
- Change 1
- Change 2
- Change 3

## Related Issues
Closes #123
Relates to #456

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests passing
- [ ] Manual testing completed

## Screenshots
(if UI changes)
```

## GitHub CLI Commands

**Create PR**
```bash
gh pr create \
  --title "feat(search): add fuzzy search" \
  --body "$(cat <<'EOF'
## Summary
Implement fuzzy search for user queries

## Changes Made
- Added fuzzysearch library
- Updated search component
- Added tests

## Related Issues
Closes #234
EOF
)"
```

**Create Draft PR**
```bash
gh pr create --draft --title "WIP: Feature in progress"
```

**Set Base Branch**
```bash
gh pr create --base develop --head feature/new-feature
```

**Add Reviewers and Labels**
```bash
gh pr create \
  --reviewer alice,bob \
  --label "enhancement,needs-review" \
  --assignee charlie
```

## Complete Example

**Scenario**: Adding export feature

**Step 1: Commit and Push**
```bash
git add .
git commit -m "feat(export): add CSV export functionality"
git push -u origin feature/csv-export
```

**Step 2: Create PR**
```bash
gh pr create \
  --title "feat(export): add CSV export functionality" \
  --body "$(cat <<'EOF'
## Summary
Add ability to export data as CSV files

## Changes Made
- Created ExportService class
- Added CSV conversion logic
- Added download button to UI
- Wrote unit tests

## Related Issues
Closes #189

## Testing
- [x] Unit tests pass
- [x] Tested with sample data
- [x] Verified file downloads correctly
EOF
)"
```

## Use Cases

- **Feature Development**: Submit new features for review
- **Bug Fixes**: Create PRs for bug resolutions
- **Documentation**: Update docs with clear descriptions
- **Refactoring**: Explain code improvements
- **Dependencies**: Update package versions with changelogs

## Best Practices

- **Clear Titles**: Make purpose immediately obvious
- **Detailed Descriptions**: Explain what, why, and how
- **Link Issues**: Reference related issue numbers
- **Test Status**: Document what testing was done
- **Screenshots**: Include for UI changes
- **Breaking Changes**: Clearly mark any breaking changes
- **Small PRs**: Keep focused on one concern

## PR Types

**Feature PR**
```
feat(payments): add Stripe integration

## Summary
Integrate Stripe for payment processing

## Changes Made
- Added Stripe SDK
- Created payment service
- Added checkout flow
```

**Bug Fix PR**
```
fix(validation): correct email regex

## Summary
Fix email validation rejecting valid addresses

## Changes Made
- Updated regex to allow + signs
- Added test cases
- Fixed edge case handling
```

**Documentation PR**
```
docs(api): update endpoint documentation

## Summary
Document all REST API endpoints

## Changes Made
- Added endpoint descriptions
- Included request/response examples
- Updated authentication section
```

## Advanced Options

**Set Milestone**
```bash
gh pr create --milestone "v2.0"
```

**Add Projects**
```bash
gh pr create --project "Development Sprint"
```

**Template from File**
```bash
gh pr create --body-file pr-template.md
```

**Web UI**
```bash
gh pr create --web
```

## Checklist for PR

Before creating, verify:
- [ ] Code is committed and pushed
- [ ] All tests pass locally
- [ ] PR title follows format
- [ ] Description is complete
- [ ] Related issues linked
- [ ] Reviewers assigned
- [ ] Appropriate labels added

## Troubleshooting

**Not Authenticated**: Run `gh auth login`

**No Upstream Branch**: Push with `git push -u origin branch-name`

**PR Already Exists**: Check existing PRs with `gh pr list`

**Wrong Base Branch**: Specify with `--base main`

## After Creating PR

**View PR**
```bash
gh pr view 123
```

**Check Status**
```bash
gh pr checks
```

**Edit PR**
```bash
gh pr edit 123 --title "New title"
```

**Add Comment**
```bash
gh pr comment 123 --body "Additional info"
```

**Mark Ready**
```bash
gh pr ready 123
```

## Quality Standards

A good PR includes:
- Descriptive, formatted title
- Clear summary of changes
- Linked related issues
- Testing information
- Appropriate reviewers
- Relevant labels
- Complete description following template
