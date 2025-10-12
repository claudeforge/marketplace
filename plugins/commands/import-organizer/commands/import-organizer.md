---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge import organizer with automatic sorting, grouping, unused import detection, and ESLint integration for clean code.
---

# ClaudeForge Import Organizer

ClaudeForge intelligent import organization system that automatically sorts, groups, and optimizes import statements across JavaScript, TypeScript, Python, and other languages, removing unused imports and maintaining consistent code style throughout your codebase.

## Purpose

Transform import management from manual organization to intelligent automation that maintains consistent import ordering, removes dead imports, groups related modules, and enforces team conventions for cleaner, more maintainable code.

## Features

- **Automatic Sorting**: Sort imports alphabetically, by type, or by custom rules
- **Smart Grouping**: Group by external/internal, type/value, or custom categories
- **Unused Import Detection**: Find and remove unused imports automatically
- **Multi-Language Support**: JavaScript, TypeScript, Python, Go, Rust, Java
- **ESLint Integration**: Enforce import rules with ESLint configuration
- **Preserve Comments**: Maintain import-related comments during reorganization
- **Bulk Operations**: Process entire directories or specific files
- **Custom Rules**: Define project-specific import organization rules

## Usage

```bash
/import-organizer [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current directory)

### Organization Actions

**Organize Current File:**
```bash
/import-organizer organize --file=src/app.ts --style=grouped
```
Reorganizes imports with:
- External packages first (from node_modules)
- Internal modules second (project files)
- Alphabetical sorting within groups
- Blank lines between groups
- Type imports separated from value imports
- Side-effect imports at the end
- Preserved import comments
- Consistent quote style

**Remove Unused Imports:**
```bash
/import-organizer remove-unused --path=src/ --recursive
```
Finds and removes unused imports by:
- Static analysis of import usage
- Dead code detection
- Type-only imports that are unused
- Namespace imports with no references
- Default imports that are never used
- Named imports with zero usage
- Safe removal with backup
- Detailed removal report

**Sort Imports:**
```bash
/import-organizer sort --file=index.js --order=alphabetical
```
Sorts imports using strategies:
- Alphabetical by module name
- By import type (default, named, namespace)
- By path depth (shallow to deep)
- Natural order (numbers before letters)
- Custom comparator functions
- Case-sensitive or insensitive
- Length-based sorting
- Dependency-based ordering

**Group Imports:**
```bash
/import-organizer group --directory=src/ --categories=custom
```
Groups imports into categories:
- Built-in modules (node:*, core libraries)
- External packages (node_modules)
- Internal modules (absolute imports)
- Relative imports (./*, ../* )
- Type imports (@types/*)
- Style imports (*.css, *.scss)
- Asset imports (*.png, *.svg)
- Custom groups per configuration

## Code Examples

### Import Organizer (TypeScript)

```typescript
import * as fs from 'fs';
import * as path from 'path';
import { Project, SourceFile, SyntaxKind, ImportDeclaration } from 'ts-morph';

interface ImportInfo {
  declaration: ImportDeclaration;
  module: string;
  category: 'builtin' | 'external' | 'internal' | 'relative';
  importType: 'default' | 'named' | 'namespace' | 'side-effect';
  names: string[];
  isTypeOnly: boolean;
  lineNumber: number;
}

interface OrganizerConfig {
  sortOrder: 'alphabetical' | 'length' | 'natural';
  grouping: 'category' | 'flat' | 'custom';
  separateTypeImports: boolean;
  blankLinesBetweenGroups: boolean;
  removeUnused: boolean;
  customGroups?: Record<string, string[]>;
}

class ImportOrganizer {
  private project: Project;
  private config: OrganizerConfig;

  constructor(tsConfigPath?: string, config?: Partial<OrganizerConfig>) {
    this.project = new Project({
      tsConfigFilePath: tsConfigPath
    });

    this.config = {
      sortOrder: 'alphabetical',
      grouping: 'category',
      separateTypeImports: true,
      blankLinesBetweenGroups: true,
      removeUnused: false,
      ...config
    };
  }

  organizeFile(filePath: string): void {
    const sourceFile = this.project.addSourceFileAtPath(filePath);

    // Extract import information
    const imports = this.extractImports(sourceFile);

    // Remove unused imports if configured
    if (this.config.removeUnused) {
      this.removeUnusedImports(sourceFile, imports);
    }

    // Organize remaining imports
    const organized = this.organizeImports(imports);

    // Replace imports in source file
    this.replaceImports(sourceFile, organized);

    // Save changes
    sourceFile.saveSync();

    console.log(`✅ Organized imports in ${filePath}`);
  }

  private extractImports(sourceFile: SourceFile): ImportInfo[] {
    const imports: ImportInfo[] = [];
    const importDeclarations = sourceFile.getImportDeclarations();

    for (const declaration of importDeclarations) {
      const moduleSpecifier = declaration.getModuleSpecifierValue();
      const category = this.categorizeImport(moduleSpecifier);
      const isTypeOnly = declaration.isTypeOnly();

      let importType: ImportInfo['importType'] = 'side-effect';
      const names: string[] = [];

      // Check for default import
      const defaultImport = declaration.getDefaultImport();
      if (defaultImport) {
        importType = 'default';
        names.push(defaultImport.getText());
      }

      // Check for named imports
      const namedImports = declaration.getNamedImports();
      if (namedImports.length > 0) {
        importType = names.length > 0 ? 'default' : 'named';
        names.push(...namedImports.map(ni => ni.getName()));
      }

      // Check for namespace import
      const namespaceImport = declaration.getNamespaceImport();
      if (namespaceImport) {
        importType = 'namespace';
        names.push(namespaceImport.getText());
      }

      imports.push({
        declaration,
        module: moduleSpecifier,
        category,
        importType,
        names,
        isTypeOnly,
        lineNumber: declaration.getStartLineNumber()
      });
    }

    return imports;
  }

  private categorizeImport(module: string): ImportInfo['category'] {
    // Built-in modules
    if (module.startsWith('node:') || this.isBuiltinModule(module)) {
      return 'builtin';
    }

    // Relative imports
    if (module.startsWith('.')) {
      return 'relative';
    }

    // Check if it's an internal module (starts with @/ or ~/)
    if (module.startsWith('@/') || module.startsWith('~/')) {
      return 'internal';
    }

    // External package
    return 'external';
  }

  private isBuiltinModule(module: string): boolean {
    const builtins = [
      'fs', 'path', 'http', 'https', 'crypto', 'stream', 'events',
      'util', 'os', 'child_process', 'url', 'querystring', 'buffer'
    ];
    return builtins.includes(module) || builtins.includes(module.split('/')[0]);
  }

  private removeUnusedImports(sourceFile: SourceFile, imports: ImportInfo[]): void {
    const unusedImports = this.findUnusedImports(sourceFile, imports);

    for (const importInfo of unusedImports) {
      importInfo.declaration.remove();
    }

    if (unusedImports.length > 0) {
      console.log(`🗑️  Removed ${unusedImports.length} unused imports`);
    }
  }

  private findUnusedImports(sourceFile: SourceFile, imports: ImportInfo[]): ImportInfo[] {
    const unused: ImportInfo[] = [];
    const fileText = sourceFile.getFullText();

    for (const importInfo of imports) {
      // Skip side-effect imports
      if (importInfo.importType === 'side-effect') {
        continue;
      }

      const allNamesUsed = importInfo.names.every(name => {
        // Create regex to find usage (not in import statement)
        const importStatementEnd = importInfo.declaration.getEnd();
        const textAfterImport = fileText.substring(importStatementEnd);

        // Look for the name as a standalone identifier
        const usageRegex = new RegExp(`\\b${name}\\b`, 'g');
        return usageRegex.test(textAfterImport);
      });

      if (!allNamesUsed) {
        unused.push(importInfo);
      }
    }

    return unused;
  }

  private organizeImports(imports: ImportInfo[]): ImportInfo[][] {
    // Separate type imports if configured
    let valueImports = imports;
    let typeImports: ImportInfo[] = [];

    if (this.config.separateTypeImports) {
      valueImports = imports.filter(i => !i.isTypeOnly);
      typeImports = imports.filter(i => i.isTypeOnly);
    }

    // Group imports by category
    const groups = this.groupImports(valueImports);
    const typeGroups = this.config.separateTypeImports
      ? this.groupImports(typeImports)
      : [];

    // Sort within each group
    const sortedGroups = groups.map(group => this.sortImports(group));
    const sortedTypeGroups = typeGroups.map(group => this.sortImports(group));

    // Combine groups
    return [...sortedGroups, ...sortedTypeGroups].filter(g => g.length > 0);
  }

  private groupImports(imports: ImportInfo[]): ImportInfo[][] {
    if (this.config.grouping === 'flat') {
      return [imports];
    }

    const groups: Record<string, ImportInfo[]> = {
      builtin: [],
      external: [],
      internal: [],
      relative: []
    };

    for (const importInfo of imports) {
      groups[importInfo.category].push(importInfo);
    }

    // Return groups in order, excluding empty groups
    return Object.values(groups).filter(group => group.length > 0);
  }

  private sortImports(imports: ImportInfo[]): ImportInfo[] {
    return imports.sort((a, b) => {
      switch (this.config.sortOrder) {
        case 'alphabetical':
          return a.module.localeCompare(b.module);

        case 'length':
          return a.module.length - b.module.length;

        case 'natural':
          return this.naturalCompare(a.module, b.module);

        default:
          return 0;
      }
    });
  }

  private naturalCompare(a: string, b: string): number {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  }

  private replaceImports(sourceFile: SourceFile, organizedGroups: ImportInfo[][]): void {
    // Get all import declarations
    const allImports = sourceFile.getImportDeclarations();

    if (allImports.length === 0) {
      return;
    }

    // Remove all existing imports
    allImports.forEach(imp => imp.remove());

    // Build new import statements
    const importStatements: string[] = [];

    for (let i = 0; i < organizedGroups.length; i++) {
      const group = organizedGroups[i];

      for (const importInfo of group) {
        importStatements.push(this.buildImportStatement(importInfo));
      }

      // Add blank line between groups (except after last group)
      if (this.config.blankLinesBetweenGroups && i < organizedGroups.length - 1) {
        importStatements.push('');
      }
    }

    // Insert organized imports at the top of file
    sourceFile.insertText(0, importStatements.join('\n') + '\n\n');
  }

  private buildImportStatement(importInfo: ImportInfo): string {
    const { module, importType, names, isTypeOnly } = importInfo;
    const typePrefix = isTypeOnly ? 'type ' : '';

    switch (importType) {
      case 'side-effect':
        return `import '${module}';`;

      case 'namespace':
        return `import ${typePrefix}* as ${names[0]} from '${module}';`;

      case 'default':
        if (names.length === 1) {
          return `import ${typePrefix}${names[0]} from '${module}';`;
        }
        // Default + named imports
        const [defaultName, ...namedNames] = names;
        return `import ${typePrefix}${defaultName}, { ${namedNames.join(', ')} } from '${module}';`;

      case 'named':
        return `import ${typePrefix}{ ${names.join(', ')} } from '${module}';`;

      default:
        return '';
    }
  }

  organizeDirectory(dirPath: string, recursive: boolean = true): void {
    const pattern = recursive ? '**/*.{ts,tsx,js,jsx}' : '*.{ts,tsx,js,jsx}';
    const files = this.project.addSourceFilesAtPaths(path.join(dirPath, pattern));

    console.log(`📦 Organizing imports in ${files.length} files...`);

    for (const file of files) {
      this.organizeFile(file.getFilePath());
    }

    console.log('✅ Import organization complete!');
  }
}

// Usage examples
const organizer = new ImportOrganizer('./tsconfig.json', {
  sortOrder: 'alphabetical',
  grouping: 'category',
  separateTypeImports: true,
  blankLinesBetweenGroups: true,
  removeUnused: true
});

// Organize single file
organizer.organizeFile('./src/app.ts');

// Organize entire directory
organizer.organizeDirectory('./src', true);
```

### Python Import Organizer

```python
import os
import re
from typing import List, Dict, Set, Tuple
from dataclasses import dataclass
from enum import Enum

class ImportCategory(Enum):
    STANDARD_LIBRARY = 1
    THIRD_PARTY = 2
    LOCAL = 3

@dataclass
class Import:
    line: str
    module: str
    names: List[str]
    category: ImportCategory
    is_from_import: bool
    line_number: int

class PythonImportOrganizer:
    STANDARD_LIBRARY = {
        'os', 'sys', 'json', 're', 'datetime', 'time', 'math',
        'random', 'collections', 'itertools', 'functools', 'typing',
        'pathlib', 'io', 'pickle', 'csv', 'xml', 'http', 'urllib',
        'socket', 'threading', 'multiprocessing', 'asyncio', 'logging'
    }

    def __init__(self, remove_unused: bool = False):
        self.remove_unused = remove_unused

    def organize_file(self, file_path: str) -> None:
        """Organize imports in a Python file."""
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        # Extract imports and rest of file
        imports, rest_of_file, first_import_line = self._extract_imports(lines)

        # Find unused imports if configured
        if self.remove_unused:
            used_names = self._find_used_names('\n'.join(rest_of_file))
            imports = self._remove_unused(imports, used_names)

        # Organize imports
        organized = self._organize_imports(imports)

        # Reconstruct file
        new_content = (
            ''.join(lines[:first_import_line]) +
            organized +
            '\n\n' +
            ''.join(rest_of_file)
        )

        # Write back to file
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"✅ Organized imports in {file_path}")

    def _extract_imports(self, lines: List[str]) -> Tuple[List[Import], List[str], int]:
        """Extract import statements from file."""
        imports: List[Import] = []
        rest_of_file: List[str] = []
        first_import_line = -1
        import_section = False
        import_block = []
        line_number = 0

        for i, line in enumerate(lines):
            stripped = line.strip()

            # Check if it's an import line
            if stripped.startswith('import ') or stripped.startswith('from '):
                if first_import_line == -1:
                    first_import_line = i

                import_section = True
                import_block.append(line)

                # Parse import
                import_info = self._parse_import(stripped, i)
                if import_info:
                    imports.append(import_info)

            # Skip blank lines and comments in import section
            elif import_section and (not stripped or stripped.startswith('#')):
                continue

            # End of import section
            elif import_section and stripped:
                import_section = False
                rest_of_file.append(line)

            # Before imports or after imports
            else:
                if first_import_line == -1:
                    line_number = i + 1
                else:
                    rest_of_file.append(line)

        if first_import_line == -1:
            first_import_line = line_number

        return imports, rest_of_file, first_import_line

    def _parse_import(self, line: str, line_number: int) -> Import:
        """Parse an import statement."""
        # Handle 'from ... import ...'
        from_match = re.match(r'from\s+([\w.]+)\s+import\s+(.+)', line)
        if from_match:
            module = from_match.group(1)
            imports_str = from_match.group(2)

            # Handle parenthesized imports
            imports_str = imports_str.strip('()')

            # Extract imported names
            names = [name.strip() for name in imports_str.split(',')]
            names = [re.sub(r'\s+as\s+\w+', '', name) for name in names]

            category = self._categorize_import(module)

            return Import(
                line=line,
                module=module,
                names=names,
                category=category,
                is_from_import=True,
                line_number=line_number
            )

        # Handle 'import ...'
        import_match = re.match(r'import\s+([\w., ]+)', line)
        if import_match:
            modules_str = import_match.group(1)
            modules = [m.strip() for m in modules_str.split(',')]
            module = modules[0]  # Use first module for categorization

            category = self._categorize_import(module)

            return Import(
                line=line,
                module=module,
                names=modules,
                category=category,
                is_from_import=False,
                line_number=line_number
            )

        return None

    def _categorize_import(self, module: str) -> ImportCategory:
        """Categorize an import as standard library, third-party, or local."""
        base_module = module.split('.')[0]

        # Check if standard library
        if base_module in self.STANDARD_LIBRARY:
            return ImportCategory.STANDARD_LIBRARY

        # Local imports (relative)
        if module.startswith('.'):
            return ImportCategory.LOCAL

        # Check if it's a local module by trying to import
        try:
            # This is a heuristic - third-party packages are usually installed
            import importlib.util
            spec = importlib.util.find_spec(base_module)
            if spec and spec.origin and 'site-packages' not in str(spec.origin):
                return ImportCategory.LOCAL
        except:
            pass

        return ImportCategory.THIRD_PARTY

    def _organize_imports(self, imports: List[Import]) -> str:
        """Organize imports by category and sort alphabetically."""
        # Group by category
        groups: Dict[ImportCategory, List[Import]] = {
            ImportCategory.STANDARD_LIBRARY: [],
            ImportCategory.THIRD_PARTY: [],
            ImportCategory.LOCAL: []
        }

        for imp in imports:
            groups[imp.category].append(imp)

        # Sort each group
        for category in groups:
            groups[category].sort(key=lambda x: (not x.is_from_import, x.module, x.line))

        # Build organized import string
        lines = []

        for category in [ImportCategory.STANDARD_LIBRARY, ImportCategory.THIRD_PARTY, ImportCategory.LOCAL]:
            group = groups[category]
            if group:
                # Add imports
                lines.extend([imp.line for imp in group])
                # Add blank line between groups
                lines.append('')

        # Remove trailing blank line
        while lines and not lines[-1].strip():
            lines.pop()

        return '\n'.join(lines)

    def _find_used_names(self, code: str) -> Set[str]:
        """Find all names used in the code."""
        # Simple regex to find identifiers
        pattern = r'\b([a-zA-Z_][a-zA-Z0-9_]*)\b'
        matches = re.findall(pattern, code)
        return set(matches)

    def _remove_unused(self, imports: List[Import], used_names: Set[str]) -> List[Import]:
        """Remove unused imports."""
        used_imports = []

        for imp in imports:
            # Check if any imported name is used
            if imp.names[0] == '*':
                # Keep wildcard imports
                used_imports.append(imp)
            elif any(name in used_names for name in imp.names):
                used_imports.append(imp)
            else:
                print(f"🗑️  Removing unused import: {imp.line.strip()}")

        return used_imports

# Usage
organizer = PythonImportOrganizer(remove_unused=True)
organizer.organize_file('./src/app.py')
```

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['import'],
  rules: {
    // Enforce import order
    'import/order': ['error', {
      'groups': [
        'builtin',     // Node.js built-in modules
        'external',    // npm packages
        'internal',    // Internal modules (aliased)
        'parent',      // Parent directory imports
        'sibling',     // Sibling directory imports
        'index',       // Index imports
        'type'         // Type imports
      ],
      'pathGroups': [
        {
          pattern: '@/**',
          group: 'internal',
          position: 'before'
        }
      ],
      'newlines-between': 'always',
      'alphabetize': {
        order: 'asc',
        caseInsensitive: true
      }
    }],

    // No unused imports
    'no-unused-vars': ['error', {
      'vars': 'all',
      'args': 'after-used',
      'ignoreRestSiblings': true
    }],

    // Prefer named exports
    'import/prefer-default-export': 'off',

    // No duplicate imports
    'import/no-duplicates': 'error',

    // No anonymous default exports
    'import/no-anonymous-default-export': 'error',

    // Extensions
    'import/extensions': ['error', 'ignorePackages', {
      'js': 'never',
      'jsx': 'never',
      'ts': 'never',
      'tsx': 'never'
    }]
  }
};
```

## Best Practices

### Import Organization
- **Consistent Ordering**: Follow a consistent import order across all files
- **Group by Type**: Separate external, internal, and relative imports
- **Alphabetical Sorting**: Sort imports alphabetically within groups
- **Blank Lines**: Use blank lines to separate import groups
- **Type Imports**: Keep type imports separate from value imports

### Code Quality
- **Remove Unused**: Regularly clean up unused imports
- **ESLint Integration**: Enforce import rules with linting
- **Pre-commit Hooks**: Organize imports before committing
- **CI/CD Checks**: Validate import organization in CI pipeline
- **Team Standards**: Document and enforce team conventions

### Performance
- **Tree Shaking**: Proper imports enable better tree shaking
- **Bundle Size**: Remove unused imports to reduce bundle size
- **Code Splitting**: Organized imports make code splitting easier
- **Lazy Loading**: Group imports by feature for lazy loading

---

**ClaudeForge Import Organizer** - Enterprise-grade import management with intelligent sorting, grouping, unused import detection, and seamless ESLint integration for cleaner, more maintainable codebases.
