# Regex Specialist

Master regular expressions with patterns, optimization, testing, and security for all programming languages.

## Core Competencies

- Pattern matching and validation
- Character classes and quantifiers
- Lookahead/lookbehind assertions
- Capture groups and backreferences
- Performance optimization
- Cross-language implementations
- ReDoS prevention

## Basic Syntax

```javascript
// Flags
const flags = {
  g: 'global - find all matches',
  i: 'case-insensitive',
  m: 'multiline - ^ and $ match line boundaries',
  s: 'dotall - . matches newlines',
  u: 'unicode - proper unicode handling'
};

// Character classes
const patterns = {
  digit: /\d/,              // [0-9]
  word: /\w/,               // [a-zA-Z0-9_]
  whitespace: /\s/,         // [ \t\n\r\f\v]
  anyChar: /./,             // Any except newline
  vowels: /[aeiou]/i,
  hexDigit: /[0-9a-fA-F]/
};

// Quantifiers
const quantifiers = {
  zeroOrMore: /a*/,         // a, aa, aaa, or empty
  oneOrMore: /a+/,          // a, aa, aaa (not empty)
  zeroOrOne: /a?/,          // a or empty
  exactly: /a{3}/,          // aaa (exactly 3)
  atLeast: /a{3,}/,         // aaa, aaaa, etc.
  range: /a{3,5}/           // aaa, aaaa, or aaaaa
};

// Greedy vs lazy
const greedy = /".+"/;      // Matches entire: "first" and "second"
const lazy = /".+?"/;       // Matches: "first" separately

// Anchors
const anchors = {
  startOfString: /^hello/,
  endOfString: /world$/,
  wordBoundary: /\bcat\b/   // Matches 'cat' but not 'catch'
};
```

## Common Patterns

```javascript
// Email validation
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emailRFC = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// URL validation
const url = /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/;

// Phone numbers (US)
const phone = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
const phoneFlexible = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

// Date formats
const dateISO = /^\d{4}-\d{2}-\d{2}$/;                          // YYYY-MM-DD
const dateUS = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;  // MM/DD/YYYY

// Password strength
const password = {
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasDigit: /\d/,
  hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
  strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
};

// IP addresses
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

// Credit cards
const creditCard = {
  visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
  mastercard: /^5[1-5][0-9]{14}$/,
  amex: /^3[47][0-9]{13}$/
};
```

## Advanced Features

```javascript
// Named capture groups
const datePattern = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const match = '2024-03-15'.match(datePattern);
console.log(match.groups);  // { year: '2024', month: '03', day: '15' }

// Lookahead/lookbehind
const hasUpperAndLower = /^(?=.*[a-z])(?=.*[A-Z]).+$/;  // Positive lookahead
const noDigits = /^(?!.*\d).+$/;                         // Negative lookahead
const afterDollar = /(?<=\$)\d+/;                        // Positive lookbehind
const notAfterDollar = /(?<!\$)\d+/;                     // Negative lookbehind

// Non-capturing groups
const urlPattern = /^(?:https?:\/\/)?(?:www\.)?([a-z0-9-]+)\.com$/i;

// Backreferences
const repeatedWord = /\b(\w+)\s+\1\b/;  // Matches "hello hello"
const htmlTag = /<(\w+)>(.*?)<\/\1>/;   // Matches <div>content</div>

// Alternation
const fileExt = /\.(jpg|jpeg|png|gif|webp)$/i;
```

## Optimization

```javascript
// BAD: Catastrophic backtracking
const bad = /^(a+)+$/;  // Hangs on: 'aaaaaaaaab'

// GOOD: Avoid nested quantifiers
const good = /^a+$/;

// BAD: Unnecessary capturing groups
const inefficient = /(\d{4})-(\d{2})-(\d{2})/;

// GOOD: Non-capturing when not needed
const efficient = /\d{4}-\d{2}-\d{2}/;

// BAD: Alternation with common prefix
const unoptimized = /hello world|hello there|hello everyone/;

// GOOD: Factor out common prefix
const optimized = /hello (?:world|there|everyone)/;

// Use character classes instead of alternation
const charClass = /[abc]/;    // Better than /a|b|c/

// Benchmark regex performance
function benchmarkRegex(pattern, text, iterations = 100000) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) pattern.test(text);
  return performance.now() - start;
}
```

## Security (ReDoS Prevention)

```javascript
// Vulnerable to ReDoS
const vulnerable = /^(a+)+$/;
const vulnerable2 = /(\w+\*)+/;

// Detect dangerous patterns
function isRegexSafe(pattern) {
  const dangerousPatterns = [
    /(\w+\*)+/,      // Nested quantifiers
    /(\w+)+/,        // Repeated groups
    /(\w*)*/ // Nested * quantifiers
  ];

  const patternStr = pattern.toString();
  for (const dangerous of dangerousPatterns) {
    if (dangerous.test(patternStr)) return false;
  }
  return true;
}

// Timeout wrapper
function safeRegexTest(pattern, text, timeoutMs = 1000) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Regex timeout')), timeoutMs);

    try {
      const result = pattern.test(text);
      clearTimeout(timeout);
      resolve(result);
    } catch (error) {
      clearTimeout(timeout);
      reject(error);
    }
  });
}

// Escape user input
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
```

## Cross-Language Examples

```python
# Python
import re

email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
email_regex = re.compile(email_pattern)

# Named groups
date_pattern = r'(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})'
match = re.match(date_pattern, '2024-03-15')
print(match.group('year'))  # '2024'

# Find all
text = 'Email: john@example.com or jane@example.com'
emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
```

```php
<?php
// PHP
$email_pattern = '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/';
preg_match($email_pattern, $email);

// Named groups
$pattern = '/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/';
preg_match($pattern, '2024-03-15', $matches);
echo $matches['year'];  // '2024'

// Replace
$censored = preg_replace('/\b\d{4}\b/', '****', 'My PIN is 1234');
?>
```

## Best Practices

1. **Performance**: Use anchors (^ and $) when possible
2. **Optimization**: Avoid nested quantifiers
3. **Clarity**: Use non-capturing groups (?:) when not capturing
4. **Security**: Validate patterns from user input
5. **Testing**: Test edge cases thoroughly
6. **Documentation**: Comment complex patterns
7. **Maintainability**: Break complex patterns into smaller parts
8. **Unicode**: Use unicode flag (u) for proper handling
9. **Caching**: Cache compiled regex patterns
10. **Alternatives**: Consider string methods for simple cases
