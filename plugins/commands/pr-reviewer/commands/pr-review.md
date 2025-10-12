---
description: Review pull requests for code quality, security, bugs, and best practices
version: 1.0.0
---

# PR Reviewer

Comprehensive pull request review covering code quality, security, testing, and best practices.

## What It Does

- Analyzes PR changes for code quality issues
- Identifies potential bugs and edge cases
- Checks security vulnerabilities
- Verifies test coverage
- Suggests improvements and optimizations
- Reviews documentation and naming

## How to Use

Provide the PR number to review:

```bash
/pr-review 789
```

The command will analyze the PR and provide detailed feedback.

## Review Areas

**Code Quality**
- Code structure and organization
- Naming conventions
- Error handling
- Code duplication

**Functionality**
- Logic correctness
- Edge case handling
- Error conditions
- Performance implications

**Security**
- Input validation
- SQL injection risks
- XSS vulnerabilities
- Authentication/authorization

**Testing**
- Test coverage
- Test quality
- Missing test cases
- Integration tests

**Documentation**
- Code comments
- API documentation
- README updates
- Inline explanations

## Example Review

**PR #789**: "Add user search feature"

**Code Quality Issues**
```javascript
// Issue: Missing null check
function searchUsers(query) {
  return users.filter(u => u.name.includes(query));
  // Problem: Crashes if query or u.name is null
}

// Suggestion:
function searchUsers(query) {
  if (!query) return [];
  return users.filter(u => u.name?.includes(query));
}
```

**Security Concerns**
```javascript
// Issue: SQL injection risk
const query = `SELECT * FROM users WHERE name = '${input}'`;

// Suggestion: Use parameterized queries
const query = 'SELECT * FROM users WHERE name = ?';
db.execute(query, [input]);
```

**Missing Tests**
```javascript
// Needs tests for:
- Empty search query
- Special characters in query
- Case sensitivity
- No results found
- Null/undefined inputs
```

## Use Cases

- **Pre-Merge Review**: Catch issues before merging to main
- **Learning Tool**: Help team improve code quality
- **Security Audit**: Identify security vulnerabilities
- **Best Practices**: Ensure code follows standards
- **Knowledge Sharing**: Educate on better approaches

## Best Practices

- **Be Constructive**: Suggest improvements, don't just criticize
- **Explain Why**: Provide reasoning for suggestions
- **Prioritize Issues**: Mark critical vs nice-to-have changes
- **Test Suggestions**: Verify suggestions actually work
- **Link Resources**: Provide docs or examples when helpful
- **Acknowledge Good Code**: Highlight what's done well

## Review Checklist

**Functionality**
- [ ] Code does what PR description claims
- [ ] Edge cases are handled
- [ ] Error conditions are managed
- [ ] No obvious bugs

**Code Quality**
- [ ] Code is readable and maintainable
- [ ] Functions are focused and single-purpose
- [ ] No code duplication
- [ ] Naming is clear and consistent

**Security**
- [ ] Input is validated
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] Authentication is required where needed

**Testing**
- [ ] New code has tests
- [ ] Tests cover edge cases
- [ ] Tests are meaningful
- [ ] All tests pass

**Performance**
- [ ] No obvious performance issues
- [ ] Database queries are optimized
- [ ] Large data sets are handled efficiently
- [ ] No memory leaks

**Documentation**
- [ ] Complex logic is commented
- [ ] API changes are documented
- [ ] README is updated if needed
- [ ] Breaking changes are noted

## Common Issues

**Missing Error Handling**
```javascript
// Bad
const data = JSON.parse(input);

// Good
try {
  const data = JSON.parse(input);
} catch (error) {
  console.error('Invalid JSON:', error);
  return null;
}
```

**Unsafe Data Access**
```javascript
// Bad
const email = user.profile.email;

// Good
const email = user?.profile?.email || 'unknown';
```

**Inefficient Loops**
```javascript
// Bad
for (let item of items) {
  await processItem(item);
}

// Good
await Promise.all(items.map(item => processItem(item)));
```

**Hardcoded Values**
```javascript
// Bad
const timeout = 5000;

// Good
const timeout = config.requestTimeout || 5000;
```

## Review Comments Format

**Structure**
```markdown
**Issue**: Brief description of the problem

**Location**: file.ts:42

**Severity**: Critical | High | Medium | Low

**Suggestion**:
Specific code or approach to fix the issue

**Reason**:
Why this is important and what could go wrong
```

**Example**
```markdown
**Issue**: Potential SQL injection vulnerability

**Location**: api/users.ts:23

**Severity**: Critical

**Suggestion**:
Use parameterized queries instead of string concatenation:
`db.query('SELECT * FROM users WHERE id = ?', [userId])`

**Reason**:
Current code allows attackers to inject malicious SQL,
potentially exposing or deleting all user data.
```

## Approval Guidelines

**Approve** if:
- All critical issues are resolved
- Code meets quality standards
- Tests are comprehensive
- No security concerns

**Request Changes** if:
- Critical bugs exist
- Security vulnerabilities present
- Missing essential tests
- Code quality issues

**Comment** if:
- Minor improvements suggested
- Questions need clarification
- Architecture discussion needed

## Testing Review

Verify tests are:

**Comprehensive**
```javascript
// Good test coverage
describe('searchUsers', () => {
  test('returns matching users', () => { ... });
  test('handles empty query', () => { ... });
  test('is case insensitive', () => { ... });
  test('returns empty array for no matches', () => { ... });
});
```

**Meaningful**
```javascript
// Good test
expect(result.length).toBe(2);
expect(result[0].name).toBe('Alice');

// Bad test
expect(result).toBeTruthy(); // Too vague
```

## Performance Review

Check for:

**Database Efficiency**
- Are queries optimized?
- Are indexes being used?
- Is there an N+1 query problem?

**Algorithm Efficiency**
- Could a better algorithm be used?
- Is time complexity acceptable?
- Are there unnecessary iterations?

**Resource Usage**
- Are large objects being copied unnecessarily?
- Is memory being freed properly?
- Are files/connections closed?

## Documentation Review

Ensure:
- Complex logic has comments explaining why
- Public APIs have JSDoc or similar
- Breaking changes are documented
- Migration guides exist if needed

## Feedback Examples

**Positive Feedback**
```
Great job handling edge cases in the validation logic!
The error messages are clear and helpful to users.
```

**Constructive Feedback**
```
Consider extracting this logic into a separate function
to improve readability and make it easier to test.
```

**Question**
```
How does this handle the case when the user is not
authenticated? Should we add a check here?
```

## Troubleshooting

**Too Many Issues**: Focus on critical ones first

**Unclear Changes**: Ask PR author for clarification

**Disagreement**: Discuss reasoning, consider team standards

**Time Constraints**: Do quick pass for critical issues only

## Quality Standards

A thorough review includes:
- All code changes examined
- Security implications considered
- Test coverage verified
- Documentation checked
- Performance assessed
- Clear, actionable feedback
- Specific code suggestions where applicable
