---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: Analyze code changes with detailed feedback on quality, patterns, and improvement opportunities
---

# Code Review Assistant Command

Provide intelligent code analysis and actionable improvement recommendations for code changes.

## Usage

```bash
/code-review-assistant <target>
```

**Examples:**
```bash
/code-review-assistant @$ARGUMENTS           # Review with context
/code-review-assistant src/api/auth.js       # Review specific file
/code-review-assistant .                     # Review all changes
```

## What This Command Does

Analyzes code to provide:

1. **Pattern Recognition**: Identify design patterns and architectural approaches
2. **Quality Assessment**: Evaluate code structure and maintainability
3. **Improvement Suggestions**: Specific, actionable recommendations
4. **Best Practice Guidance**: Industry standards and proven patterns
5. **Learning Opportunities**: Educational insights for team growth

## Analysis Framework

### Step 1: Context Gathering

Collect information about the code:
```bash
# File information
git log --oneline <file> -10
git blame <file>

# Related files
git diff --name-only HEAD~5..HEAD

# Code metrics
cloc <file>
```

### Step 2: Pattern Analysis

Identify patterns in the code:

**Design Patterns**:
- Singleton, Factory, Strategy, Observer, etc.
- Proper implementation and usage
- Opportunities for pattern application

**Architectural Patterns**:
- MVC, MVVM, Clean Architecture
- Layered architecture adherence
- Separation of concerns

**Anti-Patterns**:
- God objects
- Spaghetti code
- Tight coupling
- Magic numbers
- Hardcoded values

### Step 3: Quality Evaluation

**Code Structure**:
```javascript
// Example: Function complexity analysis
function analyzeComplexity(code) {
  return {
    cyclomaticComplexity: calculateCC(code),
    cognitiveComplexity: calculateCognitive(code),
    nestingDepth: calculateNesting(code),
    recommendation: getRecommendation()
  };
}
```

**Maintainability Factors**:
- Clear naming conventions
- Function/method length
- Parameter count
- Return complexity
- Side effects

### Step 4: Generate Recommendations

Provide structured feedback:

```markdown
## Analysis Results

### Architecture & Design
**Current Approach**: MVC with service layer
**Strengths**: Clear separation of concerns
**Improvements**:
- Consider dependency injection for better testability
- Extract business logic from controllers to services

### Code Quality
**Complexity**: 3 functions exceed complexity threshold
- `processUserData()` CC: 12 (target: <10)
- `validateInput()` CC: 11 (target: <10)

**Recommendations**:
1. Extract validation logic into separate validators
2. Use early returns to reduce nesting
3. Apply strategy pattern for different data types

### Performance
**Potential Issues**:
- Database queries in loop (lines 45-52)
- Unnecessary object cloning (line 78)

**Optimizations**:
- Batch database queries
- Use shallow copy where deep copy not needed

### Testing
**Coverage**: 75% (target: >80%)
**Missing Tests**:
- Edge cases for empty input
- Error handling scenarios
- Concurrent access patterns
```

## Review Categories

### 1. Code Structure

**What to Check**:
- Function size (< 50 lines ideal)
- Class size (< 300 lines ideal)
- Parameter count (< 5 ideal)
- Nesting depth (< 4 levels)
- Cyclomatic complexity (< 10)

**Example Feedback**:
```python
# Current: High complexity
def process_order(order, user, payment, shipping, promo):
    if user.is_verified:
        if payment.is_valid:
            if shipping.is_available:
                # ... deep nesting

# Suggested: Simplified
def process_order(order_request: OrderRequest) -> OrderResult:
    validate_order_request(order_request)
    payment = process_payment(order_request.payment)
    shipping = arrange_shipping(order_request.shipping)
    return create_order(order_request, payment, shipping)
```

### 2. Security Analysis

**Check For**:
- Input validation
- SQL injection risks
- XSS vulnerabilities
- Authentication/authorization
- Sensitive data exposure
- Secure password handling

**Example Feedback**:
```javascript
// Issue: SQL injection vulnerability
const query = `SELECT * FROM users WHERE email = '${email}'`;

// Fix: Use parameterized queries
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);

// Or use ORM
const user = await User.findOne({ where: { email } });
```

### 3. Performance Review

**Analyze**:
- Algorithm efficiency
- Database query patterns
- Memory usage
- Caching opportunities
- Async/await usage

**Example Feedback**:
```python
# Issue: N+1 query problem
def get_user_orders(user_ids):
    users = User.query.filter(User.id.in_(user_ids)).all()
    for user in users:
        orders = user.orders  # Separate query for each user!

# Fix: Eager loading
def get_user_orders(user_ids):
    users = User.query\
        .options(joinedload(User.orders))\
        .filter(User.id.in_(user_ids))\
        .all()
```

### 4. Testing Assessment

**Evaluate**:
- Test coverage
- Test quality
- Edge case handling
- Integration tests
- Mock usage

**Example Feedback**:
```typescript
// Current: Incomplete testing
describe('calculateDiscount', () => {
  it('applies discount', () => {
    expect(calculateDiscount(100, 0.1)).toBe(90);
  });
});

// Suggested: Comprehensive tests
describe('calculateDiscount', () => {
  it('applies valid discount percentage', () => {
    expect(calculateDiscount(100, 0.1)).toBe(90);
  });

  it('handles zero discount', () => {
    expect(calculateDiscount(100, 0)).toBe(100);
  });

  it('throws error for negative discount', () => {
    expect(() => calculateDiscount(100, -0.1)).toThrow();
  });

  it('handles invalid input gracefully', () => {
    expect(() => calculateDiscount(null, 0.1)).toThrow(TypeError);
  });
});
```

## Improvement Patterns

### Extract Method
When: Function does multiple things
```java
// Before
public void processUser(User user) {
    // Validate
    if (user.name == null) throw new Exception();
    // Save
    database.save(user);
    // Send email
    email.send(user.email);
}

// After
public void processUser(User user) {
    validateUser(user);
    saveUser(user);
    notifyUser(user);
}
```

### Replace Conditional with Polymorphism
When: Complex if/else or switch statements
```typescript
// Before
function getPrice(product: Product): number {
  if (product.type === 'book') {
    return product.basePrice * 0.9;
  } else if (product.type === 'electronics') {
    return product.basePrice * 1.1;
  }
  return product.basePrice;
}

// After
interface Product {
  getPrice(): number;
}

class Book implements Product {
  getPrice(): number {
    return this.basePrice * 0.9;
  }
}

class Electronics implements Product {
  getPrice(): number {
    return this.basePrice * 1.1;
  }
}
```

### Introduce Parameter Object
When: Functions have many parameters
```go
// Before
func CreateUser(name string, email string, phone string, addr string, city string) {}

// After
type UserInfo struct {
    Name    string
    Email   string
    Phone   string
    Address string
    City    string
}

func CreateUser(info UserInfo) {}
```

## Best Practices Guidance

### Naming Conventions
- **Variables**: descriptive, camelCase/snake_case
- **Functions**: verb + noun (getUserById, calculateTotal)
- **Classes**: noun, PascalCase (UserManager, OrderService)
- **Constants**: UPPER_SNAKE_CASE (MAX_RETRY_COUNT)
- **Booleans**: is/has/can prefix (isValid, hasPermission)

### Error Handling
```javascript
// Good: Specific error handling
try {
  await processPayment(order);
} catch (error) {
  if (error instanceof PaymentError) {
    logger.error('Payment failed', { orderId: order.id, error });
    await notifyPaymentFailure(order);
  } else if (error instanceof NetworkError) {
    await queueForRetry(order);
  } else {
    throw error; // Re-throw unexpected errors
  }
}
```

### Documentation
```python
def calculate_shipping_cost(
    weight: float,
    distance: float,
    priority: str = 'standard'
) -> float:
    """
    Calculate shipping cost based on package weight and distance.

    Args:
        weight: Package weight in kilograms
        distance: Shipping distance in kilometers
        priority: Shipping priority ('standard', 'express', 'overnight')

    Returns:
        Shipping cost in dollars

    Raises:
        ValueError: If weight or distance is negative

    Example:
        >>> calculate_shipping_cost(2.5, 100, 'express')
        25.50
    """
    pass
```

## Actionable Feedback Format

Structure recommendations clearly:

```markdown
## Priority: HIGH
**Issue**: SQL injection vulnerability in user authentication
**Location**: auth.js:45
**Impact**: Security breach, data exposure
**Fix**:
```javascript
// Replace
const query = `SELECT * FROM users WHERE email = '${email}'`;
// With
const query = 'SELECT * FROM users WHERE email = ?';
db.query(query, [email]);
```
**Testing**: Add security test to verify parameterization

## Priority: MEDIUM
**Observation**: High cyclomatic complexity in validateOrder()
**Location**: order.js:123
**Impact**: Difficult to test and maintain
**Suggestion**: Extract validation rules into separate validator classes
**Benefit**: Better testability, easier to extend validation rules
```

## Learning Opportunities

Highlight educational insights:
- **Pattern Recognition**: "This code could benefit from the Strategy pattern"
- **Best Practices**: "Consider using dependency injection here"
- **Performance**: "Eager loading would eliminate the N+1 query issue"
- **Testing**: "Add property-based testing for edge cases"

## Methodology

This command follows these principles:
- **Constructive**: Focus on improvements, not criticism
- **Specific**: Provide exact line numbers and code examples
- **Actionable**: Give clear steps to implement suggestions
- **Educational**: Explain why changes improve code
- **Prioritized**: Rank issues by severity and impact
