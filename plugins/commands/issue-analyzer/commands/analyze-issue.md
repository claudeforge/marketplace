---
description: Analyze GitHub issues to create detailed implementation plans with requirements and technical approach
version: 1.0.0
---

# Issue Analyzer

Transform GitHub issues into clear, actionable implementation plans with detailed requirements and technical specifications.

## What It Does

- Fetches complete issue details from GitHub
- Extracts functional and technical requirements
- Identifies affected components and dependencies
- Suggests technical approach and architecture
- Creates structured implementation plan

## How to Use

Provide the issue number to analyze:

```bash
/analyze-issue 456
```

The command will generate a comprehensive analysis and implementation plan.

## What Gets Analyzed

**Issue Content**
- Title and description
- User requirements and acceptance criteria
- Expected behavior vs current behavior
- Comments and discussion

**Technical Context**
- Related code files and components
- Existing patterns and architecture
- Dependencies and integrations
- Similar features already implemented

## Analysis Output

The analyzer produces:

1. **Requirements Summary**: What needs to be built and why
2. **Technical Approach**: How to implement it
3. **Task Breakdown**: Step-by-step implementation tasks
4. **File Changes**: What files need to be created or modified
5. **Testing Strategy**: How to verify the solution works

## Example Analysis

**Issue #456**: "Add user profile export feature"

**Requirements**
- Users need ability to export profile data
- Support JSON and CSV formats
- Include all profile information
- Downloadable file generation

**Technical Approach**
```
Component: ProfileExportService
Location: src/services/profile-export.ts
Dependencies: json2csv library
API Endpoint: GET /api/users/:id/export?format=json|csv
```

**Implementation Tasks**
1. Create ProfileExportService class
2. Add JSON serialization method
3. Add CSV conversion method
4. Create API endpoint handler
5. Add download link to UI
6. Write unit tests
7. Update API documentation

**Files to Create**
- `src/services/profile-export.ts`
- `src/services/profile-export.test.ts`
- `src/api/routes/export.ts`

**Files to Modify**
- `src/components/ProfilePage.tsx` (add export button)
- `package.json` (add json2csv dependency)

## Use Cases

- **Feature Planning**: Break down new features into concrete steps
- **Bug Investigation**: Understand scope and impact of bugs
- **Estimation**: Get realistic effort estimates for issues
- **Team Communication**: Share clear implementation plans
- **Onboarding**: Help new developers understand what needs to be done

## Best Practices

- **Read Thoroughly**: Don't skip comments, they often contain crucial details
- **Identify Gaps**: Note any missing requirements or unclear specifications
- **Consider Edge Cases**: Think about error conditions and boundary cases
- **Check Dependencies**: Verify what other work must be completed first
- **Validate Feasibility**: Ensure the proposed solution is actually implementable
- **Ask Questions**: If anything is unclear, ask for clarification on the issue

## Technical Approach Template

When suggesting implementation:

```markdown
## Technical Approach

**Architecture**
- Component structure
- Data flow
- Integration points

**Key Decisions**
- Technology choices
- Design patterns to use
- Libraries or frameworks

**Considerations**
- Performance implications
- Security requirements
- Backward compatibility
```

## Implementation Plan Template

```markdown
## Implementation Plan

### Phase 1: Setup (2h)
- [ ] Create service module
- [ ] Add dependencies
- [ ] Set up test structure

### Phase 2: Core Logic (4h)
- [ ] Implement data extraction
- [ ] Add format conversion
- [ ] Handle edge cases

### Phase 3: Integration (3h)
- [ ] Create API endpoint
- [ ] Add UI controls
- [ ] Connect frontend to backend

### Phase 4: Testing (2h)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual verification
```

## Common Issue Types

**Feature Request**
- Focus on user needs and acceptance criteria
- Consider UI/UX implications
- Plan for scalability

**Bug Report**
- Identify root cause
- Assess impact and urgency
- Plan for regression tests

**Performance Issue**
- Profile and measure current state
- Identify bottlenecks
- Set performance targets

**Refactoring**
- Document current problems
- Define desired state
- Ensure no behavior changes

## Questions to Answer

A complete analysis addresses:

- **What** needs to be built?
- **Why** is it needed?
- **Who** will use it?
- **Where** in the codebase does it go?
- **When** are the dependencies available?
- **How** should it be implemented?

## Clarification Checklist

If these aren't clear, ask on the issue:

- [ ] Exact success criteria
- [ ] Expected user workflow
- [ ] Error handling requirements
- [ ] Performance expectations
- [ ] Browser/platform support
- [ ] Data validation rules
- [ ] Edge case behavior

## Risk Assessment

Identify potential challenges:

**Technical Risks**
- Complex integrations
- Performance concerns
- Security implications

**Process Risks**
- Unclear requirements
- Dependency on other teams
- Tight deadlines

## Troubleshooting

**Incomplete Issue**: Comment asking for more details

**Too Broad**: Suggest breaking into smaller issues

**Unclear Requirements**: List specific questions that need answers

**Technical Uncertainty**: Research and propose multiple approaches

## Quality Standards

A good analysis includes:
- Clear requirements summary
- Concrete technical approach
- Realistic task breakdown
- Identified dependencies and risks
- Specific file changes
- Testing strategy
- Effort estimate
