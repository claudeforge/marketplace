---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: Refactor code to improve maintainability, performance, and scalability through systematic analysis and incremental improvements
---

# Code Refactoring Command

Refactor existing code to improve quality, maintainability, and performance while preserving functionality.

## Usage

```bash
/refractor <file_or_directory>
```

**Examples:**
```bash
/refractor src/components/UserManager.js
/refractor src/services/
/refractor app/models/payment_processor.py
```

## What This Command Does

This command analyzes code and performs systematic refactoring to:

1. **Improve Code Structure**
   - Extract complex functions into smaller, focused units
   - Apply SOLID principles for better maintainability
   - Remove code duplication (DRY principle)
   - Improve naming for clarity and self-documentation

2. **Enhance Performance**
   - Optimize algorithms and data structures
   - Remove performance bottlenecks
   - Implement efficient caching strategies
   - Improve database queries (eliminate N+1 problems)

3. **Increase Maintainability**
   - Add type annotations/hints
   - Improve error handling
   - Update documentation
   - Add comprehensive tests

## Refactoring Workflow

### Step 1: Analysis
First, analyze the target code:
- Measure code complexity (cyclomatic complexity)
- Identify code smells and anti-patterns
- Check for security vulnerabilities
- Assess test coverage
- Profile performance bottlenecks

### Step 2: Prioritization
Rank refactoring opportunities by:
- Business impact (user-facing vs. internal)
- Technical risk (complexity of change)
- Implementation effort (time required)
- Test coverage (safety net strength)

### Step 3: Implementation
Apply refactoring techniques incrementally:

**Extract Method**: Break down complex functions
```javascript
// Before
function processOrder(order) {
  // 50 lines of mixed responsibilities
}

// After
function processOrder(order) {
  validateOrder(order);
  calculateTotal(order);
  applyDiscounts(order);
  processPayment(order);
  sendConfirmation(order);
}
```

**Remove Duplication**: Apply DRY principle
```python
# Before
def calculate_price_with_tax_us(price):
    return price * 1.08

def calculate_price_with_tax_uk(price):
    return price * 1.20

# After
def calculate_price_with_tax(price, tax_rate):
    return price * (1 + tax_rate)
```

**Improve Naming**: Use descriptive names
```typescript
// Before
function calc(a: number, b: number): number {
  return a * b * 0.15;
}

// After
function calculateCommissionAmount(
  salesPrice: number,
  quantity: number
): number {
  const COMMISSION_RATE = 0.15;
  return salesPrice * quantity * COMMISSION_RATE;
}
```

### Step 4: Testing
Validate refactoring:
- Run existing test suite (must pass)
- Add new tests for refactored code
- Perform performance benchmarking
- Check for regressions

### Step 5: Documentation
Update relevant documentation:
- Inline code comments for complex logic
- Function/method documentation
- Architectural decision records (ADRs)
- Update README if public API changed

## Common Refactoring Patterns

### 1. Replace Conditional with Polymorphism
```python
# Before
def get_speed(vehicle_type):
    if vehicle_type == "car":
        return 100
    elif vehicle_type == "bike":
        return 50
    elif vehicle_type == "plane":
        return 900

# After
class Vehicle:
    def get_speed(self):
        raise NotImplementedError

class Car(Vehicle):
    def get_speed(self):
        return 100

class Bike(Vehicle):
    def get_speed(self):
        return 50
```

### 2. Introduce Parameter Object
```java
// Before
public void createUser(String name, String email, String phone, String address, String city) {
  // ...
}

// After
public void createUser(UserDetails details) {
  // ...
}
```

### 3. Replace Magic Numbers with Constants
```javascript
// Before
if (user.age > 18 && user.accountBalance > 1000) {
  approveCredit();
}

// After
const MINIMUM_AGE = 18;
const MINIMUM_BALANCE = 1000;

if (user.age > MINIMUM_AGE && user.accountBalance > MINIMUM_BALANCE) {
  approveCredit();
}
```

## Performance Optimization Techniques

### Algorithm Optimization
- Replace O(n²) algorithms with O(n log n) or O(n) alternatives
- Use appropriate data structures (HashMap vs. Array)
- Implement caching for expensive computations
- Use lazy loading for large datasets

### Database Optimization
- Add indexes to frequently queried columns
- Use batch operations instead of individual queries
- Implement connection pooling
- Optimize JOIN operations and eliminate N+1 queries

### Async Patterns
- Use async/await for I/O operations
- Implement parallel processing where applicable
- Add timeout and cancellation support
- Use streaming for large data processing

## Safety Guidelines

1. **Always maintain tests**: Refactoring should never reduce test coverage
2. **Small, incremental changes**: Make one change at a time
3. **Commit frequently**: Each successful refactoring should be committed
4. **Preserve functionality**: Behavior must remain unchanged
5. **Use feature flags**: For risky changes, hide behind feature toggles

## Quality Metrics

Track these metrics before and after refactoring:
- **Cyclomatic Complexity**: Target <10 per function
- **Code Duplication**: Target <3%
- **Test Coverage**: Target >80%
- **Performance**: Track response times and resource usage
- **Maintainability Index**: Use code analysis tools

## Methodology

This command follows industry best practices:
- **Test-Driven Refactoring**: Tests written/validated before changes
- **Continuous Integration**: Automated validation on each change
- **Code Review**: All refactoring reviewed by peers
- **Incremental Approach**: Small changes over risky rewrites
- **Performance Monitoring**: Measure impact of changes