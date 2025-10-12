---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge TypeScript type generator from JSON data, API responses, with quicktype integration and Zod schema generation.
---

# ClaudeForge Type Generator

ClaudeForge intelligent TypeScript type generator that creates type definitions from JSON data, API responses, database schemas, and other sources, with support for quicktype, JSON Schema, Zod schemas, and runtime validation.

## Purpose

Transform type definition creation from manual typing to intelligent automation that generates accurate TypeScript types, interfaces, and schemas from runtime data, ensuring type safety and reducing boilerplate code.

## Features

- **JSON to TypeScript**: Generate types from JSON data automatically
- **API Response Types**: Create types from API response examples
- **Zod Schema Generation**: Generate Zod schemas for runtime validation
- **quicktype Integration**: Use quicktype for advanced type inference
- **Database Schema**: Generate types from database schemas
- **GraphQL Types**: Create types from GraphQL schemas
- **Union Type Detection**: Automatically detect and create union types
- **Nested Type Support**: Handle deeply nested object structures

## Usage

```bash
/type-generator [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current data)

### Generation Actions

**Generate from JSON:**
```bash
/type-generator from-json --input=data.json --output=types.ts --name=User
```
Creates TypeScript types from JSON:
- Infer types from values
- Handle nested objects
- Create interfaces for objects
- Generate union types for arrays
- Optional vs required properties
- Nullable type handling
- Array type inference
- Generic type support

**Generate from API Response:**
```bash
/type-generator from-api --url=https://api.example.com/users --output=api-types.ts
```
Fetches and generates types from API:
- Makes API request
- Analyzes response structure
- Generates request/response types
- Error response types
- Pagination types
- Common API patterns
- Authentication headers
- Multiple endpoint support

**Generate Zod Schema:**
```bash
/type-generator zod --input=data.json --output=schema.ts --validation
```
Creates Zod schemas with validation:
- Runtime type validation
- Custom validation rules
- Error messages
- Type inference from schema
- Transform functions
- Refinements and superRefine
- Async validation
- Schema composition

**Use quicktype:**
```bash
/type-generator quicktype --input=data.json --lang=typescript --features=all
```
Advanced generation with quicktype:
- Multiple input sources
- Various output languages
- Smart type inference
- Union type optimization
- Date/time detection
- UUID detection
- URL/email detection
- Custom naming conventions

## Code Examples

### Type Generator (TypeScript)

```typescript
import * as fs from 'fs';
import * as path from 'path';

interface TypeDefinition {
  name: string;
  type: string;
  properties?: Record<string, TypeDefinition>;
  isArray?: boolean;
  isOptional?: boolean;
  isNullable?: boolean;
  union?: string[];
}

class TypeGenerator {
  generateFromJSON(data: any, typeName: string): string {
    const typeDefinition = this.inferType(data, typeName);
    return this.generateTypeScript(typeDefinition);
  }

  private inferType(value: any, name: string): TypeDefinition {
    const type = typeof value;

    if (value === null) {
      return {
        name,
        type: 'null',
        isNullable: true
      };
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return {
          name,
          type: 'any[]',
          isArray: true
        };
      }

      // Infer type from array elements
      const elementTypes = new Set(value.map(v => typeof v));

      if (elementTypes.size === 1) {
        const elementType = this.inferType(value[0], name + 'Item');
        return {
          name,
          type: elementType.type,
          isArray: true,
          properties: elementType.properties
        };
      } else {
        // Union type for mixed arrays
        const types = Array.from(elementTypes);
        return {
          name,
          type: types.join(' | '),
          isArray: true,
          union: types
        };
      }
    }

    if (type === 'object') {
      const properties: Record<string, TypeDefinition> = {};

      for (const [key, val] of Object.entries(value)) {
        properties[key] = this.inferType(val, this.capitalize(key));
      }

      return {
        name,
        type: 'object',
        properties
      };
    }

    // Primitive types with smart detection
    if (type === 'string') {
      // Detect special string formats
      if (this.isISO8601(value)) {
        return { name, type: 'Date' };
      }
      if (this.isUUID(value)) {
        return { name, type: 'string', union: ['UUID'] };
      }
      if (this.isEmail(value)) {
        return { name, type: 'string', union: ['Email'] };
      }
      if (this.isURL(value)) {
        return { name, type: 'string', union: ['URL'] };
      }
    }

    return {
      name,
      type: type as string
    };
  }

  private generateTypeScript(definition: TypeDefinition, level: number = 0): string {
    const lines: string[] = [];
    const indent = '  '.repeat(level);

    if (definition.properties) {
      // Generate interface for object types
      lines.push(`${indent}export interface ${definition.name} {`);

      for (const [propName, propDef] of Object.entries(definition.properties)) {
        const optional = propDef.isOptional ? '?' : '';
        const nullable = propDef.isNullable ? ' | null' : '';
        const array = propDef.isArray ? '[]' : '';

        if (propDef.properties) {
          // Nested object - define inline or reference
          const nestedType = this.generateTypeScript(propDef, level + 1);
          lines.push(`${indent}  ${propName}${optional}: {`);
          for (const [nestedProp, nestedPropDef] of Object.entries(propDef.properties)) {
            const nestedOptional = nestedPropDef.isOptional ? '?' : '';
            const nestedNullable = nestedPropDef.isNullable ? ' | null' : '';
            const nestedArray = nestedPropDef.isArray ? '[]' : '';
            lines.push(`${indent}    ${nestedProp}${nestedOptional}: ${nestedPropDef.type}${nestedArray}${nestedNullable};`);
          }
          lines.push(`${indent}  }${array}${nullable};`);
        } else {
          lines.push(`${indent}  ${propName}${optional}: ${propDef.type}${array}${nullable};`);
        }
      }

      lines.push(`${indent}}`);
    }

    return lines.join('\n');
  }

  generateZodSchema(data: any, schemaName: string): string {
    const schema = this.inferZodSchema(data);
    return `import { z } from 'zod';\n\nexport const ${schemaName}Schema = ${schema};\n\nexport type ${schemaName} = z.infer<typeof ${schemaName}Schema>;`;
  }

  private inferZodSchema(value: any, depth: number = 0): string {
    if (value === null) {
      return 'z.null()';
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'z.array(z.any())';
      }
      const elementSchema = this.inferZodSchema(value[0], depth + 1);
      return `z.array(${elementSchema})`;
    }

    const type = typeof value;

    if (type === 'object') {
      const properties: string[] = [];

      for (const [key, val] of Object.entries(value)) {
        const valueSchema = this.inferZodSchema(val, depth + 1);
        properties.push(`  ${key}: ${valueSchema}`);
      }

      return `z.object({\n${properties.join(',\n')}\n})`;
    }

    // Primitive types with validation
    if (type === 'string') {
      if (this.isEmail(value)) {
        return 'z.string().email()';
      }
      if (this.isURL(value)) {
        return 'z.string().url()';
      }
      if (this.isUUID(value)) {
        return 'z.string().uuid()';
      }
      if (this.isISO8601(value)) {
        return 'z.string().datetime()';
      }
      return `z.string()${value.length > 0 ? `.min(${value.length})` : ''}`;
    }

    if (type === 'number') {
      return Number.isInteger(value) ? 'z.number().int()' : 'z.number()';
    }

    if (type === 'boolean') {
      return 'z.boolean()';
    }

    return 'z.any()';
  }

  async generateFromAPI(url: string, typeName: string): Promise<string> {
    try {
      const response = await fetch(url);
      const data = await response.json();

      return this.generateFromJSON(data, typeName);
    } catch (error) {
      throw new Error(`Failed to fetch API: ${error.message}`);
    }
  }

  generateFromMultipleSamples(samples: any[], typeName: string): string {
    // Merge all samples to find all possible properties
    const merged = this.mergeSamples(samples);
    return this.generateFromJSON(merged, typeName);
  }

  private mergeSamples(samples: any[]): any {
    if (samples.length === 0) return {};

    const merged: any = {};
    const allKeys = new Set<string>();

    // Collect all keys from all samples
    for (const sample of samples) {
      if (typeof sample === 'object' && sample !== null) {
        Object.keys(sample).forEach(key => allKeys.add(key));
      }
    }

    // For each key, determine if it's optional
    for (const key of allKeys) {
      const values = samples
        .filter(s => s !== null && typeof s === 'object')
        .map(s => s[key])
        .filter(v => v !== undefined);

      if (values.length < samples.length) {
        // Key is optional - mark it somehow
        merged[key] = values[0];
      } else {
        // Key is required - use first value
        merged[key] = values[0];
      }
    }

    return merged;
  }

  // Helper methods for format detection
  private isISO8601(value: string): boolean {
    const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/;
    return iso8601Regex.test(value);
  }

  private isUUID(value: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  }

  private isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  private isURL(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  saveToFile(types: string, outputPath: string): void {
    fs.writeFileSync(outputPath, types);
    console.log(`✅ Types saved to ${outputPath}`);
  }
}

// Usage examples

// Example 1: Generate from JSON object
const generator = new TypeGenerator();

const userData = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  isActive: true,
  createdAt: '2024-01-15T10:30:00Z',
  profile: {
    bio: 'Software developer',
    website: 'https://johndoe.com',
    followers: 1234
  },
  tags: ['developer', 'typescript', 'react']
};

const userTypes = generator.generateFromJSON(userData, 'User');
console.log(userTypes);

// Example 2: Generate Zod schema
const zodSchema = generator.generateZodSchema(userData, 'User');
console.log(zodSchema);

// Example 3: Generate from API
(async () => {
  const apiTypes = await generator.generateFromAPI(
    'https://jsonplaceholder.typicode.com/users/1',
    'ApiUser'
  );
  generator.saveToFile(apiTypes, './types/api-user.ts');
})();

// Example 4: Generate from multiple samples
const samples = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', phone: '555-1234' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', phone: '555-5678' }
];

const multiSampleTypes = generator.generateFromMultipleSamples(samples, 'Contact');
console.log(multiSampleTypes);
```

### quicktype Integration

```typescript
import { quicktype, InputData, JSONSchemaInput, FetchingJSONSchemaStore } from 'quicktype-core';

async function generateTypesWithQuicktype(
  jsonString: string,
  typeName: string
): Promise<string> {
  const jsonInput = new JSONSchemaInput(new FetchingJSONSchemaStore());

  await jsonInput.addSource({
    name: typeName,
    schema: jsonString
  });

  const inputData = new InputData();
  inputData.addInput(jsonInput);

  const result = await quicktype({
    inputData,
    lang: 'typescript',
    rendererOptions: {
      'just-types': 'true',
      'explicit-unions': 'true',
      'prefer-unions': 'true',
      'prefer-const-values': 'true'
    }
  });

  return result.lines.join('\n');
}

// Usage
const jsonData = JSON.stringify({
  id: 1,
  name: 'Product',
  price: 29.99,
  inStock: true
});

generateTypesWithQuicktype(jsonData, 'Product')
  .then(types => {
    console.log(types);
    fs.writeFileSync('./types/product.ts', types);
  });
```

### CLI Tool

```typescript
#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import { TypeGenerator } from './type-generator';

const program = new Command();

program
  .name('type-gen')
  .description('Generate TypeScript types from JSON data')
  .version('1.0.0');

program
  .command('from-json')
  .description('Generate types from JSON file')
  .requiredOption('-i, --input <path>', 'Input JSON file')
  .requiredOption('-o, --output <path>', 'Output TypeScript file')
  .requiredOption('-n, --name <name>', 'Type name')
  .option('--zod', 'Generate Zod schema instead of types')
  .action((options) => {
    const jsonData = JSON.parse(fs.readFileSync(options.input, 'utf-8'));
    const generator = new TypeGenerator();

    const result = options.zod
      ? generator.generateZodSchema(jsonData, options.name)
      : generator.generateFromJSON(jsonData, options.name);

    generator.saveToFile(result, options.output);
  });

program
  .command('from-api')
  .description('Generate types from API response')
  .requiredOption('-u, --url <url>', 'API endpoint URL')
  .requiredOption('-o, --output <path>', 'Output TypeScript file')
  .requiredOption('-n, --name <name>', 'Type name')
  .option('-H, --header <header>', 'HTTP header (repeatable)', [])
  .action(async (options) => {
    const generator = new TypeGenerator();
    const types = await generator.generateFromAPI(options.url, options.name);
    generator.saveToFile(types, options.output);
  });

program
  .command('watch')
  .description('Watch JSON file and regenerate types on changes')
  .requiredOption('-i, --input <path>', 'Input JSON file')
  .requiredOption('-o, --output <path>', 'Output TypeScript file')
  .requiredOption('-n, --name <name>', 'Type name')
  .action((options) => {
    console.log(`👀 Watching ${options.input} for changes...`);

    fs.watch(options.input, (eventType) => {
      if (eventType === 'change') {
        console.log('📝 File changed, regenerating types...');
        const jsonData = JSON.parse(fs.readFileSync(options.input, 'utf-8'));
        const generator = new TypeGenerator();
        const types = generator.generateFromJSON(jsonData, options.name);
        generator.saveToFile(types, options.output);
      }
    });
  });

program.parse();
```

### Advanced Type Generation

```typescript
// Generate types for API endpoints
interface APIEndpoint {
  path: string;
  method: string;
  requestType?: string;
  responseType: string;
}

class APITypeGenerator {
  generateAPITypes(endpoints: APIEndpoint[]): string {
    const types: string[] = [];

    types.push('// API Type Definitions\n');

    for (const endpoint of endpoints) {
      const safeTypeName = this.pathToTypeName(endpoint.path, endpoint.method);

      if (endpoint.requestType) {
        types.push(`export type ${safeTypeName}Request = ${endpoint.requestType};`);
      }

      types.push(`export type ${safeTypeName}Response = ${endpoint.responseType};`);
      types.push('');
    }

    // Generate API client type
    types.push('export interface APIClient {');
    for (const endpoint of endpoints) {
      const typeName = this.pathToTypeName(endpoint.path, endpoint.method);
      const requestParam = endpoint.requestType ? `request: ${typeName}Request` : '';
      types.push(`  ${endpoint.method.toLowerCase()}${typeName}(${requestParam}): Promise<${typeName}Response>;`);
    }
    types.push('}');

    return types.join('\n');
  }

  private pathToTypeName(path: string, method: string): string {
    // /api/users/:id -> GetApiUsersById
    const parts = path.split('/').filter(p => p && !p.startsWith(':'));
    const cleaned = parts.map(p => this.capitalize(p)).join('');
    return method.charAt(0).toUpperCase() + method.slice(1).toLowerCase() + cleaned;
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
```

## Best Practices

### Type Generation
- **Multiple Samples**: Use multiple data samples for better type inference
- **Nullability**: Properly handle null and undefined values
- **Optional Properties**: Mark optional properties correctly
- **Union Types**: Generate union types for variant data
- **Documentation**: Add JSDoc comments to generated types
- **Validation**: Use Zod for runtime type validation

### Maintenance
- **Version Control**: Track generated types in git
- **Regeneration**: Set up scripts to regenerate types
- **Watch Mode**: Use watch mode during development
- **CI/CD Integration**: Regenerate types in CI pipeline
- **Type Checking**: Always run TypeScript compiler after generation

### Code Quality
- **Naming Conventions**: Use consistent naming for types
- **File Organization**: Organize types by domain/module
- **Import Management**: Use proper import paths
- **Type Reuse**: Extract common types to shared files
- **Documentation**: Document complex type structures

---

**ClaudeForge Type Generator** - Enterprise-grade TypeScript type generation from JSON, APIs, and schemas with quicktype integration, Zod schema support, and intelligent type inference for type-safe development.
