#!/bin/bash
# Workspace Validation Script
# Triggered after Write/Edit operations to ensure workspace standards

set -euo pipefail

# Configuration
WORKSPACE_ROOT="${CLAUDE_PLUGIN_ROOT}/../../../.."
MAX_FILE_SIZE=500000  # 500KB
MIN_TEST_COVERAGE=80

echo "🔍 Validating workspace changes..."

# 1. Check file size limits
validate_file_sizes() {
  local large_files=$(find "$WORKSPACE_ROOT/src" -type f -size +${MAX_FILE_SIZE}c 2>/dev/null || true)

  if [ -n "$large_files" ]; then
    echo "⚠️  Warning: Large files detected (>500KB):"
    echo "$large_files"
    echo "Consider splitting large files for maintainability"
  fi
}

# 2. Validate naming conventions
validate_naming() {
  # Check for uppercase in non-component files
  local bad_names=$(find "$WORKSPACE_ROOT/src" -type f -name "*[A-Z]*" ! -name "*.tsx" ! -name "*.jsx" 2>/dev/null || true)

  if [ -n "$bad_names" ]; then
    echo "⚠️  Warning: Non-component files should use kebab-case:"
    echo "$bad_names"
  fi
}

# 3. Check for common anti-patterns
check_antipatterns() {
  # Look for console.log in non-test files
  local console_logs=$(grep -r "console\.log" "$WORKSPACE_ROOT/src" --exclude-dir={node_modules,dist,build} 2>/dev/null | grep -v "test" | wc -l || echo "0")

  if [ "$console_logs" -gt 0 ]; then
    echo "⚠️  Warning: Found $console_logs console.log statements in src/"
    echo "Use proper logging library instead"
  fi

  # Check for TODO comments
  local todos=$(grep -r "TODO\|FIXME\|HACK" "$WORKSPACE_ROOT/src" --exclude-dir={node_modules,dist,build} 2>/dev/null | wc -l || echo "0")

  if [ "$todos" -gt 0 ]; then
    echo "ℹ️  Info: Found $todos TODO/FIXME/HACK comments"
  fi
}

# 4. Verify imports
validate_imports() {
  # Check for relative imports going up more than 2 levels
  local deep_imports=$(grep -r "import.*from.*'\.\./\.\./\.\./" "$WORKSPACE_ROOT/src" 2>/dev/null | wc -l || echo "0")

  if [ "$deep_imports" -gt 0 ]; then
    echo "⚠️  Warning: Found $deep_imports deep relative imports (../../../)"
    echo "Consider using path aliases (@/*) instead"
  fi
}

# 5. Check for security issues
security_check() {
  # Look for potential secrets
  local secrets=$(grep -r -E "(password|api_key|secret|token).*=.*['\"].*['\"]" "$WORKSPACE_ROOT/src" 2>/dev/null | grep -v "test" | wc -l || echo "0")

  if [ "$secrets" -gt 0 ]; then
    echo "🚨 Security: Found $secrets potential hardcoded secrets!"
    echo "Secrets should be in environment variables"
  fi

  # Check for eval usage
  local eval_usage=$(grep -r "eval(" "$WORKSPACE_ROOT/src" 2>/dev/null | wc -l || echo "0")

  if [ "$eval_usage" -gt 0 ]; then
    echo "🚨 Security: Found eval() usage - potential security risk!"
  fi
}

# 6. Validate test coverage (if jest is available)
check_test_coverage() {
  if [ -f "$WORKSPACE_ROOT/package.json" ] && grep -q "jest" "$WORKSPACE_ROOT/package.json"; then
    if [ -f "$WORKSPACE_ROOT/coverage/coverage-summary.json" ]; then
      local coverage=$(cat "$WORKSPACE_ROOT/coverage/coverage-summary.json" | grep -o '"lines":{"total":[0-9]*,"covered":[0-9]*' | grep -o '[0-9]*$' | head -1)
      local total=$(cat "$WORKSPACE_ROOT/coverage/coverage-summary.json" | grep -o '"lines":{"total":[0-9]*' | grep -o '[0-9]*$')

      if [ -n "$coverage" ] && [ -n "$total" ] && [ "$total" -gt 0 ]; then
        local percent=$((coverage * 100 / total))

        if [ "$percent" -lt "$MIN_TEST_COVERAGE" ]; then
          echo "⚠️  Warning: Test coverage ${percent}% is below minimum ${MIN_TEST_COVERAGE}%"
        else
          echo "✅ Test coverage: ${percent}%"
        fi
      fi
    fi
  fi
}

# 7. Check documentation
validate_documentation() {
  # Check if README exists
  if [ ! -f "$WORKSPACE_ROOT/README.md" ]; then
    echo "⚠️  Warning: README.md missing"
  fi

  # Check if major source files have associated tests
  local src_files=$(find "$WORKSPACE_ROOT/src" -name "*.ts" -o -name "*.tsx" | grep -v ".test." | grep -v ".spec." | wc -l || echo "0")
  local test_files=$(find "$WORKSPACE_ROOT" -name "*.test.ts" -o -name "*.test.tsx" -o -name "*.spec.ts" -o -name "*.spec.tsx" | wc -l || echo "0")

  echo "ℹ️  Info: $test_files test files for $src_files source files"
}

# Execute all validations
main() {
  echo "Workspace: $WORKSPACE_ROOT"
  echo ""

  validate_file_sizes
  validate_naming
  check_antipatterns
  validate_imports
  security_check
  check_test_coverage
  validate_documentation

  echo ""
  echo "✅ Workspace validation complete"

  # Return 0 to not block the operation
  # For strict mode, return non-zero on warnings
  return 0
}

main "$@"
