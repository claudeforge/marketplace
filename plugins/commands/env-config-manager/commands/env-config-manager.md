---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge environment configuration and secrets management with Vault, AWS Secrets Manager, and validation.
---

# ClaudeForge Environment Config Manager

ClaudeForge intelligent environment configuration and secrets management system that securely handles environment variables, manages secrets across multiple environments, and ensures configuration validation with enterprise-grade security practices.

## Purpose

Transform configuration management from scattered environment files to centralized, secure, and validated configuration systems that prevent security vulnerabilities, simplify deployment, and maintain consistency across all environments.

## Features

- **Environment Files**: Manage .env files with validation and type checking
- **Secrets Management**: Integrate with Vault, AWS Secrets Manager, Azure Key Vault
- **Configuration Validation**: Schema validation and required variable checking
- **Multi-Environment**: Separate configurations for dev, staging, production
- **Secret Rotation**: Automated secret rotation and expiration management
- **Encryption**: Encrypt sensitive configuration values at rest
- **Access Control**: Role-based access to configuration and secrets
- **Audit Logging**: Track all configuration and secret access

## Usage

```bash
/env-config-manager [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current scope)

### Environment File Management

**Initialize Environment:**
```bash
/env-config-manager init --template=node --environments=dev,staging,prod
```
Creates environment configuration structure with:
- .env template files for each environment
- .env.example with all required variables (without values)
- .env.local for local development overrides
- .gitignore entries for sensitive files
- README documentation for setup
- Type definitions for TypeScript projects
- Validation schemas for required variables
- Default values for non-sensitive configuration

**Validate Configuration:**
```bash
/env-config-manager validate --env=production --strict=true
```
Validates environment configuration including:
- Required variables presence check
- Type validation (string, number, boolean, url, email)
- Format validation (URLs, ports, connection strings)
- Value range checking (min/max for numbers)
- Enum value validation for restricted options
- Cross-variable dependency validation
- Security checks (no hardcoded secrets in code)
- Unused variable detection

**Generate Types:**
```bash
/env-config-manager generate-types --output=./types/env.d.ts
```
Generates TypeScript type definitions with:
- Interface definitions for process.env
- Type-safe environment variable access
- JSDoc comments with descriptions
- Enum types for restricted values
- Required vs optional property marking
- Default value documentation
- Environment-specific types
- Auto-completion support in IDEs

### Secrets Management

**HashiCorp Vault Integration:**
```bash
/env-config-manager vault --action=sync --path=secret/myapp --env=production
```
Manages secrets with Vault including:
- Secret reading from Vault paths
- Writing secrets to Vault with versioning
- Dynamic secret generation (database credentials)
- Lease management and renewal
- Token authentication and renewal
- AppRole and Kubernetes auth methods
- Secret rotation scheduling
- Audit log integration

**AWS Secrets Manager:**
```bash
/env-config-manager aws-secrets --region=us-east-1 --sync=true
```
Integrates with AWS Secrets Manager:
- Secret creation with KMS encryption
- Automatic secret rotation setup
- Version management and staging labels
- Resource-based access policies
- CloudFormation integration
- Cross-region replication
- Secret recovery and deletion
- Cost optimization recommendations

**Azure Key Vault:**
```bash
/env-config-manager azure-keyvault --vault=myapp-vault --managed-identity=true
```
Manages Azure Key Vault secrets with:
- Secret, key, and certificate management
- Managed identity authentication
- Soft-delete and purge protection
- Access policies and RBAC
- Secret versioning and backup
- Virtual network restrictions
- Private endpoint configuration
- Compliance and monitoring

### Configuration Patterns

**Multi-Environment Strategy:**
```bash
/env-config-manager multi-env --strategy=hierarchical --base=.env.base
```
Implements environment hierarchy with:
- Base configuration shared across environments
- Environment-specific overrides (.env.dev, .env.prod)
- Local development overrides (.env.local)
- Priority and merge strategies
- Environment detection logic
- Validation per environment
- Documentation generation
- Migration scripts between environments

**Configuration Schema:**
```bash
/env-config-manager schema --format=json-schema --output=./config.schema.json
```
Creates configuration schemas with:
- JSON Schema or YAML schema definition
- Required and optional fields
- Type constraints and validation rules
- Default values specification
- Description and examples
- Secret field marking
- Environment-specific requirements
- Version tracking

**Secret Encryption:**
```bash
/env-config-manager encrypt --method=age --public-key=./key.pub
```
Encrypts configuration files with:
- Age encryption for simplicity and security
- GPG encryption for traditional workflows
- KMS encryption for cloud-native apps
- Symmetric encryption for team sharing
- Key management and rotation
- Encrypted file versioning in git
- Decryption automation in CI/CD
- Emergency access procedures

### Security Features

**Secret Detection:**
```bash
/env-config-manager detect-secrets --scan=./src --prevent-commit=true
```
Scans for accidentally committed secrets:
- Pattern-based secret detection
- Entropy analysis for random strings
- API key and token recognition
- Private key detection
- Password pattern matching
- Database connection string scanning
- Pre-commit hook integration
- Historical commit scanning

**Access Control:**
```bash
/env-config-manager access-control --role=developer --env=production
```
Manages configuration access with:
- Role-based access control (RBAC)
- Environment-based restrictions
- Secret-level permissions
- Time-based access (temporary grants)
- Approval workflows for production
- Audit trail of all access
- IP allowlisting for sensitive environments
- Multi-factor authentication integration

**Secret Rotation:**
```bash
/env-config-manager rotate --secrets=DB_PASSWORD,API_KEY --schedule=30d
```
Automates secret rotation including:
- Scheduled rotation policies
- Zero-downtime rotation strategies
- Automatic application restart
- Multi-step rotation (dual secrets)
- Rollback capabilities
- Notification on rotation
- Rotation testing and validation
- Compliance reporting

## Code Generation Examples

### Environment Configuration (Node.js)
```javascript
// config/env.js
const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

// Load environment-specific configuration
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: path.resolve(__dirname, '../', envFile) });
dotenv.config({ path: path.resolve(__dirname, '../', '.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../', '.env') });

// Configuration schema
const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),

  PORT: Joi.number()
    .integer()
    .min(1024)
    .max(65535)
    .default(3000)
    .description('Server port number'),

  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgres', 'postgresql'] })
    .required()
    .description('PostgreSQL connection string'),

  REDIS_URL: Joi.string()
    .uri({ scheme: ['redis', 'rediss'] })
    .required()
    .description('Redis connection string'),

  JWT_SECRET: Joi.string()
    .min(32)
    .required()
    .description('JWT signing secret (min 32 characters)'),

  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+[dhms]$/)
    .default('7d')
    .description('JWT expiration time'),

  AWS_REGION: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    })
    .description('AWS region for services'),

  AWS_ACCESS_KEY_ID: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),

  AWS_SECRET_ACCESS_KEY: Joi.string()
    .when('NODE_ENV', {
      is: 'production',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),

  STRIPE_API_KEY: Joi.string()
    .pattern(/^sk_(test|live)_[a-zA-Z0-9]+$/)
    .required()
    .description('Stripe API key'),

  SENDGRID_API_KEY: Joi.string()
    .pattern(/^SG\.[a-zA-Z0-9_-]+$/)
    .required()
    .description('SendGrid API key'),

  API_RATE_LIMIT: Joi.number()
    .integer()
    .min(10)
    .max(10000)
    .default(100)
    .description('API rate limit per minute'),

  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'http', 'debug')
    .default('info')
    .description('Logging level'),

  CORS_ORIGIN: Joi.alternatives()
    .try(
      Joi.string().uri(),
      Joi.string().valid('*'),
      Joi.array().items(Joi.string().uri())
    )
    .default('*')
    .description('CORS allowed origins')
}).unknown(false);

// Validate environment variables
const { error, value: config } = envSchema.validate(process.env, {
  abortEarly: false,
  stripUnknown: true
});

if (error) {
  const errors = error.details.map(detail => detail.message).join('\n');
  throw new Error(`Environment validation failed:\n${errors}`);
}

// Export validated configuration
module.exports = {
  env: config.NODE_ENV,
  port: config.PORT,

  database: {
    url: config.DATABASE_URL
  },

  redis: {
    url: config.REDIS_URL
  },

  jwt: {
    secret: config.JWT_SECRET,
    expiresIn: config.JWT_EXPIRES_IN
  },

  aws: {
    region: config.AWS_REGION,
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
  },

  stripe: {
    apiKey: config.STRIPE_API_KEY
  },

  sendgrid: {
    apiKey: config.SENDGRID_API_KEY
  },

  api: {
    rateLimit: config.API_RATE_LIMIT
  },

  logging: {
    level: config.LOG_LEVEL
  },

  cors: {
    origin: config.CORS_ORIGIN
  }
};
```

### TypeScript Type Definitions
```typescript
// types/env.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** Application environment */
      NODE_ENV: 'development' | 'staging' | 'production' | 'test';

      /** Server port number (1024-65535) */
      PORT: string;

      /** PostgreSQL connection string */
      DATABASE_URL: string;

      /** Redis connection string */
      REDIS_URL: string;

      /** JWT signing secret (minimum 32 characters) */
      JWT_SECRET: string;

      /** JWT expiration time (e.g., "7d", "24h") */
      JWT_EXPIRES_IN?: string;

      /** AWS region for services (required in production) */
      AWS_REGION?: string;

      /** AWS access key ID (required in production) */
      AWS_ACCESS_KEY_ID?: string;

      /** AWS secret access key (required in production) */
      AWS_SECRET_ACCESS_KEY?: string;

      /** Stripe API key (sk_test_* or sk_live_*) */
      STRIPE_API_KEY: string;

      /** SendGrid API key (SG.*) */
      SENDGRID_API_KEY: string;

      /** API rate limit per minute (10-10000) */
      API_RATE_LIMIT?: string;

      /** Logging level */
      LOG_LEVEL?: 'error' | 'warn' | 'info' | 'http' | 'debug';

      /** CORS allowed origins */
      CORS_ORIGIN?: string;
    }
  }
}

export {};
```

### Vault Integration (Go)
```go
package config

import (
    "context"
    "fmt"
    "log"
    "os"
    "time"

    vault "github.com/hashicorp/vault/api"
)

type VaultConfig struct {
    client    *vault.Client
    mountPath string
    secretPath string
}

func NewVaultConfig() (*VaultConfig, error) {
    config := vault.DefaultConfig()
    config.Address = os.Getenv("VAULT_ADDR")

    client, err := vault.NewClient(config)
    if err != nil {
        return nil, fmt.Errorf("failed to create vault client: %w", err)
    }

    // Authenticate using token
    token := os.Getenv("VAULT_TOKEN")
    if token != "" {
        client.SetToken(token)
    } else {
        // Authenticate using AppRole
        if err := authenticateAppRole(client); err != nil {
            return nil, fmt.Errorf("vault authentication failed: %w", err)
        }
    }

    return &VaultConfig{
        client:     client,
        mountPath:  "secret",
        secretPath: "myapp",
    }, nil
}

func authenticateAppRole(client *vault.Client) error {
    roleID := os.Getenv("VAULT_ROLE_ID")
    secretID := os.Getenv("VAULT_SECRET_ID")

    data := map[string]interface{}{
        "role_id":   roleID,
        "secret_id": secretID,
    }

    resp, err := client.Logical().Write("auth/approle/login", data)
    if err != nil {
        return err
    }

    client.SetToken(resp.Auth.ClientToken)

    // Start token renewal goroutine
    go renewToken(client, resp.Auth.LeaseDuration)

    return nil
}

func renewToken(client *vault.Client, leaseDuration int) {
    ticker := time.NewTicker(time.Duration(leaseDuration/2) * time.Second)
    defer ticker.Stop()

    for range ticker.C {
        secret, err := client.Auth().Token().RenewSelf(leaseDuration)
        if err != nil {
            log.Printf("Failed to renew token: %v", err)
            continue
        }
        log.Printf("Token renewed, new TTL: %d seconds", secret.Auth.LeaseDuration)
    }
}

func (vc *VaultConfig) GetSecret(key string) (string, error) {
    path := fmt.Sprintf("%s/data/%s", vc.mountPath, vc.secretPath)

    secret, err := vc.client.Logical().Read(path)
    if err != nil {
        return "", fmt.Errorf("failed to read secret: %w", err)
    }

    if secret == nil || secret.Data == nil {
        return "", fmt.Errorf("secret not found")
    }

    // KV v2 stores data under "data" key
    data, ok := secret.Data["data"].(map[string]interface{})
    if !ok {
        return "", fmt.Errorf("invalid secret format")
    }

    value, ok := data[key].(string)
    if !ok {
        return "", fmt.Errorf("secret key not found: %s", key)
    }

    return value, nil
}

func (vc *VaultConfig) SetSecret(key, value string) error {
    path := fmt.Sprintf("%s/data/%s", vc.mountPath, vc.secretPath)

    // First, read existing secrets to preserve them
    existing, err := vc.client.Logical().Read(path)
    if err != nil {
        return fmt.Errorf("failed to read existing secrets: %w", err)
    }

    data := make(map[string]interface{})
    if existing != nil && existing.Data != nil {
        if existingData, ok := existing.Data["data"].(map[string]interface{}); ok {
            data = existingData
        }
    }

    // Update with new value
    data[key] = value

    // Write back to vault
    payload := map[string]interface{}{
        "data": data,
    }

    _, err = vc.client.Logical().Write(path, payload)
    if err != nil {
        return fmt.Errorf("failed to write secret: %w", err)
    }

    return nil
}

func (vc *VaultConfig) RotateSecret(ctx context.Context, key string, generator func() (string, error)) error {
    // Generate new secret value
    newValue, err := generator()
    if err != nil {
        return fmt.Errorf("failed to generate new secret: %w", err)
    }

    // Store new secret
    if err := vc.SetSecret(key, newValue); err != nil {
        return fmt.Errorf("failed to store new secret: %w", err)
    }

    log.Printf("Secret %s rotated successfully", key)
    return nil
}

// Example usage
func LoadConfig() (*AppConfig, error) {
    vaultConfig, err := NewVaultConfig()
    if err != nil {
        return nil, err
    }

    dbPassword, err := vaultConfig.GetSecret("DB_PASSWORD")
    if err != nil {
        return nil, err
    }

    apiKey, err := vaultConfig.GetSecret("API_KEY")
    if err != nil {
        return nil, err
    }

    return &AppConfig{
        DatabasePassword: dbPassword,
        APIKey:          apiKey,
    }, nil
}
```

## Best Practices

### Environment File Management
- **Never Commit Secrets**: Always add .env files to .gitignore
- **Use .env.example**: Provide template with variable names (no values)
- **Environment Hierarchy**: Base configuration + environment-specific overrides
- **Type Validation**: Validate types and formats, not just presence
- **Documentation**: Document each variable's purpose and format

### Secrets Management
- **Centralized Storage**: Store secrets in dedicated secret managers
- **Least Privilege**: Grant minimal necessary access to secrets
- **Rotation Policy**: Implement regular secret rotation (30-90 days)
- **Encryption at Rest**: Always encrypt secrets in storage
- **Audit Logging**: Track all secret access and modifications

### Security Best Practices
- **Secret Detection**: Scan code for accidentally committed secrets
- **Access Control**: Implement RBAC for configuration access
- **Encryption in Transit**: Use TLS for all secret retrieval
- **Emergency Procedures**: Document secret compromise response
- **Compliance**: Ensure SOC2, HIPAA, PCI-DSS compliance as needed

### Development Workflow
- **Local Overrides**: Use .env.local for developer-specific settings
- **CI/CD Integration**: Inject secrets from secret manager in pipelines
- **Testing**: Use separate secrets for testing environments
- **Onboarding**: Simplify new developer setup with clear documentation
- **Version Control**: Track configuration schema changes in git

---

**ClaudeForge Environment Config Manager** - Enterprise-grade configuration and secrets management with comprehensive validation, multi-platform integration, and security-first architecture for modern applications.
