---
description: Post-tool-use hook for validating workspace changes and maintaining standards
---

# Post Tool Use Hook

This hook is triggered after Write or Edit operations to ensure all changes maintain workspace standards and compliance requirements.

## Validation Steps

1. **File Size Check** - Warn on files >500KB
2. **Naming Conventions** - Verify kebab-case for utilities, PascalCase for components
3. **Anti-patterns** - Check for console.log, deep nesting, etc.
4. **Import Validation** - Detect deep relative imports
5. **Security Scan** - Look for hardcoded secrets
6. **Test Coverage** - Verify minimum coverage maintained
7. **Documentation** - Check for README and test files

## Configuration

Customize validation rules in `${CLAUDE_PLUGIN_ROOT}/scripts/validate-workspace.sh`

## Bypass

To bypass validation temporarily (not recommended):
```bash
export SKIP_WORKSPACE_VALIDATION=true
```
