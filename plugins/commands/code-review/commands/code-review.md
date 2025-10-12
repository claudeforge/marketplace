---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: Perform comprehensive code review analyzing quality, security, performance, and maintainability with actionable feedback
---

# Code Review Command

Conduct thorough code review to identify issues, suggest improvements, and ensure code quality standards.

## Usage

```bash
/code-review [file_or_directory]
```

**Examples:**
```bash
/code-review                           # Review recent git changes
/code-review src/api/users.js         # Review specific file
/code-review src/components/          # Review directory
/code-review --pr 123                 # Review pull request
```

## What This Command Does

Performs comprehensive code review across multiple dimensions:

1. **Code Quality**: Structure, readability, maintainability
2. **Security**: Vulnerabilities, authentication, data protection
3. **Performance**: Bottlenecks, optimization opportunities
4. **Best Practices**: Standards compliance, design patterns
5. **Testing**: Coverage, test quality, edge cases

## Review Process

### Step 1: Identify Changes

First, determine what to review:
```bash
# Check recent changes
git status
git diff HEAD

# For PR reviews
gh pr diff <pr_number>
```

### Step 2: Multi-Dimensional Analysis

**Code Quality Check**:
- Cyclomatic complexity (functions should be <10)
- Code duplication (identify DRY violations)
- Naming conventions (clear, descriptive names)
- Function length (keep under 50 lines)
- Comment quality (explain why, not what)

**Security Analysis**:
- Input validation (SQL injection, XSS prevention)
- Authentication/authorization checks
- Secrets management (no hardcoded credentials)
- Dependency vulnerabilities
- Error handling (no sensitive data leaks)

**Performance Review**:
- Algorithm efficiency (time/space complexity)
- Database query optimization (N+1 problems)
- Resource management (memory leaks, connections)
- Caching opportunities
- Async operations usage

**Architecture Assessment**:
- SOLID principles adherence
- Design pattern usage
- Separation of concerns
- Dependency management
- API design quality

**Testing Evaluation**:
- Test coverage (aim for >80%)
- Test quality (unit, integration, edge cases)
- Mocking strategy
- Test maintainability
- Error scenario coverage

### Step 3: Generate Feedback

Provide actionable feedback in this format:

```markdown
## Code Review Results

### Critical Issues (Must Fix)
- [SECURITY] SQL injection vulnerability in user.login() - Line 45
- [BUG] Null pointer exception possible in processOrder() - Line 123

### Important (Should Fix)
- [PERFORMANCE] N+1 query in getUserOrders() - Line 67
- [QUALITY] Function complexity too high (CC: 15) in calculatePrice() - Line 234

### Suggestions (Nice to Have)
- [REFACTOR] Extract method: validateUserInput() from createUser()
- [STYLE] Use consistent naming: camelCase vs snake_case

### Positive Feedback
- Excellent error handling in PaymentService
- Good test coverage for authentication module (92%)
```

## Review Checklist

### Code Quality
- [ ] Functions are single-purpose and focused
- [ ] Variable names are descriptive and clear
- [ ] No code duplication (DRY principle)
- [ ] Proper error handling throughout
- [ ] Consistent code style and formatting

### Security
- [ ] All inputs are validated and sanitized
- [ ] Authentication/authorization implemented correctly
- [ ] No hardcoded secrets or credentials
- [ ] SQL queries use parameterization
- [ ] Sensitive data is encrypted

### Performance
- [ ] No obvious performance bottlenecks
- [ ] Database queries are optimized
- [ ] Appropriate data structures used
- [ ] Caching implemented where beneficial
- [ ] Async operations used for I/O

### Testing
- [ ] New code has test coverage
- [ ] Tests are meaningful and maintainable
- [ ] Edge cases are covered
- [ ] Tests follow AAA pattern (Arrange, Act, Assert)
- [ ] No flaky or unreliable tests

### Documentation
- [ ] Complex logic is explained
- [ ] API changes are documented
- [ ] README updated if needed
- [ ] Breaking changes are noted
- [ ] Examples provided for new features

## Common Issues & Fixes

### Security Issues

**SQL Injection**:
```javascript
// Bad
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Good
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);
```

**XSS Prevention**:
```javascript
// Bad
element.innerHTML = userInput;

// Good
element.textContent = userInput;
// Or use sanitization library
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Performance Issues

**N+1 Query Problem**:
```python
# Bad
users = User.query.all()
for user in users:
    orders = user.orders  # Executes query for each user

# Good
users = User.query.options(joinedload(User.orders)).all()
```

**Memory Leak**:
```javascript
// Bad - event listener not removed
element.addEventListener('click', handler);

// Good - cleanup
useEffect(() => {
  element.addEventListener('click', handler);
  return () => element.removeEventListener('click', handler);
}, []);
```

### Code Quality Issues

**High Complexity**:
```python
# Bad - complexity 12
def process_payment(user, amount, method, promo):
    if user.is_premium:
        if method == "credit":
            if promo:
                # ... nested logic
            else:
                # ... more logic
        elif method == "debit":
            # ... more nesting
    else:
        # ... even more logic

# Good - extract methods
def process_payment(user, amount, method, promo):
    discount = calculate_discount(user, promo)
    final_amount = apply_discount(amount, discount)
    return charge_payment(user, final_amount, method)
```

## Review Best Practices

1. **Be Constructive**: Focus on the code, not the person
2. **Provide Context**: Explain why changes are needed
3. **Suggest Solutions**: Don't just point out problems
4. **Prioritize Issues**: Critical > Important > Suggestions
5. **Acknowledge Good Work**: Positive feedback is valuable
6. **Ask Questions**: "Why did you choose this approach?"
7. **Use Examples**: Show better alternatives with code

## Automated Checks

Run these tools before manual review:
```bash
# Linting
eslint src/
pylint app/

# Security scanning
npm audit
safety check

# Test coverage
jest --coverage
pytest --cov

# Complexity analysis
complexity src/
```

## Review Context

When reviewing, gather this information:
```bash
# Recent changes
git log --oneline -5
git diff main...HEAD

# Changed files
git diff --name-only main...HEAD

# Test results
npm test
pytest

# Build status
npm run build
```

## Methodology

This command follows code review best practices:
- **Risk-Based Prioritization**: Critical issues first
- **Constructive Feedback**: Solutions, not just problems
- **Knowledge Sharing**: Explain reasoning
- **Consistency**: Apply standards uniformly
- **Continuous Learning**: Capture best practices