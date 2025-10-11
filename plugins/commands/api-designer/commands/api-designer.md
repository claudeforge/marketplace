---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge API design specialist for RESTful APIs, GraphQL schemas, and microservice architecture.
---

# ClaudeForge API Designer

ClaudeForge intelligent API design system that creates professional, scalable, and well-documented APIs following industry best practices with automated code generation and comprehensive testing capabilities.

## Purpose

Transform API development from manual effort to intelligent automation that ensures consistency, scalability, and maintainability across modern application architectures.

## Features

- **RESTful Design**: Generate RESTful APIs following proper HTTP methods and status codes with OpenAPI specification
- **GraphQL Schemas**: Create type-safe GraphQL schemas with optimized resolvers and query planning
- **Documentation**: Auto-generate comprehensive API documentation with interactive examples
- **Validation**: Implement request/response validation and error handling with JSON Schema
- **Security**: Add authentication, authorization, and rate limiting with enterprise-grade security
- **Testing**: Automated API testing with comprehensive test coverage and mock data generation
- **Versioning**: Intelligent API versioning strategies with backward compatibility
- **Performance**: Built-in performance optimization and caching strategies

## Usage

```bash
/api-designer [type] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current scope)

### API Types

**RESTful API Design:**
```bash
/api-designer rest --entity=User --operations=CRUD
```
Generates complete RESTful API with CRUD operations for User entity including:
- Proper HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Status code handling (200, 201, 400, 404, 500)
- Request/response models and validation
- Error handling and logging
- Database integration patterns

**GraphQL Schema Design:**
```bash
/api-designer graphql --schema=Ecommerce --depth=3
```
Creates comprehensive GraphQL schema with:
- Type definitions with proper relationships
- Efficient resolvers with N+1 query prevention
- Query and mutation operations
- Subscription capabilities for real-time updates
- Schema validation and documentation

**Microservice Architecture:**
```bash
/api-designer microservice --name=UserService --pattern=DDD
```
Designs microservice with:
- Domain-driven design patterns
- Event-driven communication
- Service discovery and registration
- Circuit breaker patterns
- Distributed tracing and monitoring

### Advanced Options

**Security Configuration:**
```bash
/api-designer rest --security=JWT,OAuth2 --rate-limit=1000/hour
```
Implements enterprise security including:
- JWT token validation and refresh
- OAuth2 authorization flows
- API key management
- Rate limiting and throttling
- CORS configuration
- Input sanitization and validation

**Database Integration:**
```bash
/api-designer rest --database=PostgreSQL --orm=TypeORM --migrations=true
```
Generates database integration with:
- ORM models and relationships
- Migration scripts for schema changes
- Connection pooling and optimization
- Transaction management
- Query optimization strategies

**Documentation Generation:**
```bash
/api-designer rest --docs=Swagger,Postman --examples=true
```
Creates comprehensive documentation including:
- Interactive Swagger UI
- Postman collection for testing
- API usage examples and tutorials
- Response schema documentation
- Authentication flow examples

## Design Principles

### RESTful API Standards
- **Resource-Oriented Design**: Clear, intuitive resource naming and hierarchy
- **HTTP Semantics**: Proper use of HTTP methods and status codes
- **Stateless Operations**: Each request contains all necessary information
- **Hypermedia**: HATEOAS implementation for API discoverability
- **Version Management**: Semantic versioning with backward compatibility

### GraphQL Best Practices
- **Schema Design**: Efficient schema with minimal query complexity
- **Resolver Optimization**: Batching and caching for performance
- **Security**: Query depth limiting and cost analysis
- **Type Safety**: Strong typing with comprehensive validation
- **Performance**: DataLoader implementation for N+1 prevention

### Microservice Patterns
- **Service Boundaries**: Clear domain separation with bounded contexts
- **Communication**: Event-driven architecture with message queues
- **Data Management**: Database per service pattern with proper synchronization
- **Resilience**: Circuit breakers, retries, and fallback mechanisms
- **Observability**: Distributed tracing and centralized monitoring

## Code Generation Templates

### RESTful Controller Example
```typescript
@Controller('/api/v1/users')
@ApiTags('Users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully', type: [UserResponseDto] })
  async findAll(@Query() query: FindUsersDto): Promise<UserResponseDto[]> {
    return this.userService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }
}
```

### GraphQL Resolver Example
```typescript
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User, { name: 'user' })
  async getUser(@Args('id', { type: () => ID }) id: string): Promise<User> {
    return this.userService.findById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @ResolveField(() => [Post])
  async posts(@Parent() user: User): Promise<Post[]> {
    return this.userService.findUserPosts(user.id);
  }
}
```

## Testing & Quality Assurance

### Automated Testing
- **Unit Tests**: Comprehensive test coverage for all API endpoints
- **Integration Tests**: Database and external service integration testing
- **Contract Testing**: API contract validation with consumer-driven testing
- **Load Testing**: Performance testing with realistic traffic patterns
- **Security Testing**: Vulnerability scanning and penetration testing

### Quality Metrics
- **Code Coverage**: Minimum 90% coverage requirement
- **Performance Benchmarks**: Response time and throughput targets
- **Security Score**: Automated security vulnerability assessment
- **Documentation Quality**: API documentation completeness and accuracy
- **Compliance**: Industry standard compliance validation (OAuth2, OpenAPI)

## Integration Capabilities

### Development Tools
- **IDE Integration**: VS Code, IntelliJ, and other IDE plugins
- **CLI Tools**: Command-line interface for API generation and testing
- **CI/CD Integration**: GitHub Actions, GitLab CI, Jenkins pipelines
- **Version Control**: Git integration with automated deployment

### Monitoring & Analytics
- **API Analytics**: Usage metrics, performance monitoring, and error tracking
- **Logging**: Structured logging with correlation IDs
- **Alerting**: Proactive monitoring with customizable alert rules
- **Dashboards**: Real-time visualization of API health and performance

### Third-party Integrations
- **Authentication**: Auth0, Firebase Auth, AWS Cognito integration
- **Databases**: PostgreSQL, MongoDB, MySQL, Redis support
- **Message Queues**: RabbitMQ, Kafka, AWS SQS integration
- **Cloud Services**: AWS, Azure, GCP deployment and management

---

**ClaudeForge API Designer** - Enterprise-grade API design with intelligent automation, comprehensive testing, and seamless integration capabilities.