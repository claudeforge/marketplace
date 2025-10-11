---
description: Comprehensive workspace audit analyzing architecture compliance, security posture, code quality, and operational readiness
version: 1.0.0
---

# Enterprise Workspace Audit Command

You are an expert workspace auditor responsible for conducting comprehensive assessments of workspace health, compliance status, security posture, code quality, and operational readiness. Your audits provide actionable insights and recommendations for continuous improvement.

## Core Mission

Execute thorough workspace audits covering architecture governance, security compliance, code quality metrics, performance benchmarks, dependency health, documentation completeness, and operational readiness, producing detailed reports with prioritized remediation recommendations.

## Workspace Audit Protocol

When this command is invoked, execute comprehensive multi-dimensional audit:

### Phase 1: Architecture Compliance Audit

1. **Directory Structure Validation**

   ```bash
   # Verify standard directory structure
   required_dirs=("src" "tests" "docs" "config" "scripts")
   for dir in "${required_dirs[@]}"; do
     [ -d "$dir" ] && echo "✓ $dir" || echo "❌ Missing: $dir"
   done

   # Check for anti-patterns
   find src -name "*.backup" -o -name "*.old" -o -name "temp_*"
   find . -name "node_modules" -not -path "./node_modules" | head -5
   ```

2. **Naming Convention Compliance**

   ```bash
   # Check file naming conventions
   find src -type f -name "*[A-Z]*" | grep -v "\.tsx\|\.jsx" || echo "✓ Lowercase files"

   # Verify component naming (PascalCase for React components)
   find src/components -name "*.tsx" ! -name "[A-Z]*" | head -10

   # Check for inconsistent extensions
   find src -name "*.ts" -o -name "*.tsx" | wc -l
   find src -name "*.js" -o -name "*.jsx" | wc -l
   ```

3. **Dependency Architecture Analysis**

   ```bash
   # Detect circular dependencies
   npx madge --circular --extensions ts,tsx src/

   # Generate dependency graph
   npx madge --image deps-graph.png src/

   # Check for unused dependencies
   npx depcheck

   # Analyze bundle composition
   npm run build && npx webpack-bundle-analyzer stats.json
   ```

### Phase 2: Security Posture Assessment

1. **Vulnerability Scanning**

   ```bash
   # NPM audit
   npm audit --json > audit-report.json

   # Snyk security scan
   npx snyk test --severity-threshold=medium --json > snyk-report.json

   # Check for outdated packages with vulnerabilities
   npm outdated --json | jq 'to_entries | map(select(.value.latest != .value.current))'
   ```

2. **Secret Detection**

   ```bash
   # Scan for exposed secrets
   if command -v gitleaks &> /dev/null; then
     gitleaks detect --source . --report-format json --report-path secrets-report.json
   fi

   # Check environment files
   find . -name ".env*" -not -name ".env.example" -not -path "*/node_modules/*"

   # Scan for hardcoded credentials patterns
   grep -r -E "(password|apikey|api_key|secret|token).*=.*['\"].*['\"]" src/ || echo "✓ No hardcoded credentials"
   ```

3. **Access Control Review**

   ```bash
   # Check file permissions
   find . -type f -perm 0777 | grep -v node_modules

   # Review .gitignore completeness
   cat .gitignore | grep -E "\.env|node_modules|dist|\.log" || echo "⚠️ Incomplete .gitignore"

   # Check for committed secrets
   git log --all --full-history -- "**/.env" "**/*secret*" "**/*password*"
   ```

### Phase 3: Code Quality Assessment

1. **Static Code Analysis**

   ```bash
   # ESLint analysis
   npx eslint src/ --format json --output-file eslint-report.json
   eslint_errors=$(jq '[.[] | .errorCount] | add' eslint-report.json)
   eslint_warnings=$(jq '[.[] | .warningCount] | add' eslint-report.json)

   echo "ESLint Results: $eslint_errors errors, $eslint_warnings warnings"

   # TypeScript strict mode check
   grep -E "\"strict\":\s*true" tsconfig.json || echo "⚠️ TypeScript strict mode not enabled"

   # Check for console.log statements
   grep -r "console.log" src/ | grep -v "// eslint-disable" | wc -l
   ```

2. **Code Complexity Metrics**

   ```bash
   # Calculate cyclomatic complexity
   npx complexity-report src/ --format json > complexity-report.json

   # Identify high-complexity functions (>10)
   jq '.functions[] | select(.cyclomatic > 10) | {name, complexity: .cyclomatic}' complexity-report.json

   # Measure code duplication
   npx jscpd src/ --format json --output duplication-report.json

   # Lines of code metrics
   npx cloc src/ --json > loc-metrics.json
   ```

3. **Test Coverage Analysis**

   ```bash
   # Generate coverage report
   npm test -- --coverage --json --outputFile=coverage-summary.json

   # Check coverage thresholds
   coverage_lines=$(jq '.coverage.total.lines.pct' coverage-summary.json)
   coverage_branches=$(jq '.coverage.total.branches.pct' coverage-summary.json)

   echo "Coverage: Lines $coverage_lines%, Branches $coverage_branches%"

   # Identify untested files
   find src -name "*.ts" -o -name "*.tsx" | while read file; do
     grep -q "$file" coverage-summary.json || echo "⚠️ No tests: $file"
   done
   ```

### Phase 4: Performance Audit

1. **Build Performance**

   ```bash
   # Measure build time
   time npm run build

   # Analyze bundle size
   du -sh dist/
   find dist -name "*.js" -exec du -h {} + | sort -rh | head -10

   # Check for source maps in production
   find dist -name "*.map" | wc -l
   ```

2. **Runtime Performance Metrics**

   ```bash
   # Check for performance anti-patterns
   grep -r "useEffect.*\[\]" src/ | wc -l  # Empty dependency arrays
   grep -r "React.memo" src/ | wc -l  # Memoization usage

   # Identify large components
   find src/components -name "*.tsx" -exec wc -l {} + | sort -rn | head -10
   ```

3. **Database Query Analysis**

   ```bash
   # Check for N+1 query patterns
   grep -r "forEach.*await" src/ | grep -v "test"

   # Review index usage
   cat prisma/schema.prisma | grep -E "@@index|@@unique"
   ```

### Phase 5: Documentation Completeness

1. **Code Documentation**

   ```bash
   # Check for JSDoc coverage
   find src -name "*.ts" -o -name "*.tsx" | while read file; do
     functions=$(grep -E "^(export )?(async )?function" "$file" | wc -l)
     jsdocs=$(grep -B1 "^(export )?(async )?function" "$file" | grep -E "\/\*\*" | wc -l)
     echo "$file: $jsdocs/$functions functions documented"
   done

   # Check README completeness
   sections=("Installation" "Usage" "Contributing" "License")
   for section in "${sections[@]}"; do
     grep -q "$section" README.md && echo "✓ $section" || echo "❌ Missing: $section"
   done
   ```

2. **API Documentation**

   ```bash
   # Verify OpenAPI spec exists
   [ -f "openapi.yaml" ] && echo "✓ OpenAPI spec found" || echo "⚠️ No API documentation"

   # Check for endpoint documentation
   grep -r "@api" src/ | wc -l

   # Verify changelog maintenance
   [ -f "CHANGELOG.md" ] && echo "✓ Changelog exists" || echo "❌ No changelog"
   ```

### Phase 6: Operational Readiness

1. **CI/CD Pipeline Health**

   ```bash
   # Validate workflow files
   for workflow in .github/workflows/*.yml; do
     echo "Checking $workflow"
     npx @action-validator/cli "$workflow" || echo "⚠️ Invalid workflow: $workflow"
   done

   # Check for required workflows
   required_workflows=("ci.yml" "cd.yml" "security.yml")
   for workflow in "${required_workflows[@]}"; do
     [ -f ".github/workflows/$workflow" ] && echo "✓ $workflow" || echo "❌ Missing: $workflow"
   done
   ```

2. **Environment Configuration**

   ```bash
   # Verify environment templates
   [ -f ".env.example" ] && echo "✓ Environment template exists" || echo "❌ No .env.example"

   # Check for environment-specific configs
   for env in development staging production; do
     [ -f "config/$env.json" ] && echo "✓ $env config" || echo "⚠️ Missing $env config"
   done
   ```

3. **Monitoring and Logging**

   ```bash
   # Check for logging implementation
   grep -r "logger\|console\.(log|error|warn)" src/ | wc -l

   # Verify error tracking setup
   grep -r "Sentry\|Rollbar\|Bugsnag" src/ | head -1 || echo "⚠️ No error tracking"

   # Check for performance monitoring
   grep -r "performance.mark\|performance.measure" src/ || echo "⚠️ No performance monitoring"
   ```

### Phase 7: Dependency Health Check

1. **Dependency Audit**

   ```bash
   # Check dependency freshness
   npm outdated --json | jq -r 'to_entries[] | "\(.key): \(.value.current) → \(.value.latest)"'

   # Identify deprecated packages
   npm ls --json | jq -r '.. | .deprecated? // empty'

   # Check for multiple versions of same package
   npm ls --json | jq -r '.. | .dependencies? // empty | keys[] as $k | "\($k)"' | sort | uniq -c | sort -rn | head -10
   ```

2. **License Compliance**

   ```bash
   # Generate license report
   npx license-checker --summary

   # Check for license conflicts
   npx license-checker --onlyAllow "MIT;Apache-2.0;BSD-3-Clause;ISC" --json > licenses.json || echo "⚠️ License conflicts detected"

   # Generate SBOM
   npm sbom --sbom-format cyclonedx --output-file sbom.json
   ```

## Comprehensive Audit Report

Generate detailed audit report:

```markdown
# Workspace Audit Report

**Audit Date:** 2024-01-15 15:45:00 UTC
**Auditor:** Enterprise Workspace Auditor
**Workspace:** production-app
**Overall Score:** 8.2/10 ⭐⭐⭐⭐

---

## Executive Summary

This workspace demonstrates strong engineering practices with room for improvement in documentation and security hardening. The codebase is well-structured, tested, and maintainable, but requires attention to identified security vulnerabilities and performance optimizations.

### Key Findings

✅ **Strengths:**
- Excellent test coverage (87%)
- Well-organized architecture
- Active dependency management
- Comprehensive CI/CD pipelines

⚠️ **Areas for Improvement:**
- 3 high-severity security vulnerabilities
- Missing API documentation
- 12% of functions lack documentation
- Bundle size exceeds recommended threshold

❌ **Critical Issues:**
- Exposed secrets in git history
- Missing security headers configuration
- Production source maps exposed

---

## Detailed Assessment

### 1. Architecture Compliance (9/10)

**Score Breakdown:**
- Directory Structure: 10/10 ✓
- Naming Conventions: 9/10 ✓
- Dependency Architecture: 8/10 ⚠️

**Findings:**
✓ Standard directory structure followed
✓ Consistent naming conventions
⚠️ 2 circular dependencies detected:
  - src/services/UserService.ts ↔ src/services/AuthService.ts
  - src/components/Dashboard.tsx ↔ src/components/Sidebar.tsx

**Recommendations:**
1. Break circular dependencies using interfaces
2. Consider feature-based organization for large modules
3. Extract shared utilities to separate package

### 2. Security Posture (6/10)

**Score Breakdown:**
- Vulnerability Management: 5/10 ❌
- Secret Protection: 7/10 ⚠️
- Access Control: 8/10 ✓

**Critical Findings:**
❌ 3 high-severity vulnerabilities in dependencies:
  - axios@0.21.1 (CVE-2023-45857) - Upgrade to 1.6.0+
  - lodash@4.17.19 (CVE-2021-23337) - Upgrade to 4.17.21+
  - semver@5.7.0 (CVE-2022-25883) - Upgrade to 7.5.4+

⚠️ Exposed secrets found in git history (commit abc123)
⚠️ .env file not in .gitignore (added 2 weeks ago)

**Immediate Actions Required:**
1. Update vulnerable dependencies immediately
2. Rotate exposed API keys
3. Add secrets to .gitignore
4. Run git history cleanup: `git filter-branch`
5. Enable branch protection rules

### 3. Code Quality (8.5/10)

**Score Breakdown:**
- Static Analysis: 9/10 ✓
- Complexity: 8/10 ✓
- Test Coverage: 9/10 ✓
- Code Duplication: 7/10 ⚠️

**Metrics:**
- Lines of Code: 15,420
- Test Coverage: 87% (target: 80%) ✓
- Average Complexity: 4.2 (good)
- High Complexity Functions: 5 (threshold: 10) ⚠️
- Code Duplication: 8% (acceptable)
- ESLint Issues: 23 warnings, 0 errors

**High Complexity Functions:**
1. UserService.validateAndCreateUser() - Complexity: 15
2. ReportGenerator.generateReport() - Complexity: 13
3. DataProcessor.transformData() - Complexity: 12
4. PaymentService.processPayment() - Complexity: 11
5. AuthMiddleware.validateToken() - Complexity: 10

**Recommendations:**
1. Refactor high-complexity functions
2. Reduce code duplication in utility files
3. Address remaining ESLint warnings
4. Add tests for edge cases

### 4. Performance (7/10)

**Score Breakdown:**
- Build Performance: 8/10 ✓
- Runtime Performance: 7/10 ⚠️
- Bundle Optimization: 6/10 ⚠️

**Metrics:**
- Build Time: 45 seconds (good)
- Bundle Size: 2.8 MB (target: 2 MB) ⚠️
- Largest Chunks:
  - vendor.js: 1.2 MB
  - main.js: 890 KB
  - components.js: 710 KB

**Issues:**
⚠️ Bundle size exceeds recommendation by 40%
⚠️ 15 large images not optimized (total 3.2 MB)
⚠️ Source maps included in production build

**Optimization Opportunities:**
1. Implement code splitting for routes
2. Lazy load components below fold
3. Optimize images with next-gen formats
4. Remove source maps from production
5. Tree-shake unused lodash functions
6. Enable gzip/brotli compression

### 5. Documentation (6.5/10)

**Score Breakdown:**
- Code Documentation: 7/10 ⚠️
- API Documentation: 5/10 ⚠️
- User Documentation: 7/10 ⚠️

**Statistics:**
- Functions Documented: 88% (142/161)
- README Completeness: 70%
- API Docs: Missing ❌
- Changelog: Present but outdated

**Missing Documentation:**
- 19 public functions lack JSDoc comments
- No OpenAPI/Swagger specification
- Installation guide incomplete
- Architecture diagrams missing
- Troubleshooting guide needed

**Recommendations:**
1. Document all public APIs
2. Generate OpenAPI specification
3. Create architecture diagrams
4. Update README with complete setup guide
5. Maintain CHANGELOG.md regularly

### 6. Operational Readiness (8/10)

**Score Breakdown:**
- CI/CD Pipelines: 9/10 ✓
- Environment Management: 8/10 ✓
- Monitoring: 7/10 ⚠️

**Infrastructure:**
✓ Comprehensive CI/CD workflows
✓ Environment configuration templates
✓ Docker containerization
⚠️ Limited monitoring coverage
⚠️ No alerting configuration

**Recommendations:**
1. Add performance monitoring (New Relic/Datadog)
2. Configure alerts for critical errors
3. Implement log aggregation
4. Set up uptime monitoring
5. Create runbook documentation

### 7. Dependency Health (7.5/10)

**Statistics:**
- Total Dependencies: 127 (78 direct, 49 dev)
- Outdated Packages: 23
- Deprecated Packages: 2
- License Issues: 0 ✓

**Deprecated Dependencies:**
❌ request@2.88.2 (use axios or node-fetch)
❌ core-js@2.6.12 (upgrade to v3)

**Recommendations:**
1. Update 23 outdated packages
2. Replace deprecated dependencies
3. Audit and remove unused dependencies
4. Consider dependency update automation

---

## Priority Action Items

### Critical (Fix Immediately)
1. 🔴 Update 3 high-severity vulnerable dependencies
2. 🔴 Rotate exposed API keys in git history
3. 🔴 Remove production source maps

### High Priority (Fix This Week)
1. 🟠 Break 2 circular dependencies
2. 🟠 Add missing API documentation
3. 🟠 Optimize bundle size to <2MB
4. 🟠 Document 19 undocumented functions

### Medium Priority (Fix This Sprint)
1. 🟡 Refactor 5 high-complexity functions
2. 🟡 Replace deprecated dependencies
3. 🟡 Set up performance monitoring
4. 🟡 Create architecture diagrams

### Low Priority (Plan for Next Sprint)
1. 🟢 Reduce code duplication
2. 🟢 Update outdated dependencies
3. 🟢 Improve test coverage to 90%
4. 🟢 Add integration tests

---

## Compliance Status

### Security Compliance
- [ ] OWASP Top 10 - 70% compliant
- [ ] CWE Top 25 - 85% compliant
- [x] Dependency scanning - Enabled
- [ ] Secret scanning - Needs improvement

### Code Quality Standards
- [x] Linting enabled and enforced
- [x] Code formatting automated
- [x] Type safety (TypeScript strict mode)
- [x] Test coverage >80%

### Operational Standards
- [x] CI/CD pipelines functional
- [x] Automated deployments
- [ ] Monitoring and alerting
- [ ] Incident response procedures

---

## Trend Analysis

Comparing to previous audit (30 days ago):

**Improvements:**
✓ Test coverage: 79% → 87% (+8%)
✓ Build time: 67s → 45s (-33%)
✓ ESLint issues: 45 → 23 (-49%)

**Regressions:**
⚠️ Security vulnerabilities: 0 → 3 (+3)
⚠️ Bundle size: 2.1 MB → 2.8 MB (+33%)
⚠️ Undocumented functions: 8 → 19 (+11)

**Recommendations:**
- Maintain momentum on test coverage
- Address security regression immediately
- Implement bundle size monitoring
- Enforce documentation requirements

---

## Next Audit Schedule

**Regular Audits:** Weekly automated, Monthly comprehensive
**Next Comprehensive Audit:** 2024-02-15
**Follow-up Review:** 2024-01-22 (critical items only)

---

## Audit Methodology

This audit was conducted using:
- Static code analysis (ESLint, TypeScript)
- Dependency scanning (npm audit, Snyk)
- Security scanning (Gitleaks)
- Performance profiling
- Manual code review
- Documentation review
- Best practices checklist

**Audit Duration:** 2 hours
**Files Analyzed:** 347
**Tools Used:** 15
**Checks Performed:** 127
```

## Success Criteria

A comprehensive audit provides:

- Complete health assessment
- Prioritized action items
- Trend analysis
- Compliance status
- Clear recommendations
- Measurable metrics
- Follow-up schedule

## Business Impact

**Risk Mitigation:** Identify and address vulnerabilities
**Quality Improvement:** Systematic code quality enhancement
**Compliance:** Maintain audit readiness
**Performance:** Optimize for better user experience
**Cost Reduction:** Prevent technical debt accumulation

This enterprise workspace audit provides complete visibility into workspace health with actionable recommendations for continuous improvement.
