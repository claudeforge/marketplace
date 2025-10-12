---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge console statement remover with selective preservation, ESLint rules, git hooks, and production-ready code cleanup.
---

# ClaudeForge Console Cleaner

ClaudeForge intelligent console statement management system that removes debugging console.log statements before production deployment while preserving intentional logging, integrates with ESLint rules, and implements pre-commit hooks for automated code cleanup.

## Purpose

Transform console statement management from manual cleanup to intelligent automation that removes debug logs, preserves intentional logging, enforces logging standards, and ensures production code is clean and performant without unwanted console output.

## Features

- **Smart Detection**: Identify debug vs intentional console statements
- **Selective Removal**: Remove console.log while preserving console.error/warn
- **Comment Preservation**: Keep console statements marked with special comments
- **ESLint Integration**: Enforce console usage rules with linting
- **Git Hooks**: Automatically clean console statements before commits
- **Batch Processing**: Clean entire directories or specific files
- **Safe Mode**: Preview changes before applying
- **Rollback Support**: Restore removed console statements if needed

## Usage

```bash
/console-cleaner [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current directory)

### Cleaning Actions

**Remove All Console Statements:**
```bash
/console-cleaner remove --path=src/ --exclude=console.error,console.warn
```
Removes console statements except:
- console.error for error logging
- console.warn for warnings
- Statements with @keep-console comment
- Statements in development-only code blocks
- Logger service calls
- Third-party library console usage
- Configuration-based preservation
- Test file console statements

**Preview Changes:**
```bash
/console-cleaner preview --file=app.js --show-context
```
Shows what will be removed:
- Line numbers of console statements
- Surrounding code context
- Reason for removal or preservation
- Impact assessment
- File change statistics
- Backup file creation
- Diff view of changes
- Confirmation prompt

**Replace with Logger:**
```bash
/console-cleaner replace --target=logger --path=src/
```
Replaces console with proper logger:
- console.log → logger.info
- console.error → logger.error
- console.warn → logger.warn
- console.debug → logger.debug
- Custom logger methods
- Winston/Pino/Bunyan support
- Structured logging format
- Log level configuration

**Setup Git Hook:**
```bash
/console-cleaner setup-hook --type=pre-commit --strict
```
Installs pre-commit hook that:
- Scans staged files for console statements
- Blocks commit if console.log found
- Allows console.error/warn
- Provides removal suggestions
- Auto-fix option
- Bypass with --no-verify
- Team-wide enforcement
- CI/CD integration

## Code Examples

### Console Cleaner (TypeScript)

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

interface ConsoleStatement {
  type: string;  // log, error, warn, debug, etc.
  location: {
    file: string;
    line: number;
    column: number;
  };
  code: string;
  shouldKeep: boolean;
  reason: string;
}

interface CleanerOptions {
  preserveTypes: string[];  // e.g., ['error', 'warn']
  respectComments: boolean;
  replaceWithLogger: boolean;
  loggerName: string;
  dryRun: boolean;
}

class ConsoleCleaner {
  private options: CleanerOptions;
  private statements: ConsoleStatement[] = [];

  constructor(options?: Partial<CleanerOptions>) {
    this.options = {
      preserveTypes: ['error', 'warn'],
      respectComments: true,
      replaceWithLogger: false,
      loggerName: 'logger',
      dryRun: false,
      ...options
    };
  }

  cleanFile(filePath: string): { removed: number; preserved: number } {
    const code = fs.readFileSync(filePath, 'utf-8');
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    let removedCount = 0;
    let preservedCount = 0;

    // Find and process console statements
    traverse(ast, {
      CallExpression: (path) => {
        if (this.isConsoleStatement(path.node)) {
          const consoleType = this.getConsoleType(path.node);
          const shouldKeep = this.shouldKeepStatement(path, consoleType);

          const statement: ConsoleStatement = {
            type: consoleType,
            location: {
              file: filePath,
              line: path.node.loc?.start.line || 0,
              column: path.node.loc?.start.column || 0
            },
            code: generate(path.node).code,
            shouldKeep,
            reason: this.getKeepReason(path, consoleType, shouldKeep)
          };

          this.statements.push(statement);

          if (shouldKeep) {
            preservedCount++;
          } else {
            if (!this.options.dryRun) {
              if (this.options.replaceWithLogger) {
                this.replaceWithLogger(path, consoleType);
              } else {
                this.removeStatement(path);
              }
            }
            removedCount++;
          }
        }
      }
    });

    // Save modified code if not dry run
    if (!this.options.dryRun && removedCount > 0) {
      const output = generate(ast, {}, code);
      fs.writeFileSync(filePath, output.code);
    }

    return { removed: removedCount, preserved: preservedCount };
  }

  private isConsoleStatement(node: any): boolean {
    return (
      t.isMemberExpression(node.callee) &&
      t.isIdentifier(node.callee.object) &&
      node.callee.object.name === 'console'
    );
  }

  private getConsoleType(node: any): string {
    if (t.isMemberExpression(node.callee) && t.isIdentifier(node.callee.property)) {
      return node.callee.property.name;
    }
    return 'log';
  }

  private shouldKeepStatement(path: any, consoleType: string): boolean {
    // Check if type is in preserve list
    if (this.options.preserveTypes.includes(consoleType)) {
      return true;
    }

    // Check for @keep-console comment
    if (this.options.respectComments && this.hasKeepComment(path)) {
      return true;
    }

    // Check if in development-only block
    if (this.isInDevBlock(path)) {
      return true;
    }

    return false;
  }

  private hasKeepComment(path: any): boolean {
    const comments = path.node.leadingComments || [];
    return comments.some((comment: any) =>
      comment.value.includes('@keep-console') ||
      comment.value.includes('eslint-disable-next-line no-console')
    );
  }

  private isInDevBlock(path: any): boolean {
    let parent = path.parentPath;

    while (parent) {
      // Check if inside if (process.env.NODE_ENV === 'development')
      if (t.isIfStatement(parent.node)) {
        const test = parent.node.test;
        if (this.isDevEnvironmentCheck(test)) {
          return true;
        }
      }

      parent = parent.parentPath;
    }

    return false;
  }

  private isDevEnvironmentCheck(node: any): boolean {
    // Check for: process.env.NODE_ENV === 'development'
    if (t.isBinaryExpression(node, { operator: '===' })) {
      const left = node.left;
      const right = node.right;

      const isNodeEnvCheck = t.isMemberExpression(left) &&
        t.isMemberExpression(left.object) &&
        t.isIdentifier(left.object.object, { name: 'process' }) &&
        t.isIdentifier(left.object.property, { name: 'env' }) &&
        t.isIdentifier(left.property, { name: 'NODE_ENV' });

      const isDevelopmentValue = t.isStringLiteral(right, { value: 'development' });

      return isNodeEnvCheck && isDevelopmentValue;
    }

    return false;
  }

  private replaceWithLogger(path: any, consoleType: string): void {
    const loggerMethod = this.mapConsoleToLogger(consoleType);

    // Create logger.method(...) call
    const loggerCall = t.callExpression(
      t.memberExpression(
        t.identifier(this.options.loggerName),
        t.identifier(loggerMethod)
      ),
      path.node.arguments
    );

    path.replaceWith(loggerCall);
  }

  private mapConsoleToLogger(consoleType: string): string {
    const mapping: Record<string, string> = {
      log: 'info',
      error: 'error',
      warn: 'warn',
      debug: 'debug',
      info: 'info',
      trace: 'trace'
    };

    return mapping[consoleType] || 'info';
  }

  private removeStatement(path: any): void {
    // If statement is the only thing in an expression statement, remove the whole statement
    if (t.isExpressionStatement(path.parent)) {
      path.parentPath.remove();
    } else {
      // Otherwise just remove the call expression
      path.remove();
    }
  }

  private getKeepReason(path: any, consoleType: string, shouldKeep: boolean): string {
    if (!shouldKeep) {
      return `Debug console.${consoleType} - should be removed`;
    }

    if (this.options.preserveTypes.includes(consoleType)) {
      return `console.${consoleType} preserved (in allow list)`;
    }

    if (this.hasKeepComment(path)) {
      return 'Has @keep-console comment';
    }

    if (this.isInDevBlock(path)) {
      return 'Inside development-only block';
    }

    return 'Preserved for unknown reason';
  }

  cleanDirectory(dirPath: string, recursive: boolean = true): void {
    const pattern = recursive ? '**/*.{js,ts,jsx,tsx}' : '*.{js,ts,jsx,tsx}';
    const files = this.findFiles(dirPath, pattern);

    console.log(`🧹 Cleaning console statements in ${files.length} files...\n`);

    let totalRemoved = 0;
    let totalPreserved = 0;

    for (const file of files) {
      const { removed, preserved } = this.cleanFile(file);

      if (removed > 0 || preserved > 0) {
        console.log(`${file}:`);
        console.log(`  ❌ Removed: ${removed}`);
        console.log(`  ✅ Preserved: ${preserved}`);
      }

      totalRemoved += removed;
      totalPreserved += preserved;
    }

    console.log(`\n📊 Summary:`);
    console.log(`  Total removed: ${totalRemoved}`);
    console.log(`  Total preserved: ${totalPreserved}`);
  }

  private findFiles(dirPath: string, pattern: string): string[] {
    // Simple file finder - in production, use glob or similar
    const files: string[] = [];

    const traverse = (dir: string) => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          if (!item.startsWith('.') && item !== 'node_modules' && item !== 'dist') {
            traverse(fullPath);
          }
        } else if (item.match(/\.(js|ts|jsx|tsx)$/)) {
          files.push(fullPath);
        }
      }
    };

    traverse(dirPath);
    return files;
  }

  generateReport(): string {
    const report: string[] = [];

    report.push('# Console Cleaning Report\n');
    report.push(`Total console statements found: ${this.statements.length}\n`);

    // Group by file
    const byFile: Record<string, ConsoleStatement[]> = {};

    for (const statement of this.statements) {
      if (!byFile[statement.location.file]) {
        byFile[statement.location.file] = [];
      }
      byFile[statement.location.file].push(statement);
    }

    for (const [file, statements] of Object.entries(byFile)) {
      report.push(`\n## ${file}\n`);

      const removed = statements.filter(s => !s.shouldKeep);
      const preserved = statements.filter(s => s.shouldKeep);

      if (removed.length > 0) {
        report.push(`### Removed (${removed.length})\n`);
        for (const stmt of removed) {
          report.push(`- Line ${stmt.location.line}: \`${stmt.code}\``);
          report.push(`  - Reason: ${stmt.reason}\n`);
        }
      }

      if (preserved.length > 0) {
        report.push(`### Preserved (${preserved.length})\n`);
        for (const stmt of preserved) {
          report.push(`- Line ${stmt.location.line}: \`${stmt.code}\``);
          report.push(`  - Reason: ${stmt.reason}\n`);
        }
      }
    }

    return report.join('\n');
  }
}

// Usage examples

// Clean with defaults (remove console.log, keep error/warn)
const cleaner = new ConsoleCleaner();
cleaner.cleanFile('./src/app.ts');

// Dry run to preview changes
const previewCleaner = new ConsoleCleaner({ dryRun: true });
previewCleaner.cleanDirectory('./src');
const report = previewCleaner.generateReport();
console.log(report);

// Replace with logger
const loggerCleaner = new ConsoleCleaner({
  replaceWithLogger: true,
  loggerName: 'logger'
});
loggerCleaner.cleanDirectory('./src');

// Remove all console statements (strict mode)
const strictCleaner = new ConsoleCleaner({
  preserveTypes: [],
  respectComments: false
});
strictCleaner.cleanDirectory('./src');
```

### Git Pre-Commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "🔍 Checking for console statements..."

# Get list of staged JavaScript/TypeScript files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|jsx|ts|tsx)$')

if [ -z "$STAGED_FILES" ]; then
  echo "✅ No JavaScript/TypeScript files to check"
  exit 0
fi

# Check for console.log statements (excluding console.error and console.warn)
CONSOLE_LOGS=$(echo "$STAGED_FILES" | xargs grep -n "console\.log" 2>/dev/null)

if [ -n "$CONSOLE_LOGS" ]; then
  echo "❌ Found console.log statements:"
  echo "$CONSOLE_LOGS"
  echo ""
  echo "Please remove console.log statements or use @keep-console comment"
  echo "To bypass this check, use: git commit --no-verify"
  exit 1
fi

echo "✅ No console.log statements found"
exit 0
```

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // Disallow console statements
    'no-console': ['error', {
      allow: ['warn', 'error', 'info']
    }],

    // Or use custom rule for more control
    'no-console': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error)$/]",
        message: 'Unexpected console statement. Use logger instead.'
      }
    ]
  },

  // Environment-specific overrides
  overrides: [
    {
      files: ['*.test.js', '*.spec.js', '*.test.ts', '*.spec.ts'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
};
```

### Babel Plugin for Console Removal

```javascript
// babel-plugin-remove-console.js
module.exports = function({ types: t }) {
  return {
    name: 'remove-console',
    visitor: {
      CallExpression(path, state) {
        const { node } = path;

        // Check if it's a console call
        if (
          t.isMemberExpression(node.callee) &&
          t.isIdentifier(node.callee.object, { name: 'console' })
        ) {
          const method = node.callee.property.name;
          const allowedMethods = state.opts.allow || ['error', 'warn'];

          // Remove if not in allowed list
          if (!allowedMethods.includes(method)) {
            // Check for keep comment
            const comments = path.node.leadingComments || [];
            const hasKeepComment = comments.some(comment =>
              comment.value.includes('@keep-console')
            );

            if (!hasKeepComment) {
              if (t.isExpressionStatement(path.parent)) {
                path.parentPath.remove();
              } else {
                path.remove();
              }
            }
          }
        }
      }
    }
  };
};

// babel.config.js
module.exports = {
  plugins: [
    ['./babel-plugin-remove-console', {
      allow: ['error', 'warn', 'info']
    }]
  ]
};
```

## Best Practices

### Console Usage
- **Development**: Use console.log freely during development
- **Production**: Remove all console.log before deployment
- **Errors**: Keep console.error for critical errors
- **Warnings**: Keep console.warn for important warnings
- **Proper Logging**: Use logging libraries (Winston, Pino) for production

### Automation
- **Git Hooks**: Install pre-commit hooks to prevent console.log commits
- **CI/CD**: Add console checking to CI pipeline
- **ESLint**: Enforce console rules with linting
- **Build Process**: Remove console statements during production build
- **Code Review**: Make console removal part of review checklist

### Team Workflow
- **Documentation**: Document console usage policies
- **Training**: Educate team on proper logging practices
- **Exceptions**: Use @keep-console for intentional console usage
- **Logger Migration**: Gradually migrate to proper logging library
- **Monitoring**: Track console usage in codebase metrics

---

**ClaudeForge Console Cleaner** - Enterprise-grade console statement management with intelligent removal, ESLint integration, git hooks, and production-ready code cleanup for cleaner, more performant applications.
