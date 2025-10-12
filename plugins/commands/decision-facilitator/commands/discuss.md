---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: Facilitate technical discussions and decision-making through structured questioning and analysis
---

# Decision Facilitator Command

Guide technical discussions and facilitate decision-making through structured analysis and collaborative problem-solving.

## Usage

```bash
/discuss <topic_or_question>
```

**Examples:**
```bash
/discuss "Should we migrate from REST to GraphQL?"
/discuss "Which state management library: Redux vs MobX?"
/discuss "Microservices vs Monolith architecture"
/discuss database indexing strategy for user search
```

## What This Command Does

Facilitates decisions by:

1. **Structured Analysis**: Break down complex topics into manageable components
2. **Multi-Perspective Exploration**: Consider technical, business, and operational angles
3. **Trade-off Evaluation**: Compare pros/cons of different approaches
4. **Consensus Building**: Help teams align on decisions
5. **Documentation**: Capture decision rationale for future reference

## Discussion Framework

### Step 1: Define the Decision

Clarify what needs to be decided:

```markdown
**Decision Topic**: Choose authentication strategy

**Context**:
- Current: Session-based auth with cookies
- Options: JWT, OAuth2, Session tokens
- Constraints: Must support mobile apps

**Stakeholders**:
- Engineering team (implementation)
- Product team (user experience)
- Security team (compliance)

**Timeline**: Decision needed by end of sprint
```

### Step 2: Gather Information

Collect relevant facts and requirements:

**Technical Requirements**:
- Performance targets (response time, throughput)
- Scalability needs (expected user growth)
- Integration requirements (existing systems)
- Security standards (compliance, regulations)
- Maintenance considerations (team expertise)

**Business Requirements**:
- Budget constraints
- Time to market
- User experience impact
- Competitive positioning
- Long-term strategy

**Current State Assessment**:
- What works well now?
- What are the pain points?
- What triggered this decision?
- What's the cost of not changing?

### Step 3: Explore Options

Systematically evaluate alternatives:

```markdown
## Option 1: JWT Authentication

**Pros**:
- Stateless - scales horizontally easily
- Works well with mobile apps and SPAs
- Industry standard with good library support
- No server-side session storage needed

**Cons**:
- Cannot invalidate tokens before expiry
- Token size larger than session IDs
- Requires careful secret management
- Refresh token strategy adds complexity

**Implementation Effort**: Medium (2-3 weeks)
**Maintenance Burden**: Low
**Team Familiarity**: High

## Option 2: OAuth2 with Third-Party Provider

**Pros**:
- Offload auth complexity to provider
- Users can use existing accounts (Google, GitHub)
- Professional security team maintains it
- Reduces our liability

**Cons**:
- Vendor lock-in risk
- Depends on external service availability
- Users without accounts need fallback
- Monthly costs scale with users

**Implementation Effort**: Low (1 week)
**Maintenance Burden**: Very Low
**Team Familiarity**: Medium
```

### Step 4: Evaluate Trade-offs

Compare options across key dimensions:

```markdown
| Criteria          | JWT        | OAuth2     | Session    |
|-------------------|------------|------------|------------|
| Scalability       | Excellent  | Good       | Fair       |
| Security          | Good       | Excellent  | Good       |
| Mobile Support    | Excellent  | Excellent  | Poor       |
| Implementation    | Medium     | Easy       | Easy       |
| Cost              | Low        | Medium     | Low        |
| User Experience   | Good       | Excellent  | Good       |
| Team Expertise    | High       | Medium     | High       |

**Winner**: JWT - Best balance for our needs
```

### Step 5: Make Recommendation

Provide clear recommendation with rationale:

```markdown
## Recommendation: Implement JWT Authentication

**Decision**: Adopt JWT with refresh token rotation

**Rationale**:
1. Meets mobile app requirements (stateless)
2. Team has strong JWT experience
3. Scalability aligns with growth projections
4. Lower long-term costs than OAuth2 provider
5. Maintain control over auth flow

**Implementation Plan**:
- Week 1: JWT library integration and basic auth
- Week 2: Refresh token rotation and security
- Week 3: Testing and documentation
- Week 4: Gradual rollout with feature flags

**Success Metrics**:
- Auth response time <100ms
- Zero security incidents in first 3 months
- 99.9% auth service uptime
- Team can handle auth issues independently

**Risks & Mitigation**:
- Risk: Token invalidation complexity
  Mitigation: Implement short-lived access tokens (15min)
- Risk: Secret management
  Mitigation: Use AWS Secrets Manager, rotate regularly
```

## Question Frameworks

### For Architecture Decisions

```markdown
**Scalability Questions**:
- How many users in 1 year? 5 years?
- What's peak vs average load?
- Geographic distribution of users?
- Data volume growth projections?

**Technical Questions**:
- Team expertise with options?
- Integration with existing systems?
- Testing and debugging complexity?
- Deployment and rollback strategy?

**Business Questions**:
- Total cost of ownership?
- Time to production?
- Impact on user experience?
- Competitive differentiation?
```

### For Technology Selection

```markdown
**Maturity Assessment**:
- How long has it existed?
- Production usage at scale?
- Community size and activity?
- Enterprise adoption examples?

**Ecosystem Evaluation**:
- Library and tool availability?
- Documentation quality?
- Training resources available?
- Hiring pool size?

**Operational Considerations**:
- Monitoring and debugging tools?
- Performance characteristics?
- Security track record?
- Upgrade path and breaking changes?
```

### For Process Changes

```markdown
**Current State Analysis**:
- What's working well?
- What are the pain points?
- Quantify the problem (metrics)?
- Who is most affected?

**Proposed Change Evaluation**:
- What improves?
- What might get worse?
- Learning curve for team?
- Reversibility if it fails?

**Implementation Planning**:
- Pilot program approach?
- Training requirements?
- Rollout timeline?
- Success criteria?
```

## Discussion Techniques

### 1. Five Whys

Dig deeper to find root causes:

```
Problem: Deployments are failing frequently

Why? → Tests are flaky
Why? → Tests depend on external services
Why? → No proper mocking in place
Why? → Team didn't know how to mock effectively
Why? → Lack of testing best practices documentation

Root Cause: Need testing standards and training
```

### 2. Pre-Mortem Analysis

Imagine failure and work backwards:

```markdown
**Scenario**: Our microservices migration failed

**What went wrong?**:
- Services became too granular (over-engineered)
- Network latency caused performance issues
- Debugging across services was nightmare
- Team didn't have Kubernetes expertise
- Cost overruns from infrastructure complexity

**Prevention**:
- Start with logical service boundaries
- Measure latency in early testing
- Invest in distributed tracing upfront
- Training before migration starts
- Detailed cost analysis before committing
```

### 3. Decision Matrix

Score options systematically:

```markdown
| Criteria (Weight)      | Option A | Option B | Option C |
|------------------------|----------|----------|----------|
| Performance (30%)      | 8        | 6        | 9        |
| Cost (25%)             | 7        | 9        | 5        |
| Team Expertise (20%)   | 9        | 6        | 7        |
| Scalability (15%)      | 7        | 8        | 9        |
| Maintenance (10%)      | 8        | 7        | 6        |
|------------------------|----------|----------|----------|
| **Weighted Score**     | **7.9**  | **7.1**  | **7.3**  |

Winner: Option A
```

## Common Discussion Scenarios

### Scenario 1: Database Choice

```markdown
**Question**: PostgreSQL vs MongoDB for our application?

**Analysis**:
1. **Data Structure**: Mostly relational with some nested docs
   → Advantage: PostgreSQL (JSONB handles nested data)

2. **Query Patterns**: Complex joins and aggregations
   → Advantage: PostgreSQL (mature query optimizer)

3. **Consistency**: Financial transactions require ACID
   → Advantage: PostgreSQL (strong ACID guarantees)

4. **Team Experience**: Team knows SQL well
   → Advantage: PostgreSQL (faster development)

**Recommendation**: PostgreSQL with JSONB for nested data
```

### Scenario 2: Monorepo vs Polyrepo

```markdown
**Question**: Should we use a monorepo or separate repositories?

**Context**:
- 5 related services
- Shared component library
- Small team (8 developers)

**Monorepo Benefits**:
- Atomic changes across services
- Easier code sharing
- Simplified dependency management
- Single CI/CD pipeline

**Polyrepo Benefits**:
- Independent deployment cycles
- Clearer service boundaries
- More flexible team structure
- Smaller repo sizes

**Recommendation**: Monorepo
**Rationale**: Small team benefits from simplified coordination;
shared components make atomic changes valuable; can split later if needed
```

### Scenario 3: Testing Strategy

```markdown
**Question**: How much test coverage is enough?

**Analysis**:
- **Critical Paths** (payment, auth): 100% coverage
- **Business Logic**: 90%+ coverage
- **UI Components**: 70%+ coverage
- **Utilities**: 95%+ coverage

**Strategy**:
1. Start with critical paths (highest value)
2. Add tests for new features (shift left)
3. Add tests when fixing bugs (prevent regression)
4. Track coverage trends (not absolute numbers)

**Success Metric**: Zero critical bugs in production for 6 months
```

## Best Practices

### 1. Time-Box Discussions

```markdown
**Phase 1** (15 min): Define problem and gather context
**Phase 2** (30 min): Explore options and trade-offs
**Phase 3** (15 min): Make decision or identify next steps
**Total**: 1 hour maximum
```

### 2. Document Decisions

```markdown
# Architecture Decision Record (ADR)

**Title**: ADR-001: Use JWT for Authentication
**Date**: 2025-01-15
**Status**: Accepted
**Context**: Need to support mobile apps and scale horizontally
**Decision**: Implement JWT with 15-minute access tokens
**Consequences**: Must implement token refresh flow
**Alternatives Considered**: OAuth2, Session tokens
```

### 3. Avoid Common Pitfalls

- **Analysis Paralysis**: Set decision deadline
- **Bike Shedding**: Focus on high-impact decisions
- **Groupthink**: Encourage dissenting opinions
- **Sunk Cost Fallacy**: Evaluate based on future, not past
- **NIH Syndrome**: Consider proven solutions first

### 4. Build Consensus

```markdown
**Levels of Agreement**:
1. Strong Yes: Enthusiastically support
2. Yes: Support the decision
3. Neutral: Can work with it
4. Concerns: Have reservations but won't block
5. Block: Cannot support (veto)

**Threshold**: Proceed if no blocks and majority yes/strong yes
```

## Output Format

Structure discussion results:

```markdown
# Decision: [Topic]

## Context
- Background information
- Why this decision is needed
- Constraints and requirements

## Options Considered
1. Option A: [Description]
   - Pros: ...
   - Cons: ...
2. Option B: [Description]
   - Pros: ...
   - Cons: ...

## Analysis
- Key trade-offs
- Impact assessment
- Risk evaluation

## Decision
**Chosen**: Option [X]
**Rationale**: Clear explanation
**Next Steps**: Action items with owners

## Success Criteria
- Measurable outcomes
- Timeline
- Review date
```

## Methodology

This command facilitates effective decisions through:
- **Structured Thinking**: Systematic frameworks prevent oversights
- **Multiple Perspectives**: Technical, business, operational views
- **Clear Trade-offs**: Explicit pros/cons of each option
- **Actionable Outcomes**: Decisions with clear next steps
- **Documentation**: Captured rationale for future reference
