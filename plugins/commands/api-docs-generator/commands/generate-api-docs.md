---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge API documentation generator for creating comprehensive, interactive API docs with OpenAPI/Swagger specifications.
---

# ClaudeForge API Documentation Generator

ClaudeForge intelligent API documentation system that automatically generates comprehensive, interactive API documentation from source code analysis with OpenAPI 3.0 specification support.

## Purpose

Transform API documentation from manual effort to intelligent automation that ensures accuracy, consistency, and maintainability across RESTful APIs, GraphQL schemas, and microservice architectures.

## Features

- **Automatic Discovery**: Scan codebase to identify API endpoints, routes, and controllers
- **OpenAPI Specification**: Generate OpenAPI 3.0/Swagger 2.0 compliant documentation
- **Interactive Documentation**: Create Swagger UI and ReDoc for interactive API exploration
- **Type Safety**: Generate TypeScript definitions and validation schemas
- **Authentication Support**: Document OAuth2, JWT, API key, and custom authentication methods
- **Request/Response Examples**: Generate realistic examples for all endpoints
- **Version Management**: Handle API versioning and deprecation documentation
- **Multi-Format Export**: Export to HTML, PDF, Markdown, and Postman collections

## Usage

```bash
/generate-api-docs [options] [target]
```

Target: $ARGUMENTS (if specified, otherwise analyze current project)

### Command Options

**Basic Documentation Generation:**
```bash
/generate-api-docs --format=swagger --output=./docs
```
Generates comprehensive API documentation including:
- OpenAPI 3.0 specification file
- Interactive Swagger UI
- ReDoc documentation
- TypeScript client definitions
- Postman collection for testing

**Advanced Options:**
```bash
/generate-api-docs --format=openapi --version=3.0 --auth=JWT --examples=true
```
Creates enhanced documentation with:
- Authentication flow documentation
- Request/response examples with real data
- Error handling and status code documentation
- Rate limiting and usage policies
- SDK generation support

### Context Analysis

**API Route Discovery:**
- Use Glob to find API routes: Search for files in `*/routes/*` and `*/api/*` directories with `.js` extension
- Current API files: @$ARGUMENTS
- Framework detection: Express.js, Fastify, Koa, NestJS, etc.
- Use Glob to find database models: Search in `*/models/*` and `*/schemas/*` directories

## Documentation Standards

### OpenAPI 3.0 Specification
- **Info Section**: Complete API metadata, contact information, license
- **Servers**: Multiple environment URLs (development, staging, production)
- **Paths**: All endpoints with proper HTTP methods and parameters
- **Components**: Reusable schemas, responses, parameters, examples
- **Security**: Authentication and authorization schemes
- **Tags**: Logical grouping of endpoints for better organization

### Quality Assurance
- **Completeness**: All endpoints documented with required parameters
- **Accuracy**: Documentation matches actual implementation
- **Consistency**: Uniform formatting and style across all endpoints
- **Usability**: Clear descriptions and practical examples
- **Maintainability**: Easy to update as API evolves

### Documentation Sections

**1. API Overview**
- Introduction and purpose
- Authentication requirements
- Rate limiting and usage policies
- Base URLs and versioning information
- Supported data formats and content types

**2. Authentication & Authorization**
- Authentication methods (OAuth2, JWT, API Keys)
- Authorization scopes and permissions
- Token acquisition and refresh processes
- Error handling for authentication failures

**3. Endpoints Documentation**
For each endpoint:
- HTTP method and full URL path
- Description of endpoint purpose and behavior
- Path parameters, query parameters, headers
- Request body schema with validation rules
- Response schemas for all status codes
- Error responses and troubleshooting
- Rate limits and usage constraints

**4. Data Models**
- Complete schema definitions
- Field descriptions and validation rules
- Example values and formats
- Relationship between models
- Enum values and constraints

**5. SDK & Integration**
- Code examples in multiple languages
- SDK installation and usage
- Webhook documentation (if applicable)
- Integration best practices
- Testing and debugging guides

## Generated Output Files

**OpenAPI Specification:**
- `openapi.json` - Complete OpenAPI 3.0 specification
- `openapi.yaml` - YAML format for better readability
- Validation against OpenAPI 3.0 schema

**Interactive Documentation:**
- `swagger-ui.html` - Interactive API exploration interface
- `redoc.html` - Three-panel API documentation
- `api-reference.md` - Markdown documentation

**Developer Resources:**
- `types.d.ts` - TypeScript type definitions
- `postman-collection.json` - Postman collection for testing
- `client-sdk.js` - Generated JavaScript client
- `examples/` - Code examples in multiple languages

## ClaudeForge Integration

**Repository URL:** https://github.com/claudeforge/marketplace/tree/main/plugins/api-docs-generator

**ClaudeForge Standards:**
- Generate production-ready documentation that meets enterprise standards
- Ensure security information is accurately documented
- Provide clear, actionable examples for developers
- Maintain consistency with ClaudeForge marketplace quality standards
- Support continuous integration and automated documentation updates

Your goal is to create comprehensive, accurate, and user-friendly API documentation that serves as the definitive reference for API consumers, ensuring seamless integration and developer experience.

Remember: Well-documented APIs are easier to adopt, integrate, and maintain. Through ClaudeForge automated documentation generation, you create API documentation that enhances developer productivity and API adoption.