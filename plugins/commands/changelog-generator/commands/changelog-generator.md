---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge automated changelog generation with conventional commits, semantic versioning, and release notes.
---

# ClaudeForge Changelog Generator

ClaudeForge intelligent changelog and release notes generation system that automatically creates comprehensive, well-formatted changelogs from conventional commits, manages semantic versioning, and produces professional release documentation.

## Purpose

Transform changelog management from manual documentation to intelligent automation that ensures consistency, completeness, and professional presentation of project changes while maintaining semantic versioning standards.

## Features

- **Conventional Commits**: Parse and categorize commits following conventional commit format
- **Semantic Versioning**: Automatic version bumping based on commit types
- **Changelog Generation**: Generate CHANGELOG.md with proper formatting
- **Release Notes**: Create detailed release notes for GitHub/GitLab releases
- **Breaking Changes**: Highlight breaking changes prominently
- **Multi-Format**: Support Markdown, HTML, JSON output formats
- **Customization**: Configurable sections, templates, and formatting
- **Integration**: GitHub/GitLab releases, npm version, and CI/CD integration

## Usage

```bash
/changelog-generator [action] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current scope)

### Changelog Generation

**Generate Changelog:**
```bash
/changelog-generator generate --from=v1.0.0 --to=HEAD --output=CHANGELOG.md
```
Generates comprehensive changelog with:
- Conventional commit parsing (feat, fix, docs, style, refactor, test, chore)
- Automatic categorization by commit type
- Breaking changes section (BREAKING CHANGE footer)
- Scope-based organization (api, ui, auth)
- Author attribution and PR references
- Commit links to repository
- Comparison links between versions
- Release date timestamps

**Update Changelog:**
```bash
/changelog-generator update --version=2.1.0 --prepend=true
```
Updates existing CHANGELOG.md with:
- New version section at the top
- Preservation of existing content
- Proper version header formatting
- Date of release
- Version comparison links
- Unreleased section management
- Consistent formatting throughout
- Validation of markdown structure

**Release Notes:**
```bash
/changelog-generator release-notes --version=2.1.0 --highlights=true
```
Creates release notes including:
- Version number and date
- Summary of key changes
- Feature highlights with descriptions
- Bug fixes and improvements
- Breaking changes with migration guides
- Deprecation notices
- Security fixes (CVE references)
- Contributors acknowledgment
- Installation/upgrade instructions

### Semantic Versioning

**Version Bump:**
```bash
/changelog-generator bump --type=minor --dry-run=false
```
Determines version bump based on:
- Major bump: BREAKING CHANGE commits or breaking: type
- Minor bump: feat commits (new features)
- Patch bump: fix commits (bug fixes)
- Pre-release versions (alpha, beta, rc)
- Version tagging in git
- package.json version update
- Changelog version synchronization
- Automatic git tag creation

**Next Version:**
```bash
/changelog-generator next-version --commits=origin/main..HEAD
```
Calculates next version by analyzing:
- Commit history since last release
- Conventional commit types
- Breaking change indicators
- Pre-release identifiers
- Version constraints
- Manual override options
- Branching strategy (main, develop, feature)
- Release candidate numbering

**Version Validation:**
```bash
/changelog-generator validate-version --version=2.1.0-beta.3
```
Validates semantic version format:
- Major.Minor.Patch format compliance
- Pre-release identifier validity
- Build metadata validation
- Version comparison and ordering
- Backward compatibility checks
- Version range satisfaction
- npm/yarn version compatibility
- Consistency across package files

### Commit Analysis

**Parse Commits:**
```bash
/changelog-generator parse --range=v1.0.0..HEAD --format=json
```
Parses conventional commits with:
- Type extraction (feat, fix, docs, etc.)
- Scope identification (api, ui, core)
- Subject/description parsing
- Body content extraction
- Footer parsing (BREAKING CHANGE, Closes, Refs)
- Multi-line commit support
- Co-authored-by extraction
- Sign-off and trailer parsing

**Validate Commits:**
```bash
/changelog-generator validate-commits --strict=true --from=HEAD~10
```
Validates commit message format:
- Conventional commits specification compliance
- Type allowlist enforcement
- Scope validation against config
- Subject line length limits (72 chars)
- Body wrapping at 100 characters
- Footer format validation
- Breaking change syntax
- Issue reference format

**Commit Statistics:**
```bash
/changelog-generator stats --from=v1.0.0 --group-by=author
```
Generates commit statistics including:
- Commit count by type
- Top contributors
- Commits per day/week/month
- Breaking changes count
- Average commit frequency
- File change statistics
- Lines added/removed
- Most active areas/scopes

### Customization

**Configure Templates:**
```bash
/changelog-generator config --template=./changelog-template.hbs
```
Customizes changelog with:
- Handlebars template support
- Custom section headers
- Commit grouping strategies
- Formatting preferences (bullets, numbers)
- Link format customization
- Date format localization
- Emoji support for commit types
- Custom footer content

**Section Configuration:**
```bash
/changelog-generator configure-sections --preset=angular
```
Defines changelog sections:
- Feature section (feat commits)
- Bug Fixes section (fix commits)
- Performance Improvements (perf)
- Breaking Changes (BREAKING CHANGE)
- Deprecations (deprecated)
- Documentation (docs)
- Chores and maintenance
- Custom sections with patterns

**Exclusion Rules:**
```bash
/changelog-generator exclude --pattern="^chore(release|deps)" --scopes=internal
```
Excludes commits from changelog:
- Commit type exclusions (chore, style, test)
- Scope-based filtering
- Pattern matching for subjects
- Bot commits (dependabot, renovate)
- Merge commits
- Revert commits
- WIP commits
- Internal changes

## Code Generation Examples

### Conventional Commit Parser (TypeScript)
```typescript
interface ConventionalCommit {
  type: string;
  scope?: string;
  breaking: boolean;
  subject: string;
  body?: string;
  footer?: string;
  references: string[];
  mentions: string[];
  notes: Note[];
  hash: string;
  author: string;
  date: Date;
}

interface Note {
  title: string;
  text: string;
}

class ChangelogGenerator {
  private commitPattern = /^(\w+)(\(([^\)]+)\))?(!)?:\s(.+)$/;

  parseCommit(commit: GitCommit): ConventionalCommit | null {
    const lines = commit.message.split('\n');
    const headerMatch = lines[0].match(this.commitPattern);

    if (!headerMatch) {
      return null;
    }

    const [, type, , scope, breaking, subject] = headerMatch;
    const body = this.extractBody(lines);
    const footer = this.extractFooter(lines);
    const notes = this.extractNotes(footer);
    const references = this.extractReferences(footer);
    const mentions = this.extractMentions(commit.message);

    return {
      type,
      scope,
      breaking: breaking === '!' || notes.some(n => n.title === 'BREAKING CHANGE'),
      subject,
      body,
      footer,
      references,
      mentions,
      notes,
      hash: commit.hash,
      author: commit.author,
      date: commit.date
    };
  }

  private extractBody(lines: string[]): string | undefined {
    const bodyStart = 1;
    const bodyEnd = lines.findIndex((line, i) => i > 0 && /^[A-Z][a-z-]+:/.test(line));

    if (bodyEnd === -1) {
      return lines.slice(bodyStart).join('\n').trim() || undefined;
    }

    return lines.slice(bodyStart, bodyEnd).join('\n').trim() || undefined;
  }

  private extractFooter(lines: string[]): string | undefined {
    const footerStart = lines.findIndex((line, i) => i > 0 && /^[A-Z][a-z-]+:/.test(line));

    if (footerStart === -1) {
      return undefined;
    }

    return lines.slice(footerStart).join('\n').trim();
  }

  private extractNotes(footer?: string): Note[] {
    if (!footer) return [];

    const notes: Note[] = [];
    const notePattern = /^([A-Z][A-Z\s-]+):\s(.+)$/gm;
    let match;

    while ((match = notePattern.exec(footer)) !== null) {
      notes.push({
        title: match[1].trim(),
        text: match[2].trim()
      });
    }

    return notes;
  }

  private extractReferences(footer?: string): string[] {
    if (!footer) return [];

    const references: string[] = [];
    const patterns = [
      /(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s#(\d+)/gi,
      /(?:ref|refs|references)\s#(\d+)/gi,
      /#(\d+)/g
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(footer)) !== null) {
        references.push(match[1]);
      }
    });

    return [...new Set(references)];
  }

  private extractMentions(message: string): string[] {
    const mentions = message.match(/@([a-zA-Z0-9_-]+)/g);
    return mentions ? mentions.map(m => m.substring(1)) : [];
  }

  generateChangelog(commits: ConventionalCommit[], version: string): string {
    const grouped = this.groupCommits(commits);
    const date = new Date().toISOString().split('T')[0];

    let changelog = `## [${version}](${this.compareUrl(version)}) (${date})\n\n`;

    // Breaking changes first
    if (grouped.breaking.length > 0) {
      changelog += '### ⚠ BREAKING CHANGES\n\n';
      grouped.breaking.forEach(commit => {
        changelog += `* ${commit.subject}\n`;
        const breakingNote = commit.notes.find(n => n.title === 'BREAKING CHANGE');
        if (breakingNote) {
          changelog += `\n  ${breakingNote.text}\n\n`;
        }
      });
      changelog += '\n';
    }

    // Features
    if (grouped.feat.length > 0) {
      changelog += '### Features\n\n';
      grouped.feat.forEach(commit => {
        const scope = commit.scope ? `**${commit.scope}:** ` : '';
        changelog += `* ${scope}${commit.subject} ([${commit.hash.substring(0, 7)}](${this.commitUrl(commit.hash)}))\n`;
      });
      changelog += '\n';
    }

    // Bug fixes
    if (grouped.fix.length > 0) {
      changelog += '### Bug Fixes\n\n';
      grouped.fix.forEach(commit => {
        const scope = commit.scope ? `**${commit.scope}:** ` : '';
        const refs = commit.references.length > 0
          ? `, closes ${commit.references.map(r => `#${r}`).join(', ')}`
          : '';
        changelog += `* ${scope}${commit.subject} ([${commit.hash.substring(0, 7)}](${this.commitUrl(commit.hash)}))${refs}\n`;
      });
      changelog += '\n';
    }

    // Performance improvements
    if (grouped.perf.length > 0) {
      changelog += '### Performance Improvements\n\n';
      grouped.perf.forEach(commit => {
        const scope = commit.scope ? `**${commit.scope}:** ` : '';
        changelog += `* ${scope}${commit.subject} ([${commit.hash.substring(0, 7)}](${this.commitUrl(commit.hash)}))\n`;
      });
      changelog += '\n';
    }

    return changelog;
  }

  private groupCommits(commits: ConventionalCommit[]): Record<string, ConventionalCommit[]> {
    const grouped: Record<string, ConventionalCommit[]> = {
      breaking: [],
      feat: [],
      fix: [],
      perf: [],
      docs: [],
      style: [],
      refactor: [],
      test: [],
      chore: []
    };

    commits.forEach(commit => {
      if (commit.breaking) {
        grouped.breaking.push(commit);
      }
      if (grouped[commit.type]) {
        grouped[commit.type].push(commit);
      }
    });

    return grouped;
  }

  determineVersionBump(commits: ConventionalCommit[]): 'major' | 'minor' | 'patch' {
    const hasBreaking = commits.some(c => c.breaking);
    if (hasBreaking) return 'major';

    const hasFeature = commits.some(c => c.type === 'feat');
    if (hasFeature) return 'minor';

    return 'patch';
  }

  bumpVersion(currentVersion: string, bump: 'major' | 'minor' | 'patch'): string {
    const [major, minor, patch] = currentVersion.split('.').map(Number);

    switch (bump) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}`;
    }
  }

  private commitUrl(hash: string): string {
    return `https://github.com/owner/repo/commit/${hash}`;
  }

  private compareUrl(version: string): string {
    return `https://github.com/owner/repo/compare/v${this.previousVersion}...v${version}`;
  }
}
```

### GitHub Release Generator (Python)
```python
import re
from datetime import datetime
from typing import List, Dict, Optional
from dataclasses import dataclass

@dataclass
class Commit:
    hash: str
    type: str
    scope: Optional[str]
    subject: str
    body: Optional[str]
    breaking: bool
    references: List[str]
    author: str
    date: datetime

class ReleaseNotesGenerator:
    COMMIT_PATTERN = re.compile(
        r'^(?P<type>\w+)'
        r'(?:\((?P<scope>[^\)]+)\))?'
        r'(?P<breaking>!)?'
        r':\s(?P<subject>.+)$'
    )

    def __init__(self, repo_owner: str, repo_name: str):
        self.repo_owner = repo_owner
        self.repo_name = repo_name

    def generate_release_notes(
        self,
        commits: List[Commit],
        version: str,
        previous_version: str
    ) -> str:
        """Generate comprehensive GitHub release notes"""

        notes = f"# Release {version}\n\n"

        # Summary section
        summary = self._generate_summary(commits)
        notes += f"{summary}\n\n"

        # Highlights
        highlights = self._extract_highlights(commits)
        if highlights:
            notes += "## Highlights\n\n"
            for highlight in highlights:
                notes += f"- {highlight}\n"
            notes += "\n"

        # Breaking changes
        breaking = [c for c in commits if c.breaking]
        if breaking:
            notes += "## ⚠️ Breaking Changes\n\n"
            for commit in breaking:
                notes += f"- **{commit.subject}**\n"
                if commit.body:
                    notes += f"  \n  {commit.body}\n"
                notes += "\n"

        # Features
        features = [c for c in commits if c.type == 'feat']
        if features:
            notes += "## New Features\n\n"
            for commit in self._group_by_scope(features):
                scope_prefix = f"**{commit.scope}**: " if commit.scope else ""
                notes += f"- {scope_prefix}{commit.subject} "
                notes += f"([{commit.hash[:7]}]({self._commit_url(commit.hash)}))\n"
            notes += "\n"

        # Bug fixes
        fixes = [c for c in commits if c.type == 'fix']
        if fixes:
            notes += "## Bug Fixes\n\n"
            for commit in self._group_by_scope(fixes):
                scope_prefix = f"**{commit.scope}**: " if commit.scope else ""
                refs = f" (fixes #{', #'.join(commit.references)})" if commit.references else ""
                notes += f"- {scope_prefix}{commit.subject}{refs} "
                notes += f"([{commit.hash[:7]}]({self._commit_url(commit.hash)}))\n"
            notes += "\n"

        # Performance improvements
        perf = [c for c in commits if c.type == 'perf']
        if perf:
            notes += "## Performance Improvements\n\n"
            for commit in perf:
                scope_prefix = f"**{commit.scope}**: " if commit.scope else ""
                notes += f"- {scope_prefix}{commit.subject} "
                notes += f"([{commit.hash[:7]}]({self._commit_url(commit.hash)}))\n"
            notes += "\n"

        # Contributors
        contributors = self._get_contributors(commits)
        notes += "## Contributors\n\n"
        notes += f"This release was made possible by {len(contributors)} contributor(s):\n\n"
        for author in contributors:
            notes += f"- @{author}\n"
        notes += "\n"

        # Installation instructions
        notes += self._generate_installation_instructions(version)

        # Comparison link
        compare_url = self._compare_url(previous_version, version)
        notes += f"\n**Full Changelog**: {compare_url}\n"

        return notes

    def _generate_summary(self, commits: List[Commit]) -> str:
        """Generate release summary"""
        feat_count = len([c for c in commits if c.type == 'feat'])
        fix_count = len([c for c in commits if c.type == 'fix'])
        breaking_count = len([c for c in commits if c.breaking])

        summary = f"This release includes "
        parts = []

        if feat_count > 0:
            parts.append(f"{feat_count} new feature{'s' if feat_count > 1 else ''}")
        if fix_count > 0:
            parts.append(f"{fix_count} bug fix{'es' if fix_count > 1 else ''}")
        if breaking_count > 0:
            parts.append(f"{breaking_count} breaking change{'s' if breaking_count > 1 else ''}")

        if not parts:
            return "This release includes minor updates and improvements."

        return summary + ", ".join(parts) + "."

    def _extract_highlights(self, commits: List[Commit]) -> List[str]:
        """Extract highlights from commit messages"""
        highlights = []

        for commit in commits:
            # Look for highlights in commit body
            if commit.body and 'highlight:' in commit.body.lower():
                match = re.search(r'highlight:\s*(.+)', commit.body, re.IGNORECASE)
                if match:
                    highlights.append(match.group(1))

        return highlights

    def _group_by_scope(self, commits: List[Commit]) -> List[Commit]:
        """Sort commits by scope"""
        return sorted(commits, key=lambda c: (c.scope or '', c.subject))

    def _get_contributors(self, commits: List[Commit]) -> List[str]:
        """Get unique list of contributors"""
        authors = set(c.author for c in commits)
        return sorted(authors)

    def _commit_url(self, hash: str) -> str:
        """Generate commit URL"""
        return f"https://github.com/{self.repo_owner}/{self.repo_name}/commit/{hash}"

    def _compare_url(self, from_version: str, to_version: str) -> str:
        """Generate comparison URL"""
        return f"https://github.com/{self.repo_owner}/{self.repo_name}/compare/v{from_version}...v{to_version}"

    def _generate_installation_instructions(self, version: str) -> str:
        """Generate installation instructions"""
        return f"""## Installation

### npm
```bash
npm install {self.repo_name}@{version}
```

### yarn
```bash
yarn add {self.repo_name}@{version}
```

### pnpm
```bash
pnpm add {self.repo_name}@{version}
```
"""
```

## Best Practices

### Commit Message Format
- **Conventional Commits**: Follow conventional commits specification
- **Clear Subjects**: Write clear, concise commit subjects (50 chars)
- **Detailed Bodies**: Provide context in commit body when needed
- **Breaking Changes**: Always document breaking changes in footer
- **Issue References**: Link commits to issues with Closes/Fixes

### Changelog Management
- **Keep Updated**: Update CHANGELOG.md with every release
- **Unreleased Section**: Maintain unreleased section for upcoming changes
- **Consistent Format**: Use consistent formatting throughout
- **Version Links**: Include comparison links between versions
- **Date Stamps**: Always include release dates

### Release Process
- **Semantic Versioning**: Strictly follow semantic versioning rules
- **Release Notes**: Create detailed release notes for each version
- **Tag Creation**: Create git tags for all releases
- **Automation**: Automate changelog generation in CI/CD
- **Review Process**: Review generated changelogs before publishing

### Documentation
- **Migration Guides**: Provide migration guides for breaking changes
- **Deprecation Notices**: Document deprecated features clearly
- **Examples**: Include usage examples for new features
- **Credits**: Acknowledge contributors and community
- **Links**: Provide links to documentation and resources

---

**ClaudeForge Changelog Generator** - Enterprise-grade changelog automation with conventional commits, semantic versioning, and professional release documentation for modern software projects.
