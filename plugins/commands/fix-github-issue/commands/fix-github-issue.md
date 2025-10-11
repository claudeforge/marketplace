---
description: Comprehensive GitHub issue resolution workflow. Analyzes issues using GitHub CLI, implements fixes with test-driven development, ensures quality standards, and creates production-ready solutions with proper documentation and verification.
author: jeremymailen
author-url: https://github.com/jeremymailen
version: 2.0.0
tools: ['gh', 'git', 'testing', 'linting']
capabilities: ['issue-resolution', 'tdd', 'code-quality', 'github-integration']
---

# Fix GitHub Issue - Enterprise Issue Resolution Workflow

## Overview

The Fix GitHub Issue command provides a systematic, production-quality approach to resolving GitHub issues. It combines issue analysis, test-driven development, code quality enforcement, and comprehensive verification to ensure issues are fully resolved without introducing regressions or technical debt.

## Core Workflow

### Phase 1: Issue Analysis & Understanding

#### Step 1.1: Fetch Issue Details
```bash
gh issue view $ISSUE_NUMBER --json title,body,labels,assignees,comments
```

**Extract key information:**
- Issue title and description
- Steps to reproduce
- Expected vs. actual behavior
- Environment details
- Related issues or PRs
- User comments and clarifications
- Priority and labels

#### Step 1.2: Problem Classification
Categorize the issue type:
- **Bug**: Incorrect behavior, crashes, errors
- **Feature Request**: New functionality needed
- **Enhancement**: Improvement to existing feature
- **Performance**: Speed or resource optimization
- **Documentation**: Docs missing or incorrect
- **Refactoring**: Code structure improvement

#### Step 1.3: Impact Assessment
**Severity levels:**
- **Critical**: Production down, data loss, security breach
- **High**: Major functionality broken, blocking users
- **Medium**: Feature degraded, workaround available
- **Low**: Minor inconvenience, cosmetic issues

**Scope analysis:**
- How many users are affected?
- What components/modules are involved?
- Are there dependencies or related systems?
- What is the blast radius of potential fixes?

### Phase 2: Repository Investigation

#### Step 2.1: Codebase Search
Identify relevant code locations:

```bash
# Search for error messages mentioned in issue
grep -r "specific error message" .

# Find files related to affected feature
find . -name "*feature-name*"

# Search for related functions or classes
grep -r "ClassName\|functionName" .
```

#### Step 2.2: Code Analysis
**Examine relevant code:**
- Current implementation
- Related tests (if any)
- Recent changes (git blame, git log)
- Similar patterns in codebase
- Architecture and design patterns used

#### Step 2.3: Root Cause Identification
**Investigation techniques:**
1. Reproduce the issue locally
2. Add debug logging to trace execution
3. Review stack traces and error logs
4. Check recent commits for regressions
5. Test with different inputs/scenarios
6. Review related PRs and issues

**Document findings:**
```markdown
## Root Cause Analysis
**Problem**: [Brief description]
**Location**: [File:Line or component]
**Cause**: [Why the issue occurs]
**Evidence**: [How we know this is the root cause]
```

### Phase 3: Solution Design

#### Step 3.1: Approach Evaluation
Consider multiple solutions:

**Option A**: [Description]
- **Pros**: [Benefits]
- **Cons**: [Drawbacks]
- **Effort**: [Time/complexity estimate]
- **Risk**: [Potential issues]

**Option B**: [Description]
- **Pros**: [Benefits]
- **Cons**: [Drawbacks]
- **Effort**: [Time/complexity estimate]
- **Risk**: [Potential issues]

**Selected approach**: [Chosen option with justification]

#### Step 3.2: Implementation Plan
**Changes required:**
1. Files to modify: [List]
2. New files to create: [List if any]
3. Tests to add/update: [List]
4. Documentation to update: [List]

**Verification strategy:**
- How will we verify the fix works?
- What edge cases need testing?
- How will we prevent regressions?

### Phase 4: Test-Driven Implementation

#### Step 4.1: Write Failing Tests First
```javascript
// Example: Write test that reproduces the bug
describe('Feature X', () => {
  it('should handle edge case Y correctly', () => {
    const result = featureX('edge-case-input');
    expect(result).toBe('expected-output');
  });
});
```

**Test categories to cover:**
- **Reproduction test**: Demonstrates the bug
- **Edge cases**: Boundary conditions
- **Error cases**: Invalid inputs and error handling
- **Integration**: Interaction with other components
- **Regression**: Ensure fix doesn't break existing functionality

#### Step 4.2: Implement the Fix
**Code quality checklist:**
- [ ] Follows project coding standards
- [ ] Minimal change scope (don't refactor unnecessarily)
- [ ] Proper error handling
- [ ] Input validation where needed
- [ ] No hardcoded values
- [ ] Clear variable and function names
- [ ] Comments explain "why", not "what"

#### Step 4.3: Verify Tests Pass
```bash
# Run test suite
npm test  # or pytest, cargo test, etc.

# Run specific tests
npm test -- --grep "Feature X"

# Check coverage
npm run coverage
```

**Ensure:**
- All new tests pass
- All existing tests still pass
- No test timeouts or flakiness
- Coverage is maintained or improved

### Phase 5: Code Quality Verification

#### Step 5.1: Linting
```bash
# Run linter
npm run lint  # or flake8, rubocop, etc.

# Auto-fix issues where possible
npm run lint -- --fix
```

#### Step 5.2: Type Checking (if applicable)
```bash
# TypeScript
npm run typecheck

# Python
mypy .

# Other languages
# Run appropriate type checker
```

#### Step 5.3: Security Scanning
```bash
# Check for known vulnerabilities
npm audit

# Run security linter
npm run security-check
```

### Phase 6: Manual Testing

#### Step 6.1: Reproduce Original Issue
Verify the original bug is now fixed:
1. Follow reproduction steps from issue
2. Test with original inputs/data
3. Verify error no longer occurs
4. Confirm expected behavior is achieved

#### Step 6.2: Edge Case Testing
Test scenarios not covered by automated tests:
- Unusual input combinations
- Timing-dependent scenarios
- Different user permissions
- Various browser/OS combinations
- Network conditions (slow, intermittent)

#### Step 6.3: Regression Testing
Verify related functionality still works:
- Test features that share code paths
- Check integration points
- Verify backward compatibility
- Test with production-like data

### Phase 7: Documentation

#### Step 7.1: Code Documentation
```javascript
/**
 * [Function description]
 *
 * @param {Type} paramName - Description
 * @returns {Type} Description
 * @throws {ErrorType} When condition occurs
 *
 * Note: [Any important implementation details]
 * Fixes: #ISSUE_NUMBER
 */
```

#### Step 7.2: Update Related Docs
- README if user-facing changes
- API documentation if interface changed
- Changelog entry
- Migration guide if breaking change

#### Step 7.3: Comment on Issue
```markdown
## Fix Summary
Fixed in PR #[NUMBER]

**Root Cause**: [Brief explanation]
**Solution**: [What was changed]
**Testing**: [How it was verified]

Closes #[ISSUE_NUMBER]
```

### Phase 8: Commit & Submit

#### Step 8.1: Create Descriptive Commit
```bash
git add [changed-files]

git commit -m "fix: [concise description] (#ISSUE_NUMBER)

- [Detailed point 1]
- [Detailed point 2]
- [Testing performed]

Fixes #ISSUE_NUMBER"
```

**Commit message format:**
- Type: fix, feat, refactor, docs, test, chore
- Scope (optional): affected component
- Description: imperative mood, lowercase
- Body: detailed explanation
- Footer: issue references

#### Step 8.2: Push and Create PR
```bash
git push origin [branch-name]

gh pr create --title "Fix: [Issue Title]" \
  --body "$(cat <<EOF
## Description
Fixes #ISSUE_NUMBER

## Changes Made
- [Change 1]
- [Change 2]

## Testing
- [x] Unit tests pass
- [x] Integration tests pass
- [x] Manual testing completed
- [x] Reproduction steps verified

## Checklist
- [x] Code follows style guidelines
- [x] Self-reviewed the code
- [x] Added/updated tests
- [x] Updated documentation
- [x] No new warnings
EOF
)"
```

## Quality Standards

### Acceptance Criteria
- [ ] Issue is fully resolved
- [ ] Root cause is addressed, not just symptoms
- [ ] Tests prove the fix works
- [ ] No regressions introduced
- [ ] Code quality standards met
- [ ] Documentation updated
- [ ] PR is ready for review

### Testing Requirements
**Minimum coverage:**
- New code: 80%+ coverage
- Bug fixes: Must include regression test
- Features: Unit + integration tests

### Performance Considerations
- [ ] No performance degradation
- [ ] Resource usage acceptable
- [ ] Scalability maintained
- [ ] No memory leaks

## Best Practices

### Do's
1. ✅ Reproduce the issue first
2. ✅ Write tests before fixing
3. ✅ Keep changes focused and minimal
4. ✅ Update documentation
5. ✅ Test edge cases thoroughly
6. ✅ Comment on the issue with updates
7. ✅ Request review when ready

### Don'ts
1. ❌ Fix symptoms instead of root cause
2. ❌ Skip writing tests
3. ❌ Introduce unrelated changes
4. ❌ Leave commented-out code
5. ❌ Ignore linting errors
6. ❌ Forget to update docs
7. ❌ Submit without manual testing

## Common Issue Types & Strategies

### Type 1: Null Pointer / Undefined Error
**Strategy:**
- Add null/undefined checks
- Provide sensible defaults
- Add validation
- Update types/interfaces

### Type 2: Logic Error
**Strategy:**
- Trace execution flow
- Add debug logging
- Review business rules
- Test all code paths

### Type 3: Performance Issue
**Strategy:**
- Profile the code
- Identify bottlenecks
- Optimize algorithms
- Add caching if appropriate
- Consider async/parallel processing

### Type 4: Integration Failure
**Strategy:**
- Verify API contracts
- Check data formats
- Validate assumptions
- Add error handling
- Test with mocks and real services

## Metrics & Success Indicators

### Resolution Quality
- First-time fix rate: >90%
- Regression rate: <5%
- Test coverage: >80%
- Time to resolution: Tracked per severity

### Process Efficiency
- Issues resolved per week
- Average resolution time
- Reopened issues
- PR review cycles

## Troubleshooting

### Cannot Reproduce Issue
1. Request more details from reporter
2. Check environment differences
3. Verify using exact steps provided
4. Test with reporter's data/config
5. Ask for screen recording

### Tests Are Failing
1. Run tests locally
2. Check for flaky tests
3. Verify dependencies are updated
4. Review test logs carefully
5. Isolate failing test
6. Debug step by step

### Fix Causes Regression
1. Review changed code
2. Add regression test
3. Check related features
4. Expand test coverage
5. Consider alternative approach

## Command Execution

When invoked with `/fix-github-issue $ISSUE_NUMBER`:

1. **Fetch issue details** using `gh issue view`
2. **Analyze problem** and classify issue type
3. **Search codebase** for relevant files
4. **Identify root cause** through investigation
5. **Design solution** with multiple options
6. **Write tests** that demonstrate the bug
7. **Implement fix** following best practices
8. **Verify quality** through linting and type checking
9. **Test manually** to ensure complete resolution
10. **Document changes** in code and issue comments
11. **Create PR** with comprehensive description
12. **Request review** from maintainers

## Integration with GitHub

### GitHub CLI Commands
```bash
# View issue
gh issue view <number>

# Comment on issue
gh issue comment <number> --body "message"

# Close issue
gh issue close <number>

# Create PR
gh pr create --title "..." --body "..."

# Link PR to issue
# Use "Fixes #<number>" in PR description
```

### Labels and Automation
- Add "in-progress" label when starting
- Add "needs-review" when PR created
- Auto-close on PR merge with "Fixes #"
- Add "bug-fixed" label on resolution

## Summary

The Fix GitHub Issue command ensures systematic, high-quality issue resolution. By combining thorough analysis, test-driven development, code quality enforcement, and comprehensive verification, it transforms issue resolution from a reactive task into a structured, professional process that consistently delivers production-ready solutions.

**Remember:** A well-fixed issue includes not just working code, but tests proving it works, documentation explaining the change, and verification that no regressions were introduced.

Please analyze and fix the GitHub issue: $ARGUMENTS.
