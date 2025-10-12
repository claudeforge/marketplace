---
description: Fix GitHub issues systematically by analyzing the problem, implementing solutions, and creating well-tested pull requests
version: 2.0.0
---

# GitHub Issue Fixer

Systematically resolve GitHub issues from analysis through PR creation with proper testing and documentation.

## What It Does

- Fetches and analyzes GitHub issue details
- Locates relevant code in the repository
- Implements fixes with proper error handling
- Writes tests to verify the solution
- Creates a pull request with clear documentation

## How to Use

Provide the issue number you want to fix:

```bash
/fix-github-issue 123
```

The command will guide you through the entire fix process.

## Workflow

**1. Fetch Issue Details**
```bash
gh issue view 123 --json title,body,labels,comments
```

**2. Understand the Problem**
- Read the issue description and reproduction steps
- Check comments for additional context
- Identify the expected vs actual behavior

**3. Find Related Code**
```bash
# Search for relevant files
grep -r "error message" src/
find . -name "*component-name*"
```

**4. Implement the Fix**
- Make minimal changes to address the root cause
- Add proper error handling
- Follow existing code patterns

**5. Write Tests**
```javascript
// Example test
test('should handle edge case correctly', () => {
  const result = functionName(edgeCaseInput);
  expect(result).toBe(expectedOutput);
});
```

**6. Verify Everything Works**
```bash
npm test
npm run lint
npm run build
```

**7. Create Pull Request**
```bash
gh pr create --title "Fix: Issue description (#123)" \
  --body "Fixes #123\n\nChanges:\n- Fixed X\n- Added test for Y"
```

## Example Fix

Here's a real-world example:

**Issue**: "Validation fails for email addresses with plus signs"

**Analysis**:
- Current regex doesn't allow + character
- Located in `src/utils/validation.ts`

**Solution**:
```javascript
// Before
const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;

// After
const emailRegex = /^[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
```

**Test**:
```javascript
test('validates emails with plus signs', () => {
  expect(isValidEmail('user+tag@example.com')).toBe(true);
});
```

## Use Cases

- **Bug Fixes**: Resolve reported bugs with proper root cause analysis
- **Feature Requests**: Implement requested functionality systematically
- **Performance Issues**: Profile and optimize slow code paths
- **Documentation Gaps**: Fill in missing or incorrect documentation
- **Test Coverage**: Add missing test cases for edge conditions

## Best Practices

- **Reproduce First**: Always reproduce the issue before attempting a fix
- **Root Cause**: Fix the underlying problem, not just the symptoms
- **Minimal Changes**: Keep fixes focused and avoid refactoring unrelated code
- **Test Coverage**: Add tests that would have caught the bug
- **Clear Commits**: Write descriptive commit messages explaining the fix
- **Document Changes**: Update relevant documentation and comments
- **Link Issues**: Reference the issue number in commits and PR description

## Common Issue Types

**Null/Undefined Errors**
```javascript
// Add defensive checks
if (!user?.profile) {
  return defaultProfile;
}
```

**Logic Errors**
```javascript
// Fix conditional logic
if (count > 0 && isActive) {  // Was: count >= 0 || isActive
  processItems();
}
```

**Validation Issues**
```javascript
// Strengthen validation
if (!email || !email.includes('@')) {
  throw new Error('Invalid email');
}
```

**Race Conditions**
```javascript
// Add proper async handling
await saveData();  // Was missing await
await updateUI();
```

## Testing Checklist

- [ ] Issue is fully reproduced locally
- [ ] Fix addresses root cause
- [ ] Unit tests added and passing
- [ ] Integration tests updated if needed
- [ ] Manual testing completed
- [ ] Edge cases covered
- [ ] No regressions introduced
- [ ] Linting passes
- [ ] Build succeeds

## PR Template

When creating your PR, include:

```markdown
## Fixes
Closes #123

## Problem
Brief description of the issue and its impact

## Solution
Explanation of how the fix works

## Testing
- Added unit test for X
- Verified manually with Y
- Checked edge cases A, B, C

## Changes
- `file1.ts`: Fixed validation logic
- `file1.test.ts`: Added test coverage
```

## Troubleshooting

**Can't Reproduce**: Ask reporter for more details, exact steps, environment info

**Multiple Possible Causes**: Fix the most likely cause first, test thoroughly

**Tests Failing**: Ensure your fix doesn't break existing functionality

**Unclear Requirements**: Comment on the issue asking for clarification

## Quality Standards

A good fix includes:
- Clear understanding of the problem
- Minimal, focused code changes
- Tests proving the fix works
- No unrelated changes
- Updated documentation
- Professional commit messages
- Thorough manual verification
