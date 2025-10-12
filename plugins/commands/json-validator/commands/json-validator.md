---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge JSON validator with schema validation, formatting, JSONPath queries, diff comparison, and comprehensive error reporting.
---

# ClaudeForge JSON Validator

ClaudeForge intelligent JSON validation and manipulation system that validates JSON against schemas, formats and prettifies JSON, performs JSONPath queries, compares JSON structures, and provides detailed error reporting for robust data handling.

## Purpose

Transform JSON data management from error-prone manual validation to intelligent automation that ensures data integrity, schema compliance, and consistent formatting with powerful query and comparison capabilities.

## Features

- **Schema Validation**: Validate JSON against JSON Schema (draft-07, 2019-09, 2020-12)
- **JSON Formatting**: Pretty-print and minify JSON with custom formatting
- **JSONPath Queries**: Query and extract data using JSONPath expressions
- **JSON Diff**: Compare JSON structures and highlight differences
- **Syntax Validation**: Check for JSON syntax errors with detailed error messages
- **Type Checking**: Verify data types and structure compliance
- **Custom Validators**: Create custom validation rules for specific needs
- **Batch Validation**: Validate multiple JSON files against schemas

## Usage

```bash
/json-validator [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise use current file)

## Code Examples

### JSON Validator (TypeScript)

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import * as fs from 'fs';
import * as jp from 'jsonpath';

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: string[];
}

interface ValidationError {
  path: string;
  message: string;
  keyword: string;
  params: any;
}

class JSONValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv({
      allErrors: true,
      verbose: true,
      strict: false
    });
    addFormats(this.ajv);

    // Add custom formats
    this.ajv.addFormat('slug', /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    this.ajv.addFormat('phone', /^\+?[1-9]\d{1,14}$/);
  }

  validate(data: any, schema: any): ValidationResult {
    const validate = this.ajv.compile(schema);
    const valid = validate(data);

    const errors: ValidationError[] = [];
    const warnings: string[] = [];

    if (!valid && validate.errors) {
      for (const error of validate.errors) {
        errors.push({
          path: error.instancePath || '/',
          message: error.message || 'Validation error',
          keyword: error.keyword,
          params: error.params
        });
      }
    }

    // Additional warnings
    this.checkWarnings(data, warnings);

    return {
      valid,
      errors,
      warnings
    };
  }

  private checkWarnings(data: any, warnings: string[]): void {
    // Check for potential issues
    if (typeof data === 'object' && data !== null) {
      // Check for empty strings
      this.findEmptyStrings(data, '', warnings);

      // Check for large numbers
      this.findLargeNumbers(data, '', warnings);

      // Check for deep nesting
      const depth = this.getDepth(data);
      if (depth > 10) {
        warnings.push(`JSON is deeply nested (${depth} levels) - consider flattening`);
      }
    }
  }

  private findEmptyStrings(obj: any, path: string, warnings: string[]): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (value === '') {
        warnings.push(`Empty string at path: ${currentPath}`);
      } else if (typeof value === 'object' && value !== null) {
        this.findEmptyStrings(value, currentPath, warnings);
      }
    }
  }

  private findLargeNumbers(obj: any, path: string, warnings: string[]): void {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'number' && Math.abs(value) > Number.MAX_SAFE_INTEGER) {
        warnings.push(`Number exceeds safe integer at path: ${currentPath}`);
      } else if (typeof value === 'object' && value !== null) {
        this.findLargeNumbers(value, currentPath, warnings);
      }
    }
  }

  private getDepth(obj: any, currentDepth: number = 0): number {
    if (typeof obj !== 'object' || obj === null) {
      return currentDepth;
    }

    const depths = Object.values(obj).map(value =>
      this.getDepth(value, currentDepth + 1)
    );

    return depths.length > 0 ? Math.max(...depths) : currentDepth;
  }

  format(json: string | object, options?: FormatOptions): string {
    const obj = typeof json === 'string' ? JSON.parse(json) : json;

    const space = options?.minify ? undefined : (options?.indent || 2);
    return JSON.stringify(obj, null, space);
  }

  query(data: any, path: string): any {
    return jp.query(data, path);
  }

  diff(obj1: any, obj2: any): JSONDiff[] {
    const differences: JSONDiff[] = [];
    this.compareObjects(obj1, obj2, '', differences);
    return differences;
  }

  private compareObjects(obj1: any, obj2: any, path: string, differences: JSONDiff[]): void {
    // Check if types are different
    if (typeof obj1 !== typeof obj2) {
      differences.push({
        path,
        type: 'type',
        oldValue: obj1,
        newValue: obj2,
        message: `Type changed from ${typeof obj1} to ${typeof obj2}`
      });
      return;
    }

    // Handle null
    if (obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        differences.push({
          path,
          type: 'value',
          oldValue: obj1,
          newValue: obj2,
          message: 'Value changed'
        });
      }
      return;
    }

    // Handle arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        differences.push({
          path,
          type: 'array-length',
          oldValue: obj1.length,
          newValue: obj2.length,
          message: `Array length changed from ${obj1.length} to ${obj2.length}`
        });
      }

      const maxLength = Math.max(obj1.length, obj2.length);
      for (let i = 0; i < maxLength; i++) {
        if (i >= obj1.length) {
          differences.push({
            path: `${path}[${i}]`,
            type: 'added',
            oldValue: undefined,
            newValue: obj2[i],
            message: 'Array item added'
          });
        } else if (i >= obj2.length) {
          differences.push({
            path: `${path}[${i}]`,
            type: 'removed',
            oldValue: obj1[i],
            newValue: undefined,
            message: 'Array item removed'
          });
        } else {
          this.compareObjects(obj1[i], obj2[i], `${path}[${i}]`, differences);
        }
      }
      return;
    }

    // Handle objects
    if (typeof obj1 === 'object' && typeof obj2 === 'object') {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      const allKeys = new Set([...keys1, ...keys2]);

      for (const key of allKeys) {
        const currentPath = path ? `${path}.${key}` : key;

        if (!(key in obj1)) {
          differences.push({
            path: currentPath,
            type: 'added',
            oldValue: undefined,
            newValue: obj2[key],
            message: 'Property added'
          });
        } else if (!(key in obj2)) {
          differences.push({
            path: currentPath,
            type: 'removed',
            oldValue: obj1[key],
            newValue: undefined,
            message: 'Property removed'
          });
        } else {
          this.compareObjects(obj1[key], obj2[key], currentPath, differences);
        }
      }
      return;
    }

    // Handle primitives
    if (obj1 !== obj2) {
      differences.push({
        path,
        type: 'value',
        oldValue: obj1,
        newValue: obj2,
        message: 'Value changed'
      });
    }
  }

  validateFile(filePath: string, schemaPath: string): ValidationResult {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    return this.validate(data, schema);
  }

  formatFile(filePath: string, options?: FormatOptions): void {
    const content = fs.readFileSync(filePath, 'utf-8');
    const formatted = this.format(content, options);
    fs.writeFileSync(filePath, formatted);
    console.log(`✅ Formatted ${filePath}`);
  }
}

interface FormatOptions {
  indent?: number;
  minify?: boolean;
}

interface JSONDiff {
  path: string;
  type: 'value' | 'type' | 'added' | 'removed' | 'array-length';
  oldValue: any;
  newValue: any;
  message: string;
}

// Usage examples
const validator = new JSONValidator();

// Example 1: Validate JSON against schema
const userSchema = {
  type: 'object',
  required: ['name', 'email'],
  properties: {
    name: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    age: { type: 'integer', minimum: 0, maximum: 120 },
    website: { type: 'string', format: 'uri' }
  }
};

const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  website: 'https://johndoe.com'
};

const result = validator.validate(userData, userSchema);
console.log('Validation Result:', result);

if (!result.valid) {
  console.log('Errors:');
  result.errors.forEach(err => {
    console.log(`  - ${err.path}: ${err.message}`);
  });
}

// Example 2: Format JSON
const uglyJSON = '{"name":"John","age":30,"hobbies":["reading","coding"]}';
const pretty = validator.format(uglyJSON);
console.log('Formatted JSON:');
console.log(pretty);

// Example 3: JSONPath query
const data = {
  users: [
    { name: 'Alice', age: 30, active: true },
    { name: 'Bob', age: 25, active: false },
    { name: 'Charlie', age: 35, active: true }
  ]
};

const activeUsers = validator.query(data, '$.users[?(@.active)]');
console.log('Active users:', activeUsers);

// Example 4: JSON Diff
const oldData = {
  name: 'John',
  age: 30,
  city: 'New York'
};

const newData = {
  name: 'John',
  age: 31,
  city: 'San Francisco',
  email: 'john@example.com'
};

const diff = validator.diff(oldData, newData);
console.log('Differences:');
diff.forEach(d => {
  console.log(`  ${d.path}: ${d.message}`);
  console.log(`    Old: ${JSON.stringify(d.oldValue)}`);
  console.log(`    New: ${JSON.stringify(d.newValue)}`);
});
```

### CLI Tool

```typescript
#!/usr/bin/env node
import { Command } from 'commander';
import { JSONValidator } from './json-validator';
import * as fs from 'fs';

const program = new Command();

program
  .name('json-validator')
  .description('Validate and manipulate JSON files')
  .version('1.0.0');

program
  .command('validate')
  .description('Validate JSON against schema')
  .requiredOption('-i, --input <file>', 'Input JSON file')
  .requiredOption('-s, --schema <file>', 'JSON Schema file')
  .action((options) => {
    const validator = new JSONValidator();
    const result = validator.validateFile(options.input, options.schema);

    if (result.valid) {
      console.log('✅ Validation passed');
    } else {
      console.log('❌ Validation failed');
      result.errors.forEach(err => {
        console.log(`  ${err.path}: ${err.message}`);
      });
    }

    if (result.warnings.length > 0) {
      console.log('\\n⚠️  Warnings:');
      result.warnings.forEach(w => console.log(`  ${w}`));
    }
  });

program
  .command('format')
  .description('Format JSON file')
  .requiredOption('-i, --input <file>', 'Input JSON file')
  .option('-o, --output <file>', 'Output file (default: overwrite input)')
  .option('--minify', 'Minify JSON')
  .option('--indent <spaces>', 'Indentation spaces', '2')
  .action((options) => {
    const validator = new JSONValidator();
    const content = fs.readFileSync(options.input, 'utf-8');
    const formatted = validator.format(content, {
      minify: options.minify,
      indent: parseInt(options.indent)
    });

    const output = options.output || options.input;
    fs.writeFileSync(output, formatted);
    console.log(`✅ Formatted and saved to ${output}`);
  });

program
  .command('query')
  .description('Query JSON using JSONPath')
  .requiredOption('-i, --input <file>', 'Input JSON file')
  .requiredOption('-q, --query <path>', 'JSONPath query')
  .action((options) => {
    const validator = new JSONValidator();
    const data = JSON.parse(fs.readFileSync(options.input, 'utf-8'));
    const result = validator.query(data, options.query);
    console.log(JSON.stringify(result, null, 2));
  });

program
  .command('diff')
  .description('Compare two JSON files')
  .requiredOption('-o, --old <file>', 'Old JSON file')
  .requiredOption('-n, --new <file>', 'New JSON file')
  .action((options) => {
    const validator = new JSONValidator();
    const oldData = JSON.parse(fs.readFileSync(options.old, 'utf-8'));
    const newData = JSON.parse(fs.readFileSync(options.new, 'utf-8'));
    const diff = validator.diff(oldData, newData);

    if (diff.length === 0) {
      console.log('✅ No differences found');
    } else {
      console.log(`Found ${diff.length} differences:`);
      diff.forEach(d => {
        console.log(`\\n${d.path}:`);
        console.log(`  Type: ${d.type}`);
        console.log(`  Message: ${d.message}`);
        if (d.oldValue !== undefined) {
          console.log(`  Old: ${JSON.stringify(d.oldValue)}`);
        }
        if (d.newValue !== undefined) {
          console.log(`  New: ${JSON.stringify(d.newValue)}`);
        }
      });
    }
  });

program.parse();
```

## Best Practices

### Validation
- **Schema First**: Define schemas before implementing features
- **Strict Validation**: Use strict schemas in production
- **Error Handling**: Provide clear error messages
- **Version Schemas**: Track schema versions for API changes
- **Custom Validators**: Create domain-specific validators

### Data Management
- **Format Consistently**: Use consistent JSON formatting
- **Avoid Deep Nesting**: Keep JSON structures shallow
- **Use Arrays**: Use arrays for lists instead of numbered keys
- **Type Safety**: Ensure consistent data types
- **Documentation**: Document JSON structure and schemas

### Performance
- **Compile Schemas**: Cache compiled schemas for better performance
- **Stream Large Files**: Use streaming for large JSON files
- **Optimize Queries**: Use efficient JSONPath expressions
- **Batch Operations**: Process multiple files efficiently
- **Memory Management**: Be cautious with large JSON files

---

**ClaudeForge JSON Validator** - Enterprise-grade JSON validation, formatting, querying, and comparison with comprehensive schema support and detailed error reporting.
