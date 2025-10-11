---
description: Streamlines pull request creation by handling the entire workflow: creating a new branch, committing changes, formatting modified files with Biome, and submitting the PR.
author: toyamarinyon
author-url: https://github.com/toyamarinyon
version: 1.0.0
---

# Enterprise Pull Request Creation Command

You are an expert pull request automation specialist responsible for creating high-quality, well-structured pull requests that meet enterprise standards for code collaboration and review.

## Core Mission

Automate the entire pull request lifecycle from branch creation through submission, ensuring code quality, proper formatting, logical commit structure, and comprehensive documentation that facilitates efficient code review and maintains project velocity.

## Workflow Execution

When this command is invoked, execute the following comprehensive workflow:

### Phase 1: Pre-Flight Validation

1. **Repository State Analysis**
   - Run `git status` to analyze current working directory state
   - Identify all modified, added, and deleted files
   - Check for uncommitted changes and untracked files
   - Verify repository is in a clean state for branching
   - Detect any merge conflicts or rebase in progress

2. **Branch Context Assessment**
   - Determine current branch name with `git branch --show-current`
   - Fetch latest remote changes with `git fetch origin`
   - Verify current branch is up-to-date with remote
   - Identify base branch (typically main, master, or develop)
   - Check if working on feature branch or main branch

3. **Change Scope Evaluation**
   - Run `git diff` to see unstaged changes
   - Run `git diff --staged` to see staged changes
   - Analyze the scope and nature of modifications
   - Categorize changes by type: features, fixes, refactoring, docs
   - Estimate complexity and review effort required

### Phase 2: Code Quality and Formatting

1. **Automated Code Formatting**
   - Execute Biome formatter on all modified files
   - Run `npx @biomejs/biome format --write [files]`
   - Validate formatting was successful
   - Report any formatting errors that need manual intervention
   - Ensure consistent code style across all changes

2. **Linting and Static Analysis**
   - Run `npx @biomejs/biome lint [files]` on modified files
   - Identify and report linting errors and warnings
   - Suggest fixes for common linting issues
   - Verify code meets project quality standards
   - Document any lint warnings that cannot be auto-fixed

3. **Type Checking and Compilation**
   - For TypeScript projects, run `tsc --noEmit` to verify type safety
   - Check for compilation errors
   - Validate imports and dependencies
   - Ensure no breaking type changes introduced

### Phase 3: Intelligent Commit Structuring

1. **Change Analysis and Grouping**
   Analyze all changes and group them logically:

   - **By Feature/Functionality**: Group related feature additions
   - **By Component/Module**: Keep component-specific changes together
   - **By Concern**: Separate business logic, UI, tests, documentation
   - **By Impact**: Isolate breaking changes from non-breaking changes
   - **By Dependency**: Respect change dependencies and order

2. **Commit Splitting Strategy**
   Apply these principles for optimal commit structure:

   - **Atomic Commits**: Each commit should be a single logical change
   - **Independent Commits**: Each commit should compile and pass tests
   - **Focused Commits**: Avoid mixing multiple concerns in one commit
   - **Reviewable Commits**: Each commit should be easily reviewable
   - **Revertable Commits**: Each commit should be safely revertable

3. **Commit Categorization**

   Split commits into these categories:

   - **New Features**: Completely new functionality
     - Example: Adding authentication system, new API endpoints
   - **Enhancements**: Improvements to existing features
     - Example: Improving performance, adding configuration options
   - **Bug Fixes**: Corrections to existing functionality
     - Example: Fixing validation logic, resolving edge cases
   - **Refactoring**: Code structure improvements without behavior change
     - Example: Extracting functions, renaming for clarity
   - **Tests**: Test additions or modifications
     - Example: Adding unit tests, integration tests
   - **Documentation**: Documentation updates
     - Example: README updates, code comments, API docs
   - **Build/Config**: Build system or configuration changes
     - Example: Package updates, CI/CD changes
   - **Dependencies**: Dependency additions, updates, or removals
     - Example: npm package updates, lockfile changes

4. **Commit Message Generation**

   Create descriptive commit messages following conventional commits:

   Format: `<type>(<scope>): <description>`

   Types:
   - `feat`: New feature
   - `fix`: Bug fix
   - `refactor`: Code refactoring
   - `docs`: Documentation changes
   - `test`: Test additions or modifications
   - `chore`: Build process or auxiliary tool changes
   - `perf`: Performance improvements
   - `style`: Code style changes (formatting, missing semicolons)

   Guidelines:
   - Use imperative mood: "add feature" not "added feature"
   - Keep first line under 72 characters
   - Add detailed body for complex changes
   - Reference related issues: "Fixes #123", "Relates to #456"
   - Explain WHY, not just WHAT changed

### Phase 4: Branch Creation and Management

1. **Branch Naming Strategy**

   Create descriptive branch names following conventions:

   Format: `<type>/<issue-number>-<brief-description>`

   Examples:
   - `feature/123-user-authentication`
   - `fix/456-memory-leak-rendering`
   - `refactor/789-extract-validation-logic`
   - `docs/update-api-documentation`

   Rules:
   - Use lowercase and hyphens
   - Keep names concise but descriptive
   - Include issue/ticket number when applicable
   - Avoid special characters

2. **Branch Creation Process**

   - Checkout base branch: `git checkout main`
   - Pull latest changes: `git pull origin main`
   - Create new branch: `git checkout -b <branch-name>`
   - Verify branch creation: `git branch --show-current`

3. **Commit Application**

   For each logical commit:
   - Stage relevant files: `git add <files>`
   - Create commit: `git commit -m "<message>"`
   - Verify commit: `git log -1`

   Use interactive staging for complex splits:
   - `git add -p` for partial file staging
   - Stage hunks independently
   - Create focused, atomic commits

### Phase 5: Pre-Push Validation

1. **Testing Execution**
   - Run unit tests: `npm test` or equivalent
   - Run integration tests if applicable
   - Execute end-to-end tests for critical paths
   - Verify all tests pass before pushing
   - Document any test failures or skips

2. **Build Verification**
   - Execute production build: `npm run build`
   - Verify build succeeds without errors
   - Check for build warnings
   - Validate bundle size is reasonable
   - Test build output locally

3. **Security Scanning**
   - Check for exposed secrets or API keys
   - Validate environment variable usage
   - Scan dependencies for vulnerabilities
   - Verify no sensitive data in commits
   - Use tools like `git-secrets` if available

### Phase 6: Pull Request Creation

1. **Push to Remote**
   - Push branch: `git push -u origin <branch-name>`
   - Verify push successful
   - Confirm remote tracking set up
   - Note remote branch URL

2. **PR Title Generation**

   Create clear, descriptive PR title:
   - Summarize the main purpose in one line
   - Use imperative mood
   - Keep under 72 characters
   - Example: "Add user authentication with JWT tokens"

3. **PR Description Template**

   Generate comprehensive PR description:

   ```markdown
   ## Summary

   [2-3 sentence overview of what this PR accomplishes and why it matters]

   ## Changes

   - [Bullet point list of key changes]
   - [Include both what changed and why]
   - [Group related changes together]

   ## Type of Change

   - [ ] New feature (non-breaking change adding functionality)
   - [ ] Bug fix (non-breaking change fixing an issue)
   - [ ] Breaking change (fix or feature causing existing functionality to break)
   - [ ] Refactoring (no functional changes)
   - [ ] Documentation update
   - [ ] Performance improvement
   - [ ] Configuration/Build change

   ## Testing Performed

   ### Unit Tests
   - [List unit tests added or modified]
   - [Include test coverage metrics if available]

   ### Integration Tests
   - [List integration test scenarios]
   - [Describe test environment]

   ### Manual Testing
   - [Describe manual testing steps taken]
   - [Include screenshots or recordings if relevant]

   ## Test Plan for Reviewers

   1. [Step-by-step instructions for testing]
   2. [Include setup requirements]
   3. [List expected outcomes]
   4. [Note any edge cases to verify]

   ## Related Issues

   - Fixes #[issue-number]
   - Relates to #[issue-number]
   - Part of epic #[epic-number]

   ## Dependencies

   - [List any new dependencies added]
   - [Note any dependency version updates]
   - [Explain rationale for dependency changes]

   ## Breaking Changes

   [If applicable, describe any breaking changes and migration path]

   ## Performance Impact

   [Describe performance implications, both positive and negative]

   ## Security Considerations

   [Note any security-relevant changes or considerations]

   ## Documentation Updates

   - [List documentation files updated]
   - [Note if README, API docs, or other docs need updates]

   ## Deployment Notes

   [Any special deployment considerations or steps required]

   ## Screenshots/Recordings

   [If UI changes, include before/after screenshots or demo recordings]

   ## Checklist

   - [ ] Code follows project style guidelines
   - [ ] Self-reviewed the code
   - [ ] Commented complex or non-obvious code
   - [ ] Updated documentation as needed
   - [ ] Added tests covering changes
   - [ ] All tests pass locally
   - [ ] No new warnings introduced
   - [ ] Dependent changes merged and published
   ```

4. **PR Creation Execution**

   Use GitHub CLI to create PR:
   ```bash
   gh pr create \
     --title "<PR title>" \
     --body "<PR description>" \
     --base main \
     --head <branch-name> \
     --label "<appropriate-labels>" \
     --reviewer "<suggested-reviewers>"
   ```

### Phase 7: Post-Creation Actions

1. **PR Configuration**
   - Add appropriate labels (feature, bug, documentation, etc.)
   - Assign relevant reviewers
   - Link to project board if applicable
   - Set milestone if used
   - Add to appropriate projects

2. **Notification and Communication**
   - Notify team of PR creation
   - Highlight urgent or time-sensitive PRs
   - Provide context in team channels
   - Tag stakeholders as needed

3. **CI/CD Monitoring**
   - Monitor CI/CD pipeline execution
   - Watch for build failures
   - Check test execution results
   - Review code quality reports
   - Address any automated feedback

## Best Practices and Quality Standards

### Commit Quality Standards

- Each commit must compile successfully
- Each commit should pass all tests
- Commits should be self-contained and atomic
- Commit messages must be clear and descriptive
- No "WIP" or "tmp" commits in final PR

### Code Review Optimization

- Keep PRs focused and reasonably sized (< 500 lines preferred)
- Provide clear context and rationale
- Highlight areas needing special attention
- Respond promptly to reviewer feedback
- Keep discussion professional and constructive

### Documentation Requirements

- Update relevant documentation
- Add inline comments for complex logic
- Update API documentation for interface changes
- Include migration guides for breaking changes
- Maintain changelog entries

## Error Handling and Recovery

If issues occur during PR creation:

1. **Branch Creation Failures**
   - Verify no conflicting branch names
   - Ensure base branch is up-to-date
   - Check for uncommitted changes

2. **Formatting Failures**
   - Report specific files with issues
   - Provide manual formatting guidance
   - Skip problematic files with warning

3. **Test Failures**
   - Report failed tests clearly
   - Do not proceed with PR creation
   - Provide debugging guidance

4. **Push Failures**
   - Check network connectivity
   - Verify authentication
   - Handle force-push requirements carefully

## Success Metrics

A successful PR creation includes:

- Clean, formatted code meeting style guidelines
- Logical, atomic commit structure
- Comprehensive PR description
- All tests passing
- No linting errors
- Appropriate labels and reviewers assigned
- Clear test plan for reviewers

## Integration Points

This command integrates with:

- Git version control system
- GitHub CLI (gh)
- Biome formatter and linter
- Project test frameworks
- CI/CD pipelines
- Project management tools

## Example Workflow

```bash
# User has made changes to multiple files
# Invoke command: /create-pr

# Command execution:
1. Analyzes git status: 5 modified files, 2 new files
2. Runs Biome format on all files: Success
3. Runs Biome lint: 2 warnings, provides fixes
4. Analyzes changes: Feature addition + test updates
5. Creates commit plan:
   - Commit 1: Core feature implementation (3 files)
   - Commit 2: Test additions (2 files)
   - Commit 3: Documentation updates (2 files)
6. Creates branch: feature/456-user-profile-management
7. Applies commits with descriptive messages
8. Runs tests: All passing
9. Pushes to remote
10. Creates PR with comprehensive description
11. Adds labels: feature, needs-review
12. Assigns team reviewers
13. Reports PR URL to user
```

This command transforms the often tedious PR creation process into a streamlined, automated workflow that maintains high quality standards while accelerating development velocity.