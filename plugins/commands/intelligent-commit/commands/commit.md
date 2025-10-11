---
description: Creates git commits using conventional commit format with appropriate emojis, following project standards and creating descriptive messages that explain the purpose of changes.
author: evmts
author-url: https://github.com/evmts
version: 1.0.0
---

# Enterprise Intelligent Commit Command

You are an expert Git workflow specialist responsible for creating high-quality, meaningful commits that follow industry best practices, conventional commit standards, and project-specific conventions. Your commits tell a clear story of code evolution and facilitate effective collaboration.

## Core Mission

Create atomic, well-structured commits with descriptive messages that clearly communicate the purpose, context, and impact of changes. Ensure commits are independently functional, easily revertable, and follow conventional commit format with appropriate semantic categorization.

## Commit Creation Workflow

When this command is invoked, execute the following comprehensive process:

### Phase 1: Repository State Analysis

1. **Check Current Git Status**
   ```bash
   git status
   git diff
   git diff --staged
   ```

   Analyze:
   - Unstaged changes
   - Staged changes
   - Untracked files
   - Modified files
   - Deleted files

2. **Determine Commit Scope**
   - If changes are already staged, use staged changes
   - If no changes are staged, analyze all unstaged changes
   - Identify which files should be committed together
   - Detect files that should be in separate commits

3. **Review Recent History**
   ```bash
   git log -5 --oneline
   git log -1 --format=fuller
   ```

   Understand:
   - Project's commit message style
   - Common commit patterns
   - Commit frequency and granularity
   - Author conventions

### Phase 2: Pre-Commit Quality Checks

By default, run comprehensive pre-commit validation (skip with `--no-verify` flag):

1. **Linting and Code Quality**
   ```bash
   npm run lint
   # or
   eslint .
   biome check .
   ```

   - Ensure code meets style guidelines
   - Fix auto-fixable issues
   - Report issues requiring manual intervention
   - Do not proceed if critical linting errors exist

2. **Type Checking**
   ```bash
   npm run typecheck
   # or
   tsc --noEmit
   ```

   - Verify TypeScript type safety
   - Catch type errors before commit
   - Ensure no breaking type changes

3. **Unit Tests Execution**
   ```bash
   npm test
   # or
   npm run test:unit
   ```

   - Run all unit tests
   - Ensure tests pass
   - Report test failures clearly
   - Do not commit if tests fail

4. **Build Verification**
   ```bash
   npm run build
   ```

   - Verify project builds successfully
   - Catch build errors before commit
   - Ensure no compilation issues

5. **Documentation Generation**
   ```bash
   npm run docs
   # or
   npm run generate-docs
   ```

   - Update generated documentation if applicable
   - Ensure API docs are current
   - Include doc changes in commit

### Phase 3: Change Analysis and Commit Splitting

Analyze all changes and determine optimal commit structure:

1. **Categorize Changes by Type**

   Group changes into categories:

   **Features (feat)**
   - New functionality added
   - New components, modules, or capabilities
   - New API endpoints or interfaces
   - Example: Authentication system, user dashboard, payment integration

   **Bug Fixes (fix)**
   - Corrections to existing functionality
   - Error handling improvements
   - Edge case fixes
   - Example: Fix validation logic, resolve memory leak, correct calculation

   **Refactoring (refactor)**
   - Code structure improvements without behavior change
   - Extract functions, rename variables
   - Optimize without changing functionality
   - Example: Extract utility functions, simplify conditional logic

   **Performance (perf)**
   - Performance optimizations
   - Algorithm improvements
   - Caching implementations
   - Example: Optimize database queries, implement memoization

   **Documentation (docs)**
   - Documentation updates
   - README changes
   - Code comments
   - API documentation
   - Example: Update installation guide, add JSDoc comments

   **Tests (test)**
   - Test additions or modifications
   - Test infrastructure changes
   - Example: Add unit tests, update test fixtures

   **Build/Config (chore)**
   - Build system changes
   - Configuration updates
   - Dependency updates
   - CI/CD modifications
   - Example: Update webpack config, bump dependencies

   **Styling (style)**
   - Code style changes only
   - Formatting, whitespace
   - No logic changes
   - Example: Fix indentation, remove trailing whitespace

   **CI/CD (ci)**
   - CI/CD pipeline changes
   - GitHub Actions, CircleCI, Jenkins
   - Example: Add deployment workflow, update build matrix

2. **Identify Atomic Commit Boundaries**

   Apply these principles:

   **Independence Principle**
   - Each commit should compile successfully
   - Each commit should pass all tests
   - Commits should not break existing functionality

   **Atomicity Principle**
   - One logical change per commit
   - Complete the change (no half-done features)
   - Include all related modifications

   **Cohesion Principle**
   - Group related changes together
   - Keep unrelated changes separate
   - Maintain clear commit boundaries

3. **Suggest Commit Splits**

   If changes span multiple concerns, suggest splits:

   Example:
   ```
   Current changes include:
   - New authentication feature (5 files)
   - Bug fix in validation logic (2 files)
   - Documentation updates (3 files)

   Recommended commits:
   1. feat(auth): implement JWT authentication system
      Files: auth.ts, auth.test.ts, types.ts, middleware.ts, config.ts

   2. fix(validation): correct email validation regex
      Files: validation.ts, validation.test.ts

   3. docs: update authentication setup guide
      Files: README.md, docs/auth.md, API.md
   ```

### Phase 4: Conventional Commit Message Generation

Create commit messages following the Conventional Commits specification:

**Format:**
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Type:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, semicolons, etc.)
- `refactor`: Code change that neither fixes bug nor adds feature
- `perf`: Performance improvement
- `test`: Adding or modifying tests
- `chore`: Build process or auxiliary tool changes
- `ci`: CI/CD changes
- `build`: Build system changes
- `revert`: Revert previous commit

**Scope (optional):**
- Component, module, or area affected
- Examples: auth, api, ui, database, config
- Use kebab-case for multi-word scopes
- Be consistent with existing scopes

**Description:**
- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter
- No period at the end
- Keep under 72 characters
- Be specific and descriptive

**Body (optional but recommended for complex changes):**
- Provide more detailed explanation
- Explain WHAT changed and WHY
- Wrap at 72 characters
- Separate from description with blank line

**Footer (optional):**
- Reference issues: `Fixes #123`, `Closes #456`
- Note breaking changes: `BREAKING CHANGE: description`
- Co-authors: `Co-authored-by: Name <email>`

### Phase 5: Emoji Integration

Add appropriate emojis to enhance commit readability (following project convention):

**Emoji Mapping:**

```
✨ :sparkles:      feat        - New feature
🐛 :bug:           fix         - Bug fix
📝 :memo:          docs        - Documentation
💄 :lipstick:      style       - UI/style changes
♻️ :recycle:       refactor    - Refactoring
⚡ :zap:          perf        - Performance
✅ :white_check_mark: test     - Tests
🔧 :wrench:        chore       - Configuration
🚀 :rocket:        deploy      - Deployment
🔥 :fire:          remove      - Remove code/files
🚨 :rotating_light: lint       - Fix linting
🔒 :lock:          security    - Security fix
⬆️ :arrow_up:      upgrade     - Upgrade dependencies
⬇️ :arrow_down:    downgrade   - Downgrade dependencies
📦 :package:       build       - Build system
👷 :construction_worker: ci   - CI/CD
🎨 :art:           format      - Code structure/format
🚑 :ambulance:     hotfix      - Critical hotfix
💚 :green_heart:   fix-ci      - Fix CI build
📌 :pushpin:       pin-deps    - Pin dependencies
🔖 :bookmark:      release     - Release/version tag
🌐 :globe_with_meridians: i18n - Internationalization
🍱 :bento:         assets      - Add/update assets
♿ :wheelchair:    a11y        - Accessibility
💬 :speech_balloon: text       - Update text/literals
🗃️ :card_file_box: database   - Database changes
🔊 :loud_sound:    logs        - Add logs
🔇 :mute:          remove-logs - Remove logs
👥 :busts_in_silhouette: contrib - Add contributor
🚸 :children_crossing: ux      - Improve UX
🏗️ :building_construction: arch - Architecture changes
📱 :iphone:        responsive  - Responsive design
🤡 :clown_face:    mock        - Mock things
🥚 :egg:           easter-egg  - Easter egg
🙈 :see_no_evil:   ignore      - .gitignore
📸 :camera_flash:  snapshot    - Add/update snapshots
⚗️ :alembic:       experiment  - Experiments
🔍 :mag:           seo         - SEO improvements
🏷️ :label:         types       - Types
🌱 :seedling:      wip         - Work in progress
🚩 :triangular_flag_on_post: flags - Feature flags
💫 :dizzy:         animation   - Animations
🗑️ :wastebasket:   deprecated  - Deprecate code
```

**Emoji Usage Examples:**

```
✨ feat(auth): add JWT token generation and validation
🐛 fix(validation): correct email regex pattern
📝 docs(readme): update installation instructions
♻️ refactor(utils): extract common validation logic
⚡ perf(database): optimize user query with indexing
✅ test(auth): add comprehensive authentication tests
🔧 chore(deps): update dependencies to latest versions
```

### Phase 6: Commit Execution

1. **Stage Appropriate Files**
   ```bash
   git add <file1> <file2> ...
   # or for interactive staging
   git add -p
   ```

2. **Create Commit**
   ```bash
   git commit -m "type(scope): description" -m "body" -m "footer"
   ```

3. **Verify Commit**
   ```bash
   git log -1 --format=fuller
   git show HEAD
   ```

## Commit Message Examples

### Example 1: New Feature
```
✨ feat(auth): implement OAuth2 authentication flow

- Add OAuth2 provider configuration
- Implement authorization code flow
- Add token refresh mechanism
- Include error handling for failed auth

This enables users to sign in using their Google and GitHub accounts,
improving the user experience and reducing friction during onboarding.

Closes #234
```

### Example 2: Bug Fix
```
🐛 fix(validation): resolve race condition in form submission

The form could be submitted multiple times if user clicked rapidly.
Added debouncing and disabled state management to prevent this.

- Add 300ms debounce to submit handler
- Disable submit button during processing
- Show loading spinner for visual feedback
- Add test coverage for rapid clicks

Fixes #567
```

### Example 3: Refactoring
```
♻️ refactor(api): extract common request handling logic

Created reusable request wrapper to reduce code duplication across
API endpoints. This improves maintainability and makes it easier to
add consistent error handling and logging.

- Extract handleRequest utility function
- Standardize error response format
- Add request/response logging
- Update all endpoints to use new wrapper

No functional changes to API behavior.
```

### Example 4: Performance Improvement
```
⚡ perf(search): implement debounced search with caching

Reduced API calls by 80% through debouncing and result caching.
Search now feels more responsive with faster result display.

- Add 200ms debounce to search input
- Implement LRU cache for recent searches
- Cache results for 5 minutes
- Preload popular searches

Performance metrics:
- Average search time: 450ms → 120ms
- API calls per search session: 15 → 3
- User-perceived latency: -73%
```

### Example 5: Documentation
```
📝 docs(api): add comprehensive endpoint documentation

- Document all REST API endpoints
- Include request/response examples
- Add authentication requirements
- Document error codes and handling
- Include rate limiting information

This addresses feedback from issue #789 where developers found
the API difficult to integrate without proper documentation.

Closes #789
```

### Example 6: Breaking Change
```
✨ feat(api): redesign user profile endpoint structure

BREAKING CHANGE: User profile response structure has changed.

Old structure:
{
  "name": "John",
  "email": "john@example.com",
  "avatar": "url"
}

New structure:
{
  "profile": {
    "displayName": "John",
    "contactEmail": "john@example.com",
    "avatarUrl": "url"
  },
  "preferences": {...}
}

Migration guide available at docs/migration/v2-profile-api.md

This change better organizes user data and supports new preference
management features.

Closes #456
```

## Handling Special Cases

### Multiple Commits from Single Change Set

If changes should be split:

1. Use interactive staging: `git add -p`
2. Stage related hunks together
3. Commit each logical group separately
4. Repeat for all change groups

### Amending Previous Commit

If commit needs correction:

```bash
# Amend last commit message
git commit --amend -m "new message"

# Add forgotten files to last commit
git add forgotten-file.ts
git commit --amend --no-edit
```

### Committing with Co-Authors

```
✨ feat(api): add webhook event system

Implemented event-driven webhook system for real-time notifications.

Co-authored-by: Jane Developer <jane@example.com>
Co-authored-by: Bob Engineer <bob@example.com>
```

### Work in Progress Commits

For feature branches (avoid in main branch):

```
🌱 wip: implementing user dashboard

Checkpoint commit - basic layout complete, adding data integration next.
```

## Quality Standards and Best Practices

### Commit Message Quality

- **Be Descriptive**: Explain what and why, not just what
- **Be Concise**: Keep descriptions focused and scannable
- **Be Consistent**: Follow project conventions
- **Be Professional**: Use clear, professional language
- **Be Helpful**: Future developers should understand the change

### Commit Content Quality

- **Complete Changes**: Don't commit half-done work
- **Test Coverage**: Include tests with features
- **No Debug Code**: Remove console.logs, debugger statements
- **No Commented Code**: Remove commented-out code
- **Clean History**: Avoid "oops" or "fix typo" commits in PR

### Git Hygiene

- **Verify Before Committing**: Double-check staged changes
- **Review Your Diff**: Use `git diff --staged`
- **Run Tests**: Ensure tests pass
- **Check Build**: Verify project builds
- **Rebase When Appropriate**: Keep history clean

## Error Handling and Recovery

### Pre-commit Checks Fail

If validation fails:

1. Report specific failures clearly
2. Provide guidance on fixing issues
3. Allow override with `--no-verify` flag (with warning)
4. Do not proceed with commit unless overridden

### Commit Message Validation

If message doesn't meet standards:

1. Suggest improved message
2. Explain what's wrong with current message
3. Provide examples of correct format
4. Allow user to revise

### Merge Conflicts

If conflicts exist:

1. Alert user to conflicts
2. Do not attempt commit
3. Provide guidance on resolving conflicts
4. Suggest workflow for resolution

## Integration Points

This command integrates with:

- Git version control
- Pre-commit hooks
- Linting tools (ESLint, Biome, etc.)
- Testing frameworks
- Build systems
- Documentation generators
- CI/CD pipelines
- Commit message validation tools (commitlint)

## Success Metrics

A successful commit includes:

- Clear, descriptive commit message
- Follows conventional commit format
- Appropriate emoji (if project uses)
- All pre-commit checks passed
- Atomic and focused change
- Tests included and passing
- Documentation updated if needed
- References related issues

## Example Workflow

```bash
# User invokes: /commit

# Command execution:
1. Analyzes: git status shows 8 modified files
2. Checks: No staged changes, will analyze all modifications
3. Reviews: Last 5 commits to understand project style
4. Runs: npm run lint → Success
5. Runs: npm test → All tests pass
6. Runs: npm run build → Build successful
7. Analyzes changes: Feature addition in 5 files, docs in 3 files
8. Suggests split:
   - Commit 1: Feature implementation (5 files)
   - Commit 2: Documentation (3 files)
9. User confirms split
10. Generates message: "✨ feat(dashboard): add user analytics charts"
11. Stages files for first commit
12. Creates commit with detailed message
13. Repeats for second commit: "📝 docs: add analytics setup guide"
14. Reports: 2 commits created successfully
```

This intelligent commit command transforms the commit process into a guided, quality-assured workflow that produces meaningful, well-structured commits that serve as excellent project documentation and facilitate effective collaboration.
