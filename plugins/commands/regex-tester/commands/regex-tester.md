# Regex Tester

A comprehensive guide to interactive regex testing, test string matching, capture group visualization, regex explanation, and debugging tools for building and validating regular expressions.

## Table of Contents

- [Introduction](#introduction)
- [Interactive Testing](#interactive-testing)
- [Test String Matching](#test-string-matching)
- [Capture Group Visualization](#capture-group-visualization)
- [Regex Explanation](#regex-explanation)
- [Performance Testing](#performance-testing)
- [Common Patterns Library](#common-patterns-library)
- [Best Practices](#best-practices)

## Introduction

A regex tester helps developers build, test, and debug regular expressions interactively, providing immediate feedback on pattern matches, capture groups, and potential issues.

### Why Use a Regex Tester

```javascript
const testerBenefits = {
  development: [
    'Instant feedback on pattern matching',
    'Visual representation of matches',
    'Quick iteration on pattern design',
    'Identify edge cases early'
  ],
  debugging: [
    'Understand why patterns fail',
    'Visualize capture groups',
    'Test against multiple inputs',
    'Detect performance issues'
  ],
  learning: [
    'Learn regex syntax interactively',
    'See explanations of pattern components',
    'Experiment safely',
    'Build pattern library'
  ]
};
```

## Interactive Testing

### Command-Line Regex Tester

```javascript
#!/usr/bin/env node

const readline = require('readline');

class InteractiveRegexTester {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: 'regex> '
    });

    this.pattern = null;
    this.flags = 'g';
    this.testStrings = [];
  }

  start() {
    console.log('Interactive Regex Tester');
    console.log('Commands:');
    console.log('  /pattern/flags  - Set regex pattern');
    console.log('  test <string>   - Test against string');
    console.log('  match <string>  - Show all matches');
    console.log('  explain         - Explain current pattern');
    console.log('  clear           - Clear test strings');
    console.log('  quit            - Exit');
    console.log('');

    this.rl.prompt();

    this.rl.on('line', (input) => {
      this.handleInput(input.trim());
      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log('\nGoodbye!');
      process.exit(0);
    });
  }

  handleInput(input) {
    if (!input) return;

    // Check for regex pattern
    const regexMatch = input.match(/^\/(.+)\/([gimsuvy]*)$/);
    if (regexMatch) {
      this.setPattern(regexMatch[1], regexMatch[2]);
      return;
    }

    // Parse command
    const [command, ...args] = input.split(' ');
    const argument = args.join(' ');

    switch (command.toLowerCase()) {
      case 'test':
        this.testString(argument);
        break;
      case 'match':
        this.showMatches(argument);
        break;
      case 'explain':
        this.explainPattern();
        break;
      case 'clear':
        this.testStrings = [];
        console.log('Test strings cleared');
        break;
      case 'quit':
      case 'exit':
        this.rl.close();
        break;
      default:
        console.log(`Unknown command: ${command}`);
    }
  }

  setPattern(pattern, flags = 'g') {
    try {
      this.pattern = new RegExp(pattern, flags);
      this.flags = flags;
      console.log(`Pattern set: /${pattern}/${flags}`);

      // Re-test existing strings
      if (this.testStrings.length > 0) {
        console.log('\nRe-testing existing strings:');
        this.testStrings.forEach(str => this.testString(str, false));
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }

  testString(testString, save = true) {
    if (!this.pattern) {
      console.log('No pattern set. Use /pattern/flags to set a pattern.');
      return;
    }

    if (save && !this.testStrings.includes(testString)) {
      this.testStrings.push(testString);
    }

    const matches = testString.match(this.pattern);

    if (matches) {
      console.log(`✓ Match found: ${matches.length} match(es)`);
      this.visualizeMatch(testString, matches);
    } else {
      console.log('✗ No match');
    }
  }

  showMatches(testString) {
    if (!this.pattern) {
      console.log('No pattern set. Use /pattern/flags to set a pattern.');
      return;
    }

    const regex = new RegExp(this.pattern.source, this.pattern.flags);
    let match;
    let matchCount = 0;

    console.log(`\nMatches in: "${testString}"\n`);

    while ((match = regex.exec(testString)) !== null) {
      matchCount++;
      console.log(`Match ${matchCount}:`);
      console.log(`  Full match: "${match[0]}"`);
      console.log(`  Position: ${match.index}-${regex.lastIndex - 1}`);

      if (match.length > 1) {
        console.log('  Capture groups:');
        for (let i = 1; i < match.length; i++) {
          console.log(`    Group ${i}: "${match[i]}"`);
        }
      }

      if (match.groups) {
        console.log('  Named groups:');
        Object.entries(match.groups).forEach(([name, value]) => {
          console.log(`    ${name}: "${value}"`);
        });
      }

      console.log('');

      // Prevent infinite loop for non-global patterns
      if (!regex.global) break;
    }

    if (matchCount === 0) {
      console.log('No matches found');
    } else {
      console.log(`Total matches: ${matchCount}`);
    }
  }

  visualizeMatch(text, matches) {
    // Simple visualization of where match occurs
    const match = matches[0];
    const index = text.indexOf(match);

    if (index !== -1) {
      const before = text.substring(0, index);
      const matched = text.substring(index, index + match.length);
      const after = text.substring(index + match.length);

      console.log(`  "${before}\x1b[32m${matched}\x1b[0m${after}"`);
    }
  }

  explainPattern() {
    if (!this.pattern) {
      console.log('No pattern set.');
      return;
    }

    console.log(`\nPattern: /${this.pattern.source}/${this.flags}`);
    console.log('\nFlags:');

    const flagExplanations = {
      g: 'global - find all matches',
      i: 'case-insensitive',
      m: 'multiline - ^ and $ match line boundaries',
      s: 'dotall - . matches newlines',
      u: 'unicode - proper unicode handling',
      y: 'sticky - matches from lastIndex only'
    };

    if (this.flags) {
      this.flags.split('').forEach(flag => {
        console.log(`  ${flag}: ${flagExplanations[flag]}`);
      });
    } else {
      console.log('  None');
    }

    console.log('\nPattern breakdown:');
    this.explainPatternComponents(this.pattern.source);
  }

  explainPatternComponents(pattern) {
    const explanations = {
      '^': 'Start of string/line',
      '$': 'End of string/line',
      '.': 'Any character (except newline)',
      '*': 'Zero or more times',
      '+': 'One or more times',
      '?': 'Zero or one time',
      '\\d': 'Any digit [0-9]',
      '\\D': 'Any non-digit',
      '\\w': 'Word character [a-zA-Z0-9_]',
      '\\W': 'Non-word character',
      '\\s': 'Whitespace',
      '\\S': 'Non-whitespace',
      '\\b': 'Word boundary',
      '\\B': 'Non-word boundary',
      '(?:': 'Non-capturing group',
      '(?=': 'Positive lookahead',
      '(?!': 'Negative lookahead',
      '(?<=': 'Positive lookbehind',
      '(?<!': 'Negative lookbehind'
    };

    // Simple explanation - in production use a proper parser
    Object.entries(explanations).forEach(([syntax, explanation]) => {
      if (pattern.includes(syntax)) {
        console.log(`  ${syntax.padEnd(10)} - ${explanation}`);
      }
    });
  }
}

// Start the interactive tester
if (require.main === module) {
  const tester = new InteractiveRegexTester();
  tester.start();
}

module.exports = InteractiveRegexTester;
```

### Web-Based Regex Tester

```javascript
// Express server for web-based regex tester
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static('public'));

app.post('/api/test', (req, res) => {
  const { pattern, flags, testString } = req.body;

  try {
    const regex = new RegExp(pattern, flags);
    const matches = [];
    let match;

    // Reset lastIndex for global flag
    regex.lastIndex = 0;

    while ((match = regex.exec(testString)) !== null) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1),
        namedGroups: match.groups || {}
      });

      // Prevent infinite loop
      if (!regex.global) break;
    }

    res.json({
      success: true,
      matches,
      matchCount: matches.length
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/explain', (req, res) => {
  const { pattern } = req.body;

  try {
    const explanation = explainRegex(pattern);
    res.json({
      success: true,
      explanation
    });
  } catch (error) {
    res.json({
      success: false,
      error: error.message
    });
  }
});

function explainRegex(pattern) {
  // Simplified explanation generator
  const components = [];

  // Check for anchors
  if (pattern.startsWith('^')) {
    components.push('Matches start of string');
  }
  if (pattern.endsWith('$')) {
    components.push('Matches end of string');
  }

  // Check for character classes
  if (pattern.includes('\\d')) {
    components.push('\\d matches any digit');
  }
  if (pattern.includes('\\w')) {
    components.push('\\w matches word characters');
  }
  if (pattern.includes('\\s')) {
    components.push('\\s matches whitespace');
  }

  // Check for quantifiers
  if (pattern.includes('*')) {
    components.push('* matches zero or more times');
  }
  if (pattern.includes('+')) {
    components.push('+ matches one or more times');
  }
  if (pattern.includes('?')) {
    components.push('? matches zero or one time');
  }

  // Check for groups
  if (pattern.includes('(') && !pattern.includes('(?:')) {
    components.push('() creates a capture group');
  }
  if (pattern.includes('(?:')) {
    components.push('(?:) creates a non-capturing group');
  }

  return components;
}

app.listen(3000, () => {
  console.log('Regex tester running on http://localhost:3000');
});
```

## Test String Matching

### Batch Testing Tool

```javascript
class RegexBatchTester {
  constructor(pattern, flags = 'g') {
    this.pattern = new RegExp(pattern, flags);
    this.results = [];
  }

  test(testStrings) {
    this.results = [];

    testStrings.forEach((testString, index) => {
      const matches = this.getMatches(testString);

      this.results.push({
        index,
        testString,
        matched: matches.length > 0,
        matchCount: matches.length,
        matches
      });
    });

    return this.results;
  }

  getMatches(testString) {
    const regex = new RegExp(this.pattern.source, this.pattern.flags);
    const matches = [];
    let match;

    while ((match = regex.exec(testString)) !== null) {
      matches.push({
        match: match[0],
        index: match.index,
        groups: match.slice(1),
        namedGroups: match.groups || {}
      });

      if (!regex.global) break;
    }

    return matches;
  }

  generateReport() {
    const totalTests = this.results.length;
    const passed = this.results.filter(r => r.matched).length;
    const failed = totalTests - passed;

    return {
      total: totalTests,
      passed,
      failed,
      passRate: ((passed / totalTests) * 100).toFixed(1) + '%',
      results: this.results
    };
  }

  exportMarkdown() {
    const report = this.generateReport();

    let markdown = `# Regex Test Report\n\n`;
    markdown += `**Pattern:** \`/${this.pattern.source}/${this.pattern.flags}\`\n\n`;
    markdown += `**Results:** ${report.passed}/${report.total} passed (${report.passRate})\n\n`;

    markdown += `## Test Cases\n\n`;

    this.results.forEach(result => {
      const status = result.matched ? '✓' : '✗';
      markdown += `### ${status} Test ${result.index + 1}\n\n`;
      markdown += `**Input:** \`${result.testString}\`\n\n`;

      if (result.matched) {
        markdown += `**Matches:** ${result.matchCount}\n\n`;

        result.matches.forEach((match, i) => {
          markdown += `- Match ${i + 1}: \`${match.match}\` at position ${match.index}\n`;

          if (match.groups.length > 0) {
            markdown += `  - Groups: ${match.groups.map((g, j) => `[${j + 1}] \`${g}\``).join(', ')}\n`;
          }
        });

        markdown += '\n';
      } else {
        markdown += `**Status:** No match\n\n`;
      }
    });

    return markdown;
  }

  exportJSON() {
    return JSON.stringify(this.generateReport(), null, 2);
  }
}

// Usage example
const tester = new RegexBatchTester('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$', 'i');

const testCases = [
  'user@example.com',       // valid
  'user.name@example.com',  // valid
  'user+tag@example.co.uk', // valid
  'invalid.email',          // invalid
  '@example.com',           // invalid
  'user@',                  // invalid
  'user@.com'               // invalid
];

tester.test(testCases);
console.log(tester.exportMarkdown());
```

### Test Case Generator

```javascript
class TestCaseGenerator {
  constructor() {
    this.generators = {
      email: this.generateEmails,
      phone: this.generatePhones,
      url: this.generateUrls,
      date: this.generateDates,
      custom: this.generateCustom
    };
  }

  generateEmails(count = 10) {
    const domains = ['example.com', 'test.com', 'mail.com'];
    const tlds = ['com', 'org', 'net', 'io', 'co.uk'];
    const testCases = [];

    // Valid cases
    for (let i = 0; i < count / 2; i++) {
      const user = `user${i}`;
      const domain = domains[Math.floor(Math.random() * domains.length)];
      testCases.push({
        value: `${user}@${domain}`,
        valid: true
      });
    }

    // Invalid cases
    testCases.push(
      { value: 'invalid.email', valid: false },
      { value: '@example.com', valid: false },
      { value: 'user@', valid: false },
      { value: 'user@.com', valid: false },
      { value: 'user..name@example.com', valid: false }
    );

    return testCases;
  }

  generatePhones(count = 10) {
    const testCases = [];

    // Valid US phone numbers
    for (let i = 0; i < count / 2; i++) {
      const areaCode = 200 + Math.floor(Math.random() * 799);
      const exchange = 200 + Math.floor(Math.random() * 799);
      const number = 1000 + Math.floor(Math.random() * 8999);

      testCases.push({
        value: `(${areaCode}) ${exchange}-${number}`,
        valid: true
      });
    }

    // Invalid cases
    testCases.push(
      { value: '123-456-7890', valid: true },
      { value: '1234567890', valid: true },
      { value: '123-456-789', valid: false },
      { value: 'abc-def-ghij', valid: false },
      { value: '(123) 456-78901', valid: false }
    );

    return testCases;
  }

  generateUrls(count = 10) {
    const protocols = ['http', 'https'];
    const domains = ['example.com', 'test.org', 'site.net'];
    const paths = ['/path', '/path/to/page', '/api/users'];
    const testCases = [];

    // Valid URLs
    for (let i = 0; i < count / 2; i++) {
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const path = paths[Math.floor(Math.random() * paths.length)];

      testCases.push({
        value: `${protocol}://${domain}${path}`,
        valid: true
      });
    }

    // Invalid cases
    testCases.push(
      { value: 'not-a-url', valid: false },
      { value: 'http://', valid: false },
      { value: '://example.com', valid: false },
      { value: 'ftp://example.com', valid: false }
    );

    return testCases;
  }

  generateDates(count = 10) {
    const testCases = [];

    // Valid dates (YYYY-MM-DD)
    for (let i = 0; i < count / 2; i++) {
      const year = 2020 + Math.floor(Math.random() * 5);
      const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
      const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');

      testCases.push({
        value: `${year}-${month}-${day}`,
        valid: true
      });
    }

    // Invalid cases
    testCases.push(
      { value: '2024-13-01', valid: false },
      { value: '2024-01-32', valid: false },
      { value: '24-01-01', valid: false },
      { value: '2024/01/01', valid: false },
      { value: 'not-a-date', valid: false }
    );

    return testCases;
  }

  generate(type, count = 10) {
    const generator = this.generators[type];

    if (!generator) {
      throw new Error(`Unknown test case type: ${type}`);
    }

    return generator.call(this, count);
  }
}

// Usage
const generator = new TestCaseGenerator();
const emailTests = generator.generate('email', 20);

console.log('Email test cases:');
emailTests.forEach(test => {
  console.log(`  ${test.valid ? '✓' : '✗'} ${test.value}`);
});
```

## Capture Group Visualization

### Group Visualizer

```javascript
class CaptureGroupVisualizer {
  constructor(pattern, flags = 'g') {
    this.pattern = new RegExp(pattern, flags);
  }

  visualize(testString) {
    const regex = new RegExp(this.pattern.source, this.pattern.flags);
    let match;
    const visualizations = [];

    while ((match = regex.exec(testString)) !== null) {
      visualizations.push(this.visualizeMatch(testString, match));

      if (!regex.global) break;
    }

    return visualizations;
  }

  visualizeMatch(text, match) {
    const visualization = {
      fullMatch: {
        text: match[0],
        start: match.index,
        end: match.index + match[0].length - 1
      },
      groups: [],
      namedGroups: {},
      highlighted: this.highlightMatch(text, match)
    };

    // Capture groups
    for (let i = 1; i < match.length; i++) {
      if (match[i] !== undefined) {
        const groupStart = text.indexOf(match[i], match.index);

        visualization.groups.push({
          index: i,
          text: match[i],
          start: groupStart,
          end: groupStart + match[i].length - 1
        });
      }
    }

    // Named groups
    if (match.groups) {
      visualization.namedGroups = match.groups;
    }

    return visualization;
  }

  highlightMatch(text, match) {
    const colors = [
      '\x1b[32m', // Green
      '\x1b[33m', // Yellow
      '\x1b[34m', // Blue
      '\x1b[35m', // Magenta
      '\x1b[36m'  // Cyan
    ];
    const reset = '\x1b[0m';

    let result = text;
    let offset = 0;

    // Highlight full match
    const fullStart = match.index + offset;
    const fullEnd = fullStart + match[0].length;

    result =
      result.slice(0, fullStart) +
      colors[0] +
      result.slice(fullStart, fullEnd) +
      reset +
      result.slice(fullEnd);

    return result;
  }

  printVisualization(testString) {
    const visualizations = this.visualize(testString);

    console.log(`\nInput: "${testString}"`);
    console.log(`Pattern: /${this.pattern.source}/${this.pattern.flags}\n`);

    visualizations.forEach((viz, index) => {
      console.log(`Match ${index + 1}:`);
      console.log(`  Full match: "${viz.fullMatch.text}" [${viz.fullMatch.start}-${viz.fullMatch.end}]`);

      if (viz.groups.length > 0) {
        console.log('  Capture groups:');
        viz.groups.forEach(group => {
          console.log(`    Group ${group.index}: "${group.text}" [${group.start}-${group.end}]`);
        });
      }

      if (Object.keys(viz.namedGroups).length > 0) {
        console.log('  Named groups:');
        Object.entries(viz.namedGroups).forEach(([name, value]) => {
          console.log(`    ${name}: "${value}"`);
        });
      }

      console.log(`  Highlighted: ${viz.highlighted}\n`);
    });
  }

  generateASCIIDiagram(testString) {
    const visualizations = this.visualize(testString);

    visualizations.forEach((viz, matchIndex) => {
      console.log(`\nMatch ${matchIndex + 1}:`);
      console.log(testString);

      // Draw lines for full match
      const fullLine = ' '.repeat(viz.fullMatch.start) +
                      '^'.repeat(viz.fullMatch.text.length);
      console.log(fullLine + ' Full match');

      // Draw lines for groups
      viz.groups.forEach(group => {
        const groupLine = ' '.repeat(group.start) +
                         '~'.repeat(group.text.length);
        console.log(groupLine + ` Group ${group.index}`);
      });
    });
  }
}

// Usage
const visualizer = new CaptureGroupVisualizer('(\\d{4})-(\\d{2})-(\\d{2})');
visualizer.printVisualization('Date: 2024-03-15 and 2024-12-31');
visualizer.generateASCIIDiagram('Date: 2024-03-15 and 2024-12-31');

// With named groups
const namedVisualizer = new CaptureGroupVisualizer(
  '(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})'
);
namedVisualizer.printVisualization('2024-03-15');
```

## Regex Explanation

### Pattern Explainer

```javascript
class RegexExplainer {
  constructor(pattern) {
    this.pattern = pattern;
    this.explanations = this.buildExplanations();
  }

  buildExplanations() {
    return {
      // Anchors
      '^': { type: 'anchor', desc: 'Start of string/line' },
      '$': { type: 'anchor', desc: 'End of string/line' },
      '\\b': { type: 'anchor', desc: 'Word boundary' },
      '\\B': { type: 'anchor', desc: 'Non-word boundary' },

      // Character classes
      '.': { type: 'class', desc: 'Any character (except newline)' },
      '\\d': { type: 'class', desc: 'Digit [0-9]' },
      '\\D': { type: 'class', desc: 'Non-digit' },
      '\\w': { type: 'class', desc: 'Word character [a-zA-Z0-9_]' },
      '\\W': { type: 'class', desc: 'Non-word character' },
      '\\s': { type: 'class', desc: 'Whitespace [ \\t\\n\\r\\f\\v]' },
      '\\S': { type: 'class', desc: 'Non-whitespace' },

      // Quantifiers
      '*': { type: 'quantifier', desc: 'Zero or more times (greedy)' },
      '+': { type: 'quantifier', desc: 'One or more times (greedy)' },
      '?': { type: 'quantifier', desc: 'Zero or one time (optional)' },
      '*?': { type: 'quantifier', desc: 'Zero or more times (lazy)' },
      '+?': { type: 'quantifier', desc: 'One or more times (lazy)' },
      '??': { type: 'quantifier', desc: 'Zero or one time (lazy)' },

      // Groups
      '(': { type: 'group', desc: 'Start capture group' },
      ')': { type: 'group', desc: 'End capture group' },
      '(?:': { type: 'group', desc: 'Start non-capturing group' },
      '(?<': { type: 'group', desc: 'Start named capture group' },

      // Lookaround
      '(?=': { type: 'lookaround', desc: 'Positive lookahead' },
      '(?!': { type: 'lookaround', desc: 'Negative lookahead' },
      '(?<=': { type: 'lookaround', desc: 'Positive lookbehind' },
      '(?<!': { type: 'lookaround', desc: 'Negative lookbehind' },

      // Alternation
      '|': { type: 'alternation', desc: 'OR operator' }
    };
  }

  explain() {
    const components = [];
    let i = 0;

    while (i < this.pattern.length) {
      const found = this.findComponent(i);

      if (found) {
        components.push(found);
        i += found.length;
      } else {
        components.push({
          type: 'literal',
          token: this.pattern[i],
          desc: `Literal character '${this.pattern[i]}'`,
          length: 1
        });
        i++;
      }
    }

    return components;
  }

  findComponent(startIndex) {
    // Try to match multi-character tokens first
    for (let len = 4; len >= 1; len--) {
      const token = this.pattern.substr(startIndex, len);
      const explanation = this.explanations[token];

      if (explanation) {
        return {
          type: explanation.type,
          token,
          desc: explanation.desc,
          length: len
        };
      }
    }

    // Check for quantifiers with ranges
    const rangeMatch = this.pattern.substr(startIndex).match(/^{(\d+)(,(\d+)?)?}/);
    if (rangeMatch) {
      const min = rangeMatch[1];
      const max = rangeMatch[3];

      return {
        type: 'quantifier',
        token: rangeMatch[0],
        desc: max ? `Between ${min} and ${max} times` :
              rangeMatch[2] ? `${min} or more times` :
              `Exactly ${min} times`,
        length: rangeMatch[0].length
      };
    }

    // Check for character class
    if (this.pattern[startIndex] === '[') {
      const endIndex = this.pattern.indexOf(']', startIndex);
      if (endIndex !== -1) {
        const classContent = this.pattern.substring(startIndex + 1, endIndex);
        const token = this.pattern.substring(startIndex, endIndex + 1);

        return {
          type: 'class',
          token,
          desc: `Character class: any of [${classContent}]`,
          length: token.length
        };
      }
    }

    return null;
  }

  printExplanation() {
    const components = this.explain();

    console.log(`Pattern: /${this.pattern}/\n`);
    console.log('Explanation:\n');

    components.forEach((comp, index) => {
      console.log(`${index + 1}. ${comp.token.padEnd(10)} - ${comp.desc}`);
    });
  }

  generateHTML() {
    const components = this.explain();

    let html = '<div class="regex-explanation">';
    html += `<div class="pattern">Pattern: <code>/${this.pattern}/</code></div>`;
    html += '<div class="components">';

    components.forEach(comp => {
      html += `
        <div class="component ${comp.type}">
          <span class="token">${this.escapeHTML(comp.token)}</span>
          <span class="description">${comp.desc}</span>
        </div>
      `;
    });

    html += '</div></div>';
    return html;
  }

  escapeHTML(str) {
    return str.replace(/[&<>"']/g, char => {
      const escapeChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return escapeChars[char];
    });
  }
}

// Usage
const explainer = new RegexExplainer('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
explainer.printExplanation();
```

## Performance Testing

### Performance Analyzer

```javascript
class RegexPerformanceAnalyzer {
  constructor(pattern, flags = 'g') {
    this.pattern = new RegExp(pattern, flags);
  }

  benchmark(testString, iterations = 10000) {
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      const regex = new RegExp(this.pattern.source, this.pattern.flags);
      testString.match(regex);
    }

    const end = performance.now();
    const totalTime = end - start;
    const avgTime = totalTime / iterations;

    return {
      totalTime: totalTime.toFixed(2),
      avgTime: avgTime.toFixed(4),
      iterations,
      ops: (iterations / (totalTime / 1000)).toFixed(0)
    };
  }

  detectBacktracking(testString) {
    const start = Date.now();
    const timeout = 1000; // 1 second timeout

    try {
      const result = this.testWithTimeout(testString, timeout);

      return {
        catastrophic: false,
        executionTime: Date.now() - start,
        result
      };
    } catch (error) {
      return {
        catastrophic: true,
        executionTime: timeout,
        error: 'Execution timed out - possible catastrophic backtracking'
      };
    }
  }

  testWithTimeout(testString, timeout) {
    const regex = new RegExp(this.pattern.source, this.pattern.flags);
    const start = Date.now();

    let match;
    while ((match = regex.exec(testString)) !== null) {
      if (Date.now() - start > timeout) {
        throw new Error('Timeout');
      }

      if (!regex.global) break;
    }

    return true;
  }

  comparePatterns(alternatives, testString) {
    const results = alternatives.map(pattern => {
      const analyzer = new RegexPerformanceAnalyzer(pattern);
      const benchmark = analyzer.benchmark(testString);

      return {
        pattern,
        ...benchmark
      };
    });

    // Sort by average time
    results.sort((a, b) => parseFloat(a.avgTime) - parseFloat(b.avgTime));

    return results;
  }

  generateReport(testString, iterations = 10000) {
    const benchmark = this.benchmark(testString, iterations);
    const backtracking = this.detectBacktracking(testString);

    console.log('=== Performance Report ===\n');
    console.log(`Pattern: /${this.pattern.source}/${this.pattern.flags}`);
    console.log(`Test string length: ${testString.length} characters\n`);

    console.log('Benchmark:');
    console.log(`  Iterations: ${benchmark.iterations}`);
    console.log(`  Total time: ${benchmark.totalTime}ms`);
    console.log(`  Average time: ${benchmark.avgTime}ms`);
    console.log(`  Operations/sec: ${benchmark.ops}\n`);

    console.log('Backtracking analysis:');
    if (backtracking.catastrophic) {
      console.log(`  ⚠️  ${backtracking.error}`);
    } else {
      console.log(`  ✓ No catastrophic backtracking detected`);
      console.log(`  Execution time: ${backtracking.executionTime}ms`);
    }

    return { benchmark, backtracking };
  }
}

// Usage
const analyzer = new RegexPerformanceAnalyzer('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', 'i');
analyzer.generateReport('user@example.com', 10000);

// Compare alternative patterns
const alternatives = [
  '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
  '^[\\w._%+-]+@[\\w.-]+\\.[a-z]{2,}$',
  '^.+@.+\\..+$'
];

const comparison = analyzer.comparePatterns(alternatives, 'user@example.com');
console.log('\nPattern Comparison:');
comparison.forEach((result, index) => {
  console.log(`${index + 1}. ${result.avgTime}ms - /${result.pattern}/`);
});
```

## Common Patterns Library

```javascript
const commonPatterns = {
  email: {
    simple: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    standard: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    rfc5322: /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i
  },

  url: {
    simple: /^https?:\/\/.+/,
    standard: /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    withProtocol: /^(?:http|https):\/\/[\w\-]+(\.[\w\-]+)+[/#?]?.*$/
  },

  phone: {
    us: /^\+?1?\s*\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/,
    international: /^\+?[\d\s-()]+$/,
    formatted: /^\(\d{3}\)\s\d{3}-\d{4}$/
  },

  date: {
    iso: /^\d{4}-\d{2}-\d{2}$/,
    us: /^\d{2}\/\d{2}\/\d{4}$/,
    european: /^\d{2}\.\d{2}\.\d{4}$/
  },

  creditCard: {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard: /^5[1-5][0-9]{14}$/,
    amex: /^3[47][0-9]{13}$/,
    any: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})$/
  },

  password: {
    minimum: /^.{8,}$/,
    strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    veryStrong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])(?=.*[^A-Za-z\d@$!%*?&]).{12,}$/
  },

  ipAddress: {
    ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    ipv6: /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4})$/
  }
};

// Export patterns
module.exports = { commonPatterns };
```

## Best Practices

```javascript
const regexTestingBestPractices = {
  testing: [
    'Test with multiple valid inputs',
    'Test with edge cases',
    'Test with invalid inputs',
    'Test with empty strings',
    'Test with very long strings',
    'Test with special characters'
  ],

  development: [
    'Start simple, add complexity gradually',
    'Use online regex testers for quick feedback',
    'Comment complex regex patterns',
    'Break complex patterns into smaller parts',
    'Use named capture groups for clarity',
    'Document expected input format'
  ],

  performance: [
    'Avoid nested quantifiers',
    'Use non-capturing groups when possible',
    'Be specific with character classes',
    'Anchor patterns when appropriate',
    'Test for catastrophic backtracking',
    'Benchmark critical patterns'
  ],

  maintenance: [
    'Keep test cases in version control',
    'Document regex purpose and examples',
    'Maintain library of common patterns',
    'Review and update patterns regularly',
    'Share patterns across team',
    'Use constants for reusable patterns'
  ]
};
```

This comprehensive regex tester guide provides interactive tools, visualization capabilities, and testing utilities for building and validating regular expressions effectively.
