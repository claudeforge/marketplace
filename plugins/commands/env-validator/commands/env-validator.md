---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge environment file validator with schema validation, type checking, required variables verification, and .env.example generation.
---

# ClaudeForge Environment File Validator

ClaudeForge intelligent environment file validation system that ensures configuration completeness, validates variable formats, checks for missing or misconfigured environment variables, and maintains synchronized .env.example templates for team collaboration.

## Purpose

Transform environment configuration from error-prone manual management to intelligent automation that prevents deployment failures, validates configuration formats, and maintains consistent environment setup across development, staging, and production environments.

## Features

- **.env Validation**: Comprehensive validation of environment files against schemas
- **Type Checking**: Validate variable types (string, number, boolean, URL, email)
- **Required Variables**: Ensure all required environment variables are present
- **.env.example Generation**: Automatically generate example templates from .env files
- **Format Validation**: Validate URLs, database connections, email addresses, ports
- **Missing Variables Detection**: Find missing variables compared to schema
- **Security Checks**: Detect hardcoded secrets, weak passwords, exposed credentials
- **Cross-Environment Comparison**: Compare .env files across environments

## Usage

```bash
/env-validator [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current directory)

### Validation Actions

**Validate Current Environment:**
```bash
/env-validator validate --file=.env --schema=.env.schema.json
```
Performs comprehensive validation including:
- Required variables presence check
- Type validation for all variables
- Format validation (URLs, emails, ports, etc.)
- Value constraints (min/max, patterns, enums)
- Dependency checking (if X is set, Y must be set)
- Security vulnerability scanning
- Duplicate variable detection
- Invalid characters and syntax errors

**Generate .env.example:**
```bash
/env-validator generate-example --input=.env --output=.env.example
```
Generates safe example template with:
- Variable names preserved
- Sensitive values replaced with placeholders
- Comments and descriptions included
- Grouped by category (database, api, auth, etc.)
- Required variables marked
- Type hints in comments
- Example values for non-sensitive data
- Clear instructions for developers

**Check Missing Variables:**
```bash
/env-validator check-missing --env=.env --required=.env.schema.json
```
Identifies missing configuration with:
- List of all missing required variables
- Optional variables not present
- Variables in schema but not in .env
- Variables in .env but not in schema
- Severity levels (critical, warning, info)
- Suggested default values
- Documentation links for each variable
- Impact analysis of missing variables

**Compare Environments:**
```bash
/env-validator compare --source=.env.staging --target=.env.production
```
Compares environment configurations:
- Variables present in one but not the other
- Different values between environments
- Type mismatches
- Format inconsistencies
- Security differences
- Configuration drift detection
- Synchronization recommendations
- Safe migration plan

## Code Examples

### Environment Schema Definition (JSON)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Application Environment Configuration",
  "type": "object",
  "required": ["NODE_ENV", "PORT", "DATABASE_URL", "JWT_SECRET"],
  "properties": {
    "NODE_ENV": {
      "type": "string",
      "enum": ["development", "staging", "production", "test"],
      "description": "Application environment mode"
    },
    "PORT": {
      "type": "integer",
      "minimum": 1024,
      "maximum": 65535,
      "default": 3000,
      "description": "Server port number"
    },
    "DATABASE_URL": {
      "type": "string",
      "pattern": "^(postgres|mysql|mongodb)://.*",
      "description": "Database connection URL",
      "examples": ["postgres://user:pass@localhost:5432/dbname"]
    },
    "REDIS_URL": {
      "type": "string",
      "pattern": "^redis://.*",
      "description": "Redis connection URL",
      "examples": ["redis://localhost:6379"]
    },
    "JWT_SECRET": {
      "type": "string",
      "minLength": 32,
      "description": "JWT signing secret (minimum 32 characters)",
      "sensitive": true
    },
    "JWT_EXPIRES_IN": {
      "type": "string",
      "pattern": "^\\d+[smhd]$",
      "default": "7d",
      "description": "JWT expiration time (e.g., 7d, 24h, 60m)",
      "examples": ["7d", "24h", "3600s"]
    },
    "API_BASE_URL": {
      "type": "string",
      "format": "uri",
      "description": "Base URL for API endpoints"
    },
    "CORS_ORIGIN": {
      "type": "string",
      "description": "Allowed CORS origins (comma-separated)",
      "examples": ["http://localhost:3000,https://app.example.com"]
    },
    "LOG_LEVEL": {
      "type": "string",
      "enum": ["error", "warn", "info", "debug"],
      "default": "info",
      "description": "Logging verbosity level"
    },
    "MAX_REQUEST_SIZE": {
      "type": "string",
      "pattern": "^\\d+(kb|mb|gb)$",
      "default": "10mb",
      "description": "Maximum request body size"
    },
    "SMTP_HOST": {
      "type": "string",
      "description": "SMTP server hostname"
    },
    "SMTP_PORT": {
      "type": "integer",
      "minimum": 1,
      "maximum": 65535,
      "default": 587,
      "description": "SMTP server port"
    },
    "SMTP_USER": {
      "type": "string",
      "description": "SMTP authentication username"
    },
    "SMTP_PASS": {
      "type": "string",
      "description": "SMTP authentication password",
      "sensitive": true
    },
    "AWS_REGION": {
      "type": "string",
      "pattern": "^[a-z]{2}-[a-z]+-\\d$",
      "description": "AWS region identifier",
      "examples": ["us-east-1", "eu-west-1"]
    },
    "AWS_ACCESS_KEY_ID": {
      "type": "string",
      "pattern": "^[A-Z0-9]{20}$",
      "description": "AWS access key ID",
      "sensitive": true
    },
    "AWS_SECRET_ACCESS_KEY": {
      "type": "string",
      "minLength": 40,
      "description": "AWS secret access key",
      "sensitive": true
    },
    "S3_BUCKET": {
      "type": "string",
      "description": "S3 bucket name for file storage"
    },
    "RATE_LIMIT_WINDOW": {
      "type": "integer",
      "minimum": 1000,
      "description": "Rate limit window in milliseconds",
      "default": 900000
    },
    "RATE_LIMIT_MAX": {
      "type": "integer",
      "minimum": 1,
      "description": "Maximum requests per window",
      "default": 100
    }
  },
  "dependencies": {
    "SMTP_HOST": ["SMTP_PORT", "SMTP_USER", "SMTP_PASS"],
    "AWS_ACCESS_KEY_ID": ["AWS_SECRET_ACCESS_KEY", "AWS_REGION"],
    "S3_BUCKET": ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  }
}
```

### Environment Validator (TypeScript)

```typescript
import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import * as dotenv from 'dotenv';

interface ValidationError {
  variable: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  suggestion?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
  summary: {
    total: number;
    missing: number;
    invalid: number;
    secure: boolean;
  };
}

class EnvValidator {
  private ajv: Ajv;
  private schema: any;
  private envVars: Record<string, string>;

  constructor(schemaPath: string, envPath: string = '.env') {
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);

    // Load schema
    const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
    this.schema = JSON.parse(schemaContent);

    // Load environment variables
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    this.envVars = envConfig;
  }

  validate(): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const info: ValidationError[] = [];

    // Check required variables
    const required = this.schema.required || [];
    for (const varName of required) {
      if (!this.envVars[varName]) {
        errors.push({
          variable: varName,
          message: `Required variable "${varName}" is missing`,
          severity: 'error',
          suggestion: this.getSuggestion(varName)
        });
      }
    }

    // Validate each present variable
    for (const [varName, value] of Object.entries(this.envVars)) {
      const propertySchema = this.schema.properties?.[varName];

      if (!propertySchema) {
        warnings.push({
          variable: varName,
          message: `Variable "${varName}" is not defined in schema`,
          severity: 'warning',
          suggestion: 'Consider adding to schema or removing if unused'
        });
        continue;
      }

      // Type validation
      const typeErrors = this.validateType(varName, value, propertySchema);
      errors.push(...typeErrors);

      // Format validation
      if (propertySchema.format) {
        const formatErrors = this.validateFormat(varName, value, propertySchema.format);
        errors.push(...formatErrors);
      }

      // Pattern validation
      if (propertySchema.pattern) {
        const patternErrors = this.validatePattern(varName, value, propertySchema.pattern);
        errors.push(...patternErrors);
      }

      // Enum validation
      if (propertySchema.enum) {
        const enumErrors = this.validateEnum(varName, value, propertySchema.enum);
        errors.push(...enumErrors);
      }

      // Security checks
      if (propertySchema.sensitive) {
        const securityWarnings = this.checkSecurity(varName, value);
        warnings.push(...securityWarnings);
      }

      // Length validation
      if (propertySchema.minLength && value.length < propertySchema.minLength) {
        errors.push({
          variable: varName,
          message: `Variable "${varName}" is too short (minimum ${propertySchema.minLength} characters)`,
          severity: 'error'
        });
      }
    }

    // Check dependencies
    const dependencyErrors = this.checkDependencies();
    errors.push(...dependencyErrors);

    // Check for duplicate variables
    const duplicates = this.findDuplicates();
    warnings.push(...duplicates);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      info,
      summary: {
        total: Object.keys(this.envVars).length,
        missing: errors.filter(e => e.message.includes('missing')).length,
        invalid: errors.filter(e => !e.message.includes('missing')).length,
        secure: warnings.filter(w => w.message.includes('security')).length === 0
      }
    };
  }

  private validateType(varName: string, value: string, schema: any): ValidationError[] {
    const errors: ValidationError[] = [];

    switch (schema.type) {
      case 'integer':
      case 'number':
        if (isNaN(Number(value))) {
          errors.push({
            variable: varName,
            message: `Variable "${varName}" must be a number`,
            severity: 'error',
            suggestion: `Current value: "${value}"`
          });
        } else {
          const num = Number(value);
          if (schema.minimum !== undefined && num < schema.minimum) {
            errors.push({
              variable: varName,
              message: `Variable "${varName}" must be >= ${schema.minimum}`,
              severity: 'error'
            });
          }
          if (schema.maximum !== undefined && num > schema.maximum) {
            errors.push({
              variable: varName,
              message: `Variable "${varName}" must be <= ${schema.maximum}`,
              severity: 'error'
            });
          }
        }
        break;

      case 'boolean':
        if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
          errors.push({
            variable: varName,
            message: `Variable "${varName}" must be a boolean (true/false)`,
            severity: 'error'
          });
        }
        break;
    }

    return errors;
  }

  private validateFormat(varName: string, value: string, format: string): ValidationError[] {
    const errors: ValidationError[] = [];

    switch (format) {
      case 'uri':
      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push({
            variable: varName,
            message: `Variable "${varName}" must be a valid URL`,
            severity: 'error',
            suggestion: 'Example: https://api.example.com'
          });
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push({
            variable: varName,
            message: `Variable "${varName}" must be a valid email`,
            severity: 'error'
          });
        }
        break;
    }

    return errors;
  }

  private validatePattern(varName: string, value: string, pattern: string): ValidationError[] {
    const errors: ValidationError[] = [];
    const regex = new RegExp(pattern);

    if (!regex.test(value)) {
      errors.push({
        variable: varName,
        message: `Variable "${varName}" does not match required pattern`,
        severity: 'error',
        suggestion: `Pattern: ${pattern}`
      });
    }

    return errors;
  }

  private validateEnum(varName: string, value: string, enumValues: string[]): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!enumValues.includes(value)) {
      errors.push({
        variable: varName,
        message: `Variable "${varName}" must be one of: ${enumValues.join(', ')}`,
        severity: 'error',
        suggestion: `Current value: "${value}"`
      });
    }

    return errors;
  }

  private checkSecurity(varName: string, value: string): ValidationError[] {
    const warnings: ValidationError[] = [];

    // Check for weak secrets
    if (varName.includes('SECRET') || varName.includes('KEY') || varName.includes('PASS')) {
      if (value.length < 16) {
        warnings.push({
          variable: varName,
          message: `Variable "${varName}" appears to be a weak secret`,
          severity: 'warning',
          suggestion: 'Use at least 16 characters for sensitive values'
        });
      }

      // Check for common weak values
      const weakValues = ['password', 'secret', '123456', 'admin', 'test'];
      if (weakValues.some(weak => value.toLowerCase().includes(weak))) {
        warnings.push({
          variable: varName,
          message: `Variable "${varName}" contains a common weak value`,
          severity: 'warning',
          suggestion: 'Use a strong, randomly generated value'
        });
      }
    }

    return warnings;
  }

  private checkDependencies(): ValidationError[] {
    const errors: ValidationError[] = [];
    const dependencies = this.schema.dependencies || {};

    for (const [varName, deps] of Object.entries(dependencies)) {
      if (this.envVars[varName]) {
        const missingDeps = (deps as string[]).filter(dep => !this.envVars[dep]);

        for (const missingDep of missingDeps) {
          errors.push({
            variable: missingDep,
            message: `Variable "${missingDep}" is required when "${varName}" is set`,
            severity: 'error'
          });
        }
      }
    }

    return errors;
  }

  private findDuplicates(): ValidationError[] {
    const warnings: ValidationError[] = [];
    const envContent = fs.readFileSync('.env', 'utf-8');
    const lines = envContent.split('\n');
    const seen = new Map<string, number>();

    lines.forEach((line, index) => {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)\s*=/);
      if (match) {
        const varName = match[1];
        if (seen.has(varName)) {
          warnings.push({
            variable: varName,
            message: `Duplicate variable "${varName}" found (lines ${seen.get(varName)! + 1} and ${index + 1})`,
            severity: 'warning',
            suggestion: 'Remove duplicate definition'
          });
        } else {
          seen.set(varName, index);
        }
      }
    });

    return warnings;
  }

  private getSuggestion(varName: string): string {
    const propertySchema = this.schema.properties?.[varName];
    if (!propertySchema) return '';

    const parts: string[] = [];

    if (propertySchema.description) {
      parts.push(propertySchema.description);
    }

    if (propertySchema.default !== undefined) {
      parts.push(`Default: ${propertySchema.default}`);
    }

    if (propertySchema.examples && propertySchema.examples.length > 0) {
      parts.push(`Example: ${propertySchema.examples[0]}`);
    }

    return parts.join('. ');
  }

  generateExample(outputPath: string = '.env.example'): void {
    const lines: string[] = [
      '# Environment Configuration',
      '# Copy this file to .env and fill in the values',
      '',
    ];

    const properties = this.schema.properties || {};
    const required = this.schema.required || [];

    // Group variables by prefix
    const grouped = this.groupVariables(Object.keys(properties));

    for (const [group, vars] of Object.entries(grouped)) {
      lines.push(`# ${group}`);

      for (const varName of vars) {
        const schema = properties[varName];

        // Add description
        if (schema.description) {
          lines.push(`# ${schema.description}`);
        }

        // Add type and constraints
        const constraints: string[] = [];
        if (required.includes(varName)) {
          constraints.push('REQUIRED');
        }
        if (schema.type) {
          constraints.push(`Type: ${schema.type}`);
        }
        if (schema.default !== undefined) {
          constraints.push(`Default: ${schema.default}`);
        }
        if (constraints.length > 0) {
          lines.push(`# ${constraints.join(', ')}`);
        }

        // Add example value
        let exampleValue = '';
        if (schema.sensitive) {
          exampleValue = 'your-secret-value-here';
        } else if (schema.examples && schema.examples.length > 0) {
          exampleValue = schema.examples[0];
        } else if (schema.default !== undefined) {
          exampleValue = schema.default;
        } else {
          exampleValue = this.generateExampleValue(schema);
        }

        lines.push(`${varName}=${exampleValue}`);
        lines.push('');
      }
    }

    fs.writeFileSync(outputPath, lines.join('\n'));
  }

  private groupVariables(variables: string[]): Record<string, string[]> {
    const groups: Record<string, string[]> = {
      'Application': [],
      'Database': [],
      'Authentication': [],
      'Email': [],
      'AWS/Cloud': [],
      'Other': []
    };

    for (const varName of variables) {
      if (varName.startsWith('DB_') || varName.includes('DATABASE')) {
        groups['Database'].push(varName);
      } else if (varName.includes('JWT') || varName.includes('AUTH')) {
        groups['Authentication'].push(varName);
      } else if (varName.includes('SMTP') || varName.includes('EMAIL')) {
        groups['Email'].push(varName);
      } else if (varName.includes('AWS') || varName.includes('S3')) {
        groups['AWS/Cloud'].push(varName);
      } else if (['NODE_ENV', 'PORT', 'LOG_LEVEL'].includes(varName)) {
        groups['Application'].push(varName);
      } else {
        groups['Other'].push(varName);
      }
    }

    // Remove empty groups
    return Object.fromEntries(
      Object.entries(groups).filter(([_, vars]) => vars.length > 0)
    );
  }

  private generateExampleValue(schema: any): string {
    if (schema.type === 'integer' || schema.type === 'number') {
      return schema.minimum !== undefined ? String(schema.minimum) : '0';
    }
    if (schema.type === 'boolean') {
      return 'false';
    }
    if (schema.enum) {
      return schema.enum[0];
    }
    return '';
  }
}

// Usage example
const validator = new EnvValidator('.env.schema.json', '.env');
const result = validator.validate();

console.log('Validation Result:', result.valid ? 'PASSED' : 'FAILED');
console.log(`\nSummary:`);
console.log(`  Total variables: ${result.summary.total}`);
console.log(`  Missing: ${result.summary.missing}`);
console.log(`  Invalid: ${result.summary.invalid}`);
console.log(`  Secure: ${result.summary.secure ? 'Yes' : 'No'}`);

if (result.errors.length > 0) {
  console.log(`\nErrors:`);
  result.errors.forEach(error => {
    console.log(`  ❌ ${error.message}`);
    if (error.suggestion) {
      console.log(`     💡 ${error.suggestion}`);
    }
  });
}

if (result.warnings.length > 0) {
  console.log(`\nWarnings:`);
  result.warnings.forEach(warning => {
    console.log(`  ⚠️  ${warning.message}`);
    if (warning.suggestion) {
      console.log(`     💡 ${warning.suggestion}`);
    }
  });
}

// Generate .env.example
validator.generateExample('.env.example');
console.log('\n✅ Generated .env.example file');
```

## Best Practices

### Schema Design
- **Comprehensive Documentation**: Include descriptions for all variables
- **Type Safety**: Define strict types and formats for validation
- **Security Markers**: Mark sensitive variables in schema
- **Dependencies**: Document variable dependencies clearly
- **Examples**: Provide realistic example values
- **Defaults**: Specify sensible default values where applicable

### Validation Strategy
- **Pre-Deployment**: Validate environment before deployment
- **CI/CD Integration**: Add validation to CI pipeline
- **Local Development**: Validate on application startup
- **Multiple Environments**: Maintain separate schemas per environment
- **Version Control**: Track schema changes in git

### Security Considerations
- **Never Commit .env**: Keep .env files out of version control
- **Strong Secrets**: Enforce minimum length for sensitive values
- **Rotation Policy**: Regularly rotate secrets and keys
- **Access Control**: Limit who can access production .env files
- **Encryption**: Encrypt .env files at rest when necessary

---

**ClaudeForge Environment File Validator** - Enterprise-grade environment configuration validation with comprehensive type checking, security scanning, and automated template generation for reliable application deployment.
