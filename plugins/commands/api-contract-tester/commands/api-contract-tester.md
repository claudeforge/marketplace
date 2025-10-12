---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge API contract testing and validation with Pact, Postman, and consumer-driven contract strategies.
---

# ClaudeForge API Contract Tester

ClaudeForge intelligent API contract testing system that ensures API compatibility, validates contracts between consumers and providers, and maintains backward compatibility through comprehensive consumer-driven contract testing strategies.

## Purpose

Transform API testing from manual validation to intelligent automation that ensures contract compliance, prevents breaking changes, and maintains seamless integration between microservices and external consumers.

## Features

- **Contract Testing**: Consumer-driven contract testing with Pact and other frameworks
- **Schema Validation**: JSON Schema, OpenAPI, and GraphQL schema validation
- **API Testing**: Automated REST and GraphQL API testing with comprehensive coverage
- **Backward Compatibility**: Detect breaking changes before deployment
- **Mock Services**: Generate mock servers from contracts for parallel development
- **Contract Publishing**: Centralized contract registry with versioning
- **CI/CD Integration**: Seamless integration with continuous deployment pipelines
- **Detailed Reporting**: Comprehensive test reports with failure analysis

## Usage

```bash
/api-contract-tester [type] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current scope)

### Contract Testing Types

**Pact Consumer Testing:**
```bash
/api-contract-tester pact-consumer --service=UserService --provider=AuthAPI
```
Generates consumer-side Pact tests with:
- Consumer expectations definition
- Request/response matching rules
- State management for test scenarios
- Pact file generation for provider verification
- Mock provider server for isolated testing
- Flexible matching (type, regex, equality)
- Header and query parameter validation
- JSON body structure verification

**Pact Provider Testing:**
```bash
/api-contract-tester pact-provider --service=AuthAPI --contracts=./pacts
```
Verifies provider against consumer contracts with:
- Contract verification against running service
- State setup for provider verification
- Provider state callbacks implementation
- Detailed verification reports
- Breaking change detection
- Version compatibility checking
- Pact broker integration
- Automated verification in CI/CD

**Postman Collection Testing:**
```bash
/api-contract-tester postman --collection=./api-tests.json --environment=staging
```
Executes Postman collection tests including:
- Environment variable management
- Pre-request scripts execution
- Response assertions and validation
- Test script execution
- Collection runner automation
- Data-driven testing with CSV/JSON
- Authentication flows (OAuth, JWT, API Key)
- Chained requests with variable passing

### Schema Validation

**OpenAPI Validation:**
```bash
/api-contract-tester openapi --spec=./openapi.yaml --endpoint=/api/users
```
Validates API against OpenAPI specification:
- Request validation (path, query, body, headers)
- Response validation (status, headers, body)
- Schema compliance checking
- Required field validation
- Data type enforcement
- Format validation (email, uri, date-time)
- Enum value verification
- Range and length constraints

**JSON Schema Validation:**
```bash
/api-contract-tester json-schema --schema=./user.schema.json --data=./response.json
```
Performs JSON Schema validation with:
- Schema draft version support (draft-07, 2019-09, 2020-12)
- Type validation (string, number, object, array)
- Required properties enforcement
- Additional properties control
- Pattern matching with regex
- Format validators (email, hostname, ipv4, uuid)
- Nested schema validation
- Conditional schema application

**GraphQL Schema Validation:**
```bash
/api-contract-tester graphql --schema=./schema.graphql --query=./queries/*.graphql
```
Validates GraphQL queries and mutations:
- Query syntax validation
- Schema type checking
- Field existence verification
- Argument type validation
- Fragment usage validation
- Directive usage verification
- Deprecated field detection
- Query complexity analysis

### Consumer-Driven Contract Testing

**Contract Definition:**
```bash
/api-contract-tester define-contract --consumer=WebApp --provider=OrderAPI
```
Creates contract definitions with:
- Consumer expectations specification
- Request format definition (method, path, headers, body)
- Response expectations (status, headers, body)
- State preconditions for scenarios
- Matching rules for flexible validation
- Example values for documentation
- Contract versioning strategy
- Change log documentation

**Contract Verification:**
```bash
/api-contract-tester verify-contract --provider=OrderAPI --version=1.2.0
```
Verifies provider against contracts including:
- All consumer contract verification
- State setup for test scenarios
- Concurrent verification execution
- Detailed mismatch reporting
- Version compatibility matrix
- Breaking change alerts
- Regression detection
- Performance benchmarking

**Contract Publishing:**
```bash
/api-contract-tester publish --broker=https://pact-broker.example.com --version=1.2.0
```
Publishes contracts to broker with:
- Contract upload to centralized registry
- Version tagging and labeling
- Branch-specific contracts
- Environment deployment tracking
- Contract diffing and comparison
- Consumer notification on changes
- Webhook triggers for CI/CD
- Access control and authentication

### Integration Testing

**REST API Testing:**
```bash
/api-contract-tester rest --baseUrl=https://api.example.com --tests=./tests/*.spec.js
```
Executes REST API tests with:
- HTTP method testing (GET, POST, PUT, DELETE, PATCH)
- Status code assertions
- Response time validation
- Header validation
- Cookie handling and assertion
- Authentication and authorization
- Rate limiting verification
- Error handling validation
- Retry and timeout configuration

**GraphQL API Testing:**
```bash
/api-contract-tester graphql --endpoint=https://api.example.com/graphql
```
Tests GraphQL endpoints including:
- Query execution and validation
- Mutation testing with side effects
- Subscription testing for real-time updates
- Error handling and error codes
- Partial response handling
- Batch query execution
- Query performance monitoring
- Cache behavior verification

**Microservice Integration:**
```bash
/api-contract-tester integration --services=./docker-compose.yml
```
Performs integration testing with:
- Multi-service orchestration
- Service dependency management
- Contract verification across services
- End-to-end workflow testing
- Message queue testing
- Event-driven architecture validation
- Service discovery verification
- Circuit breaker testing

## Code Generation Examples

### Pact Consumer Test (JavaScript)
```javascript
const { Pact } = require('@pact-foundation/pact');
const { like, eachLike, term } = require('@pact-foundation/pact').Matchers;
const path = require('path');

describe('User Service Consumer', () => {
  const provider = new Pact({
    consumer: 'WebApp',
    provider: 'UserService',
    port: 8080,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'INFO'
  });

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe('GET /users/:id', () => {
    beforeEach(() => {
      return provider.addInteraction({
        state: 'user with ID 123 exists',
        uponReceiving: 'a request for user 123',
        withRequest: {
          method: 'GET',
          path: '/users/123',
          headers: {
            'Accept': 'application/json',
            'Authorization': term({
              matcher: 'Bearer \\w+',
              generate: 'Bearer token123'
            })
          }
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            id: like(123),
            username: like('john_doe'),
            email: term({
              matcher: '\\S+@\\S+\\.\\S+',
              generate: 'john@example.com'
            }),
            profile: {
              firstName: like('John'),
              lastName: like('Doe'),
              age: like(30)
            },
            roles: eachLike('user'),
            createdAt: term({
              matcher: '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}',
              generate: '2023-01-15T10:30:00'
            })
          }
        }
      });
    });

    it('returns user successfully', async () => {
      const response = await fetch('http://localhost:8080/users/123', {
        headers: {
          'Authorization': 'Bearer token123',
          'Accept': 'application/json'
        }
      });

      expect(response.status).toBe(200);
      const user = await response.json();
      expect(user.id).toBe(123);
      expect(user.email).toMatch(/\S+@\S+\.\S+/);
    });
  });

  describe('POST /users', () => {
    beforeEach(() => {
      return provider.addInteraction({
        state: 'no existing user with email john@example.com',
        uponReceiving: 'a request to create a new user',
        withRequest: {
          method: 'POST',
          path: '/users',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': term({
              matcher: 'Bearer \\w+',
              generate: 'Bearer token123'
            })
          },
          body: {
            username: 'john_doe',
            email: 'john@example.com',
            password: like('securePassword123'),
            profile: {
              firstName: 'John',
              lastName: 'Doe'
            }
          }
        },
        willRespondWith: {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            'Location': term({
              matcher: '/users/\\d+',
              generate: '/users/123'
            })
          },
          body: {
            id: like(123),
            username: 'john_doe',
            email: 'john@example.com',
            createdAt: term({
              matcher: '\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}',
              generate: '2023-01-15T10:30:00'
            })
          }
        }
      });
    });

    it('creates user successfully', async () => {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123'
        },
        body: JSON.stringify({
          username: 'john_doe',
          email: 'john@example.com',
          password: 'securePassword123',
          profile: { firstName: 'John', lastName: 'Doe' }
        })
      });

      expect(response.status).toBe(201);
      expect(response.headers.get('Location')).toMatch(/\/users\/\d+/);
    });
  });
});
```

### Pact Provider Verification (Node.js)
```javascript
const { Verifier } = require('@pact-foundation/pact');
const path = require('path');
const server = require('./server');

describe('User Service Provider', () => {
  let app;
  const PORT = 8081;

  beforeAll(async () => {
    app = await server.listen(PORT);
  });

  afterAll(async () => {
    await app.close();
  });

  it('validates expectations of WebApp', () => {
    const opts = {
      provider: 'UserService',
      providerBaseUrl: `http://localhost:${PORT}`,
      pactBrokerUrl: 'https://pact-broker.example.com',
      pactBrokerToken: process.env.PACT_BROKER_TOKEN,
      publishVerificationResult: true,
      providerVersion: process.env.GIT_COMMIT,
      providerVersionBranch: process.env.GIT_BRANCH,
      consumerVersionSelectors: [
        { mainBranch: true },
        { deployedOrReleased: true }
      ],
      stateHandlers: {
        'user with ID 123 exists': async () => {
          // Setup: Create user with ID 123 in test database
          await database.users.create({
            id: 123,
            username: 'john_doe',
            email: 'john@example.com',
            profile: { firstName: 'John', lastName: 'Doe', age: 30 },
            roles: ['user'],
            createdAt: '2023-01-15T10:30:00'
          });
        },
        'no existing user with email john@example.com': async () => {
          // Setup: Ensure no user exists with this email
          await database.users.deleteMany({ email: 'john@example.com' });
        }
      },
      beforeEach: async () => {
        // Clean database before each verification
        await database.reset();
      }
    };

    return new Verifier(opts).verifyProvider();
  });
});
```

### OpenAPI Validation (Python)
```python
from openapi_spec_validator import validate_spec
from openapi_core import create_spec
from openapi_core.validation.request.validators import RequestValidator
from openapi_core.validation.response.validators import ResponseValidator
import yaml
import requests

class APIContractTester:
    def __init__(self, spec_path, base_url):
        with open(spec_path, 'r') as f:
            self.spec_dict = yaml.safe_load(f)

        # Validate OpenAPI spec is valid
        validate_spec(self.spec_dict)

        self.spec = create_spec(self.spec_dict)
        self.base_url = base_url
        self.request_validator = RequestValidator(self.spec)
        self.response_validator = ResponseValidator(self.spec)

    def test_endpoint(self, method, path, headers=None, body=None, expected_status=200):
        """Test API endpoint against OpenAPI contract"""

        # Build full URL
        url = f"{self.base_url}{path}"

        # Validate request against OpenAPI spec
        request = self._build_request(method, path, headers, body)
        request_validation = self.request_validator.validate(request)

        if request_validation.errors:
            raise ValueError(f"Request validation failed: {request_validation.errors}")

        # Make actual HTTP request
        response = requests.request(method, url, headers=headers, json=body)

        # Validate response against OpenAPI spec
        openapi_response = self._build_response(response, path, method)
        response_validation = self.response_validator.validate(openapi_response)

        if response_validation.errors:
            raise ValueError(f"Response validation failed: {response_validation.errors}")

        # Assert expected status code
        assert response.status_code == expected_status, \
            f"Expected {expected_status}, got {response.status_code}"

        return response

    def test_all_endpoints(self):
        """Test all endpoints defined in OpenAPI spec"""
        results = []

        for path, path_item in self.spec_dict['paths'].items():
            for method, operation in path_item.items():
                if method in ['get', 'post', 'put', 'delete', 'patch']:
                    try:
                        print(f"Testing {method.upper()} {path}")
                        self.test_endpoint(method.upper(), path)
                        results.append({
                            'path': path,
                            'method': method,
                            'status': 'PASS'
                        })
                    except Exception as e:
                        results.append({
                            'path': path,
                            'method': method,
                            'status': 'FAIL',
                            'error': str(e)
                        })

        return results

    def validate_breaking_changes(self, old_spec_path):
        """Detect breaking changes between API versions"""
        with open(old_spec_path, 'r') as f:
            old_spec = yaml.safe_load(f)

        breaking_changes = []

        # Check for removed endpoints
        for path in old_spec['paths']:
            if path not in self.spec_dict['paths']:
                breaking_changes.append(f"Removed endpoint: {path}")

        # Check for removed operations
        for path, operations in old_spec['paths'].items():
            if path in self.spec_dict['paths']:
                for method in operations:
                    if method not in self.spec_dict['paths'][path]:
                        breaking_changes.append(f"Removed operation: {method.upper()} {path}")

        return breaking_changes

# Usage example
tester = APIContractTester('./openapi.yaml', 'https://api.example.com')
results = tester.test_all_endpoints()

for result in results:
    print(f"{result['method'].upper()} {result['path']}: {result['status']}")
```

## Best Practices

### Contract Testing Strategy
- **Consumer-Driven**: Let consumers define their expectations
- **Version Compatibility**: Test against multiple provider versions
- **State Management**: Define clear provider states for scenarios
- **Matching Flexibility**: Use type matching over exact matching where appropriate
- **Regular Verification**: Run provider verification on every deployment

### CI/CD Integration
- **Automated Execution**: Run contract tests in CI pipeline
- **Pact Broker**: Use centralized contract registry for collaboration
- **Can-I-Deploy**: Check contract compatibility before deployment
- **Version Tagging**: Tag contracts with deployment environments
- **Webhook Triggers**: Trigger provider verification on consumer changes

### Schema Validation
- **Comprehensive Coverage**: Validate all request/response combinations
- **Error Scenarios**: Test error responses and edge cases
- **Backward Compatibility**: Detect breaking changes before release
- **Documentation Sync**: Keep schemas synchronized with actual API
- **Version Strategy**: Maintain multiple schema versions for gradual migration

### Testing Best Practices
- **Isolated Tests**: Each test should be independent
- **Fast Execution**: Keep test execution time minimal
- **Clear Assertions**: Make test failures easy to understand
- **Test Data**: Use realistic test data that covers edge cases
- **Mocking Strategy**: Mock external dependencies appropriately

---

**ClaudeForge API Contract Tester** - Enterprise-grade API contract testing with consumer-driven strategies, comprehensive validation, and seamless CI/CD integration for reliable microservice architectures.
