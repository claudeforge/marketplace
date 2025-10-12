---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge unused code detector with dead code elimination, unused variables detection, unreachable code analysis, and coverage integration.
---

# ClaudeForge Unused Code Finder

ClaudeForge intelligent dead code detection system that identifies unused functions, variables, imports, and unreachable code blocks across your codebase, integrating with coverage tools to help maintain clean, efficient code and reduce bundle sizes.

## Purpose

Transform code maintenance from manual review to intelligent automation that detects dead code, finds unused exports, identifies unreachable code paths, and helps eliminate unnecessary code that bloats bundles and reduces maintainability.

## Features

- **Dead Code Detection**: Find unused functions, classes, and variables
- **Unused Exports**: Identify exported code that's never imported
- **Unreachable Code**: Detect code paths that can never execute
- **Coverage Integration**: Analyze test coverage to find untested code
- **Cross-File Analysis**: Track usage across multiple files and modules
- **Bundle Analysis**: Identify code increasing bundle size unnecessarily
- **Safe Removal**: Generate safe removal suggestions with impact analysis
- **Dependency Tracking**: Understand code dependencies before removal

## Usage

```bash
/unused-code-finder [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current directory)

### Detection Actions

**Find All Unused Code:**
```bash
/unused-code-finder scan --path=src/ --recursive --exclude=test
```
Performs comprehensive scan for:
- Unused functions and methods
- Unused variables and constants
- Unused class definitions
- Unused type definitions
- Unused imports and exports
- Unreachable code blocks
- Dead conditional branches
- Unused parameters

**Find Unused Exports:**
```bash
/unused-code-finder exports --entry=src/index.ts --follow-imports
```
Analyzes exports and finds:
- Exported functions never imported
- Unused named exports
- Unused default exports
- Re-exports that are never used
- Public API methods with no callers
- Orphaned utility functions
- Library code with no consumers
- Entry point analysis

**Detect Unreachable Code:**
```bash
/unused-code-finder unreachable --file=src/utils.ts
```
Identifies unreachable code including:
- Code after return statements
- Code after throw statements
- Impossible conditional branches
- Functions never called
- Dead switch cases
- Infinite loop consequences
- Early termination impacts
- Exception handling gaps

**Coverage-Based Analysis:**
```bash
/unused-code-finder coverage --report=coverage/lcov.info --threshold=80
```
Finds code with low/no coverage:
- Functions never executed in tests
- Branches never taken
- Lines never covered
- Integration with Istanbul/NYC
- Jest coverage analysis
- Code with 0% coverage
- Critical paths untested
- Edge cases not covered

## Code Examples

### Unused Code Finder (TypeScript)

```typescript
import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';
import { Project, SourceFile, Node, SyntaxKind } from 'ts-morph';

interface UnusedCodeItem {
  type: 'function' | 'variable' | 'class' | 'import' | 'export' | 'parameter';
  name: string;
  location: {
    file: string;
    line: number;
    column: number;
  };
  reason: string;
  canSafelyRemove: boolean;
  dependencies: string[];
}

interface ScanOptions {
  includePaths: string[];
  excludePaths: string[];
  checkExports: boolean;
  checkUnreachable: boolean;
  followImports: boolean;
}

class UnusedCodeFinder {
  private project: Project;
  private unusedItems: UnusedCodeItem[] = [];

  constructor(tsConfigPath?: string) {
    this.project = new Project({
      tsConfigFilePath: tsConfigPath || './tsconfig.json'
    });
  }

  scan(options: ScanOptions): UnusedCodeItem[] {
    this.unusedItems = [];

    // Add source files
    const sourceFiles = this.project.addSourceFilesAtPaths(options.includePaths);

    for (const sourceFile of sourceFiles) {
      // Skip excluded paths
      if (this.isExcluded(sourceFile.getFilePath(), options.excludePaths)) {
        continue;
      }

      console.log(`Scanning ${sourceFile.getFilePath()}...`);

      // Find unused variables
      this.findUnusedVariables(sourceFile);

      // Find unused functions
      this.findUnusedFunctions(sourceFile);

      // Find unused classes
      this.findUnusedClasses(sourceFile);

      // Find unused imports
      this.findUnusedImports(sourceFile);

      // Find unused exports if configured
      if (options.checkExports) {
        this.findUnusedExports(sourceFile, options.followImports);
      }

      // Find unreachable code
      if (options.checkUnreachable) {
        this.findUnreachableCode(sourceFile);
      }
    }

    return this.unusedItems;
  }

  private findUnusedVariables(sourceFile: SourceFile): void {
    const variableStatements = sourceFile.getVariableStatements();

    for (const statement of variableStatements) {
      const declarations = statement.getDeclarations();

      for (const declaration of declarations) {
        const name = declaration.getName();
        const references = declaration.findReferences();

        // Check if variable is used (more than just declaration)
        const usageCount = references.flatMap(ref => ref.getReferences()).length;

        if (usageCount <= 1) {  // Only the declaration itself
          this.addUnusedItem({
            type: 'variable',
            name,
            location: this.getLocation(declaration),
            reason: 'Variable is declared but never used',
            canSafelyRemove: true,
            dependencies: []
          });
        }
      }
    }
  }

  private findUnusedFunctions(sourceFile: SourceFile): void {
    const functions = sourceFile.getFunctions();

    for (const func of functions) {
      const name = func.getName();
      if (!name) continue;

      // Check if function is exported
      const isExported = func.isExported();

      // Find references to this function
      const references = func.findReferences();
      const usageCount = references.flatMap(ref => ref.getReferences()).length;

      // If not exported and only referenced once (declaration), it's unused
      if (!isExported && usageCount <= 1) {
        this.addUnusedItem({
          type: 'function',
          name,
          location: this.getLocation(func),
          reason: 'Function is defined but never called',
          canSafelyRemove: true,
          dependencies: this.getFunctionDependencies(func)
        });
      }

      // Check for unused parameters
      this.findUnusedParameters(func);
    }
  }

  private findUnusedParameters(func: any): void {
    const parameters = func.getParameters();

    for (const param of parameters) {
      const name = param.getName();

      // Skip rest parameters and destructured parameters
      if (name.startsWith('...') || name.includes('{') || name.includes('[')) {
        continue;
      }

      // Find references within function body
      const references = param.findReferences();
      const usageInBody = references.flatMap(ref => ref.getReferences())
        .filter(ref => {
          const refSourceFile = ref.getSourceFile();
          return refSourceFile === func.getSourceFile();
        });

      if (usageInBody.length <= 1) {  // Only the parameter declaration
        this.addUnusedItem({
          type: 'parameter',
          name,
          location: this.getLocation(param),
          reason: `Parameter '${name}' is never used in function body`,
          canSafelyRemove: false,  // Removing parameters can break signatures
          dependencies: []
        });
      }
    }
  }

  private findUnusedClasses(sourceFile: SourceFile): void {
    const classes = sourceFile.getClasses();

    for (const cls of classes) {
      const name = cls.getName();
      if (!name) continue;

      const isExported = cls.isExported();
      const references = cls.findReferences();
      const usageCount = references.flatMap(ref => ref.getReferences()).length;

      if (!isExported && usageCount <= 1) {
        this.addUnusedItem({
          type: 'class',
          name,
          location: this.getLocation(cls),
          reason: 'Class is defined but never instantiated or referenced',
          canSafelyRemove: true,
          dependencies: []
        });
      }
    }
  }

  private findUnusedImports(sourceFile: SourceFile): void {
    const imports = sourceFile.getImportDeclarations();

    for (const importDecl of imports) {
      const namedImports = importDecl.getNamedImports();

      for (const namedImport of namedImports) {
        const name = namedImport.getName();
        const references = namedImport.findReferences();
        const usageCount = references.flatMap(ref => ref.getReferences()).length;

        if (usageCount <= 1) {
          this.addUnusedItem({
            type: 'import',
            name,
            location: this.getLocation(namedImport),
            reason: `Import '${name}' is never used`,
            canSafelyRemove: true,
            dependencies: []
          });
        }
      }

      // Check default import
      const defaultImport = importDecl.getDefaultImport();
      if (defaultImport) {
        const references = defaultImport.findReferences();
        const usageCount = references.flatMap(ref => ref.getReferences()).length;

        if (usageCount <= 1) {
          this.addUnusedItem({
            type: 'import',
            name: defaultImport.getText(),
            location: this.getLocation(defaultImport),
            reason: 'Default import is never used',
            canSafelyRemove: true,
            dependencies: []
          });
        }
      }
    }
  }

  private findUnusedExports(sourceFile: SourceFile, followImports: boolean): void {
    const exports = sourceFile.getExportedDeclarations();

    for (const [name, declarations] of exports) {
      for (const declaration of declarations) {
        const references = declaration.findReferences();

        // Filter references to find external usage
        const externalUsage = references.flatMap(ref => ref.getReferences())
          .filter(ref => {
            const refFile = ref.getSourceFile();
            return refFile !== sourceFile;
          });

        if (externalUsage.length === 0) {
          this.addUnusedItem({
            type: 'export',
            name,
            location: this.getLocation(declaration),
            reason: 'Exported but never imported or used externally',
            canSafelyRemove: true,
            dependencies: []
          });
        }
      }
    }
  }

  private findUnreachableCode(sourceFile: SourceFile): void {
    sourceFile.forEachDescendant((node) => {
      // Code after return statement
      if (Node.isReturnStatement(node)) {
        this.checkCodeAfterEarlyExit(node, 'return');
      }

      // Code after throw statement
      if (Node.isThrowStatement(node)) {
        this.checkCodeAfterEarlyExit(node, 'throw');
      }

      // Impossible conditions
      if (Node.isIfStatement(node)) {
        this.checkImpossibleConditions(node);
      }
    });
  }

  private checkCodeAfterEarlyExit(node: any, exitType: string): void {
    const parent = node.getParent();
    if (!Node.isBlock(parent)) return;

    const statements = parent.getStatements();
    const nodeIndex = statements.indexOf(node);

    // Check if there's code after this statement in the same block
    if (nodeIndex < statements.length - 1) {
      const nextStatement = statements[nodeIndex + 1];

      this.addUnusedItem({
        type: 'function',  // Generic type for unreachable code
        name: `Unreachable code after ${exitType}`,
        location: this.getLocation(nextStatement),
        reason: `Code is unreachable because it comes after ${exitType} statement`,
        canSafelyRemove: true,
        dependencies: []
      });
    }
  }

  private checkImpossibleConditions(ifStatement: any): void {
    const expression = ifStatement.getExpression();
    const expressionText = expression.getText();

    // Check for always true/false conditions
    if (expressionText === 'true') {
      const elseStatement = ifStatement.getElseStatement();
      if (elseStatement) {
        this.addUnusedItem({
          type: 'function',
          name: 'Unreachable else branch',
          location: this.getLocation(elseStatement),
          reason: 'Else branch is unreachable because condition is always true',
          canSafelyRemove: true,
          dependencies: []
        });
      }
    } else if (expressionText === 'false') {
      const thenStatement = ifStatement.getThenStatement();
      this.addUnusedItem({
        type: 'function',
        name: 'Unreachable then branch',
        location: this.getLocation(thenStatement),
        reason: 'Then branch is unreachable because condition is always false',
        canSafelyRemove: true,
        dependencies: []
      });
    }
  }

  private getFunctionDependencies(func: any): string[] {
    const dependencies: string[] = [];
    const body = func.getBody();

    if (body) {
      body.forEachDescendant((node: any) => {
        if (Node.isIdentifier(node)) {
          dependencies.push(node.getText());
        }
      });
    }

    return [...new Set(dependencies)];  // Remove duplicates
  }

  private getLocation(node: any): UnusedCodeItem['location'] {
    const sourceFile = node.getSourceFile();
    const start = node.getStart();
    const { line, column } = sourceFile.getLineAndColumnAtPos(start);

    return {
      file: sourceFile.getFilePath(),
      line,
      column
    };
  }

  private isExcluded(filePath: string, excludePaths: string[]): boolean {
    return excludePaths.some(exclude => filePath.includes(exclude));
  }

  private addUnusedItem(item: UnusedCodeItem): void {
    this.unusedItems.push(item);
  }

  generateReport(): string {
    const report: string[] = [];

    report.push('# Unused Code Report\n');
    report.push(`Total unused items found: ${this.unusedItems.length}\n`);

    // Group by type
    const byType = this.groupByType(this.unusedItems);

    for (const [type, items] of Object.entries(byType)) {
      report.push(`\n## Unused ${type}s (${items.length})\n`);

      for (const item of items) {
        report.push(`- **${item.name}**`);
        report.push(`  - Location: ${item.location.file}:${item.location.line}`);
        report.push(`  - Reason: ${item.reason}`);
        report.push(`  - Can safely remove: ${item.canSafelyRemove ? 'Yes' : 'No'}`);
        if (item.dependencies.length > 0) {
          report.push(`  - Dependencies: ${item.dependencies.slice(0, 5).join(', ')}`);
        }
        report.push('');
      }
    }

    return report.join('\n');
  }

  private groupByType(items: UnusedCodeItem[]): Record<string, UnusedCodeItem[]> {
    const grouped: Record<string, UnusedCodeItem[]> = {};

    for (const item of items) {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item);
    }

    return grouped;
  }
}

// Usage example
const finder = new UnusedCodeFinder('./tsconfig.json');

const unusedCode = finder.scan({
  includePaths: ['src/**/*.ts', 'src/**/*.tsx'],
  excludePaths: ['node_modules', 'dist', 'test', '.test.', '.spec.'],
  checkExports: true,
  checkUnreachable: true,
  followImports: true
});

console.log(`Found ${unusedCode.length} unused code items`);

// Generate report
const report = finder.generateReport();
fs.writeFileSync('unused-code-report.md', report);
console.log('Report saved to unused-code-report.md');

// Show summary
const safeToRemove = unusedCode.filter(item => item.canSafelyRemove);
console.log(`\n${safeToRemove.length} items can be safely removed`);
```

### Coverage-Based Unused Code Finder

```javascript
const fs = require('fs');
const path = require('path');
const { parse } = require('lcov-parse');

class CoverageUnusedFinder {
  constructor(coverageFile) {
    this.coverageFile = coverageFile;
    this.uncoveredCode = [];
  }

  async analyze(threshold = 0) {
    return new Promise((resolve, reject) => {
      parse(this.coverageFile, (err, data) => {
        if (err) {
          reject(err);
          return;
        }

        for (const file of data) {
          this.analyzeFile(file, threshold);
        }

        resolve(this.uncoveredCode);
      });
    });
  }

  analyzeFile(fileData, threshold) {
    const coverage = this.calculateCoverage(fileData);

    if (coverage.line <= threshold) {
      this.uncoveredCode.push({
        file: fileData.file,
        type: 'file',
        coverage: coverage.line,
        reason: `File has ${coverage.line}% line coverage (below ${threshold}% threshold)`,
        details: {
          lines: coverage.line,
          functions: coverage.function,
          branches: coverage.branch
        }
      });
    }

    // Find specific uncovered functions
    for (const func of fileData.functions.details) {
      if (func.hit === 0) {
        this.uncoveredCode.push({
          file: fileData.file,
          type: 'function',
          name: func.name,
          line: func.line,
          coverage: 0,
          reason: 'Function is never executed in tests',
          canSafelyRemove: false  // Need manual review
        });
      }
    }

    // Find uncovered branches
    for (const branch of fileData.branches.details) {
      if (branch.taken === 0) {
        this.uncoveredCode.push({
          file: fileData.file,
          type: 'branch',
          line: branch.line,
          coverage: 0,
          reason: 'Branch is never taken in tests',
          canSafelyRemove: false
        });
      }
    }
  }

  calculateCoverage(fileData) {
    const lineCoverage = (fileData.lines.hit / fileData.lines.found) * 100;
    const functionCoverage = (fileData.functions.hit / fileData.functions.found) * 100;
    const branchCoverage = fileData.branches.found > 0
      ? (fileData.branches.hit / fileData.branches.found) * 100
      : 100;

    return {
      line: Math.round(lineCoverage * 100) / 100,
      function: Math.round(functionCoverage * 100) / 100,
      branch: Math.round(branchCoverage * 100) / 100
    };
  }

  generateReport() {
    const report = [];

    report.push('# Coverage-Based Unused Code Report\n');
    report.push(`Total items with low/no coverage: ${this.uncoveredCode.length}\n`);

    // Group by type
    const byType = {};
    for (const item of this.uncoveredCode) {
      if (!byType[item.type]) {
        byType[item.type] = [];
      }
      byType[item.type].push(item);
    }

    for (const [type, items] of Object.entries(byType)) {
      report.push(`\n## Uncovered ${type}s (${items.length})\n`);

      for (const item of items) {
        if (item.name) {
          report.push(`- **${item.name}** (${item.file}:${item.line})`);
        } else {
          report.push(`- ${item.file}`);
        }
        report.push(`  - ${item.reason}`);
        report.push(`  - Coverage: ${item.coverage}%`);
        report.push('');
      }
    }

    return report.join('\n');
  }
}

// Usage
const coverageFinder = new CoverageUnusedFinder('./coverage/lcov.info');

coverageFinder.analyze(50).then(results => {
  console.log(`Found ${results.length} items with low or no coverage`);

  const report = coverageFinder.generateReport();
  fs.writeFileSync('coverage-unused-report.md', report);
  console.log('Report saved to coverage-unused-report.md');
});
```

## Best Practices

### Detection Strategy
- **Regular Scans**: Run unused code detection regularly (weekly/monthly)
- **Pre-Deployment**: Check for unused code before major releases
- **Coverage Integration**: Combine static analysis with coverage reports
- **Manual Review**: Always manually review before removing code
- **Incremental Removal**: Remove unused code gradually, not all at once

### Safe Removal
- **Version Control**: Always commit before removing code
- **Feature Branches**: Remove unused code in dedicated branches
- **Comprehensive Testing**: Run full test suite after removal
- **Staged Rollout**: Deploy removals gradually to production
- **Rollback Plan**: Be prepared to revert if issues arise

### Code Quality
- **Bundle Size**: Track bundle size improvements after removal
- **Performance**: Monitor performance impact of code removal
- **Documentation**: Update documentation when removing public APIs
- **Deprecation**: Deprecate before removing public interfaces
- **Communication**: Inform team about removed functionality

---

**ClaudeForge Unused Code Finder** - Enterprise-grade dead code detection with comprehensive static analysis, coverage integration, and safe removal recommendations for cleaner, more efficient codebases.
