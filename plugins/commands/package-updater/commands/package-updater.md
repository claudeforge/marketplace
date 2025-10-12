# Package Updater

Smart dependency updates with breaking change detection, version compatibility checking, and support for npm, yarn, and pnpm.

## Core Features

- Analyze available updates (patch, minor, major)
- Detect breaking changes from semver and changelogs
- Check peer dependency compatibility
- Universal package manager support (npm/yarn/pnpm)
- Automated update strategies
- Security-first updates

## Version Analysis

```javascript
const semver = require('semver');
const axios = require('axios');

class PackageAnalyzer {
  async getAvailableUpdates(packageName, currentVersion) {
    const url = `https://registry.npmjs.org/${packageName}`;
    const { data } = await axios.get(url);
    const versions = Object.keys(data.versions);

    const updates = { patch: [], minor: [], major: [], latest: data['dist-tags'].latest };

    versions.forEach(version => {
      if (semver.valid(version) && semver.gt(version, currentVersion)) {
        const diff = semver.diff(version, currentVersion);
        if (diff === 'patch') updates.patch.push(version);
        else if (diff === 'minor') updates.minor.push(version);
        else if (diff === 'major') updates.major.push(version);
      }
    });

    updates.patch.sort(semver.rcompare);
    updates.minor.sort(semver.rcompare);
    updates.major.sort(semver.rcompare);

    return updates;
  }

  async analyzeUpdate(packageName, targetVersion) {
    const url = `https://registry.npmjs.org/${packageName}`;
    const { data } = await axios.get(url);
    const versionInfo = data.versions[targetVersion];

    return {
      version: targetVersion,
      releaseDate: data.time[targetVersion],
      deprecated: versionInfo.deprecated || false,
      dependencies: versionInfo.dependencies || {},
      peerDependencies: versionInfo.peerDependencies || {},
      breaking: semver.diff(currentVersion, targetVersion) === 'major'
    };
  }
}

// Usage
const analyzer = new PackageAnalyzer();
const updates = await analyzer.getAvailableUpdates('express', '4.17.1');
console.log('Available updates:', updates);
```

## Package Manager Detection & Commands

```javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class PackageManagerInterface {
  detectPackageManager(projectPath = process.cwd()) {
    if (fs.existsSync(path.join(projectPath, 'package-lock.json'))) return 'npm';
    if (fs.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
    if (fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
    return 'npm';
  }

  updateToVersion(packageName, version) {
    const manager = this.detectPackageManager();
    const commands = {
      npm: `npm install ${packageName}@${version}`,
      yarn: `yarn upgrade ${packageName}@${version}`,
      pnpm: `pnpm update ${packageName}@${version}`
    };
    return execSync(commands[manager], { encoding: 'utf8' });
  }

  outdated() {
    const manager = this.detectPackageManager();
    try {
      const output = execSync(`${manager} outdated --json`, { encoding: 'utf8' });
      return JSON.parse(output);
    } catch (error) {
      return error.stdout ? JSON.parse(error.stdout) : {};
    }
  }
}
```

## Update Strategies

```javascript
class UpdateStrategy {
  async conservative() {
    // Only patch updates (bug fixes)
    const outdated = this.pm.outdated();
    const patchUpdates = Object.entries(outdated)
      .filter(([name, info]) => semver.diff(info.current, info.latest) === 'patch')
      .map(([name, info]) => `${name}@${info.latest}`);

    if (patchUpdates.length > 0) await this.pm.install(patchUpdates);
    return patchUpdates;
  }

  async balanced() {
    // Patch and minor updates (backward compatible)
    const outdated = this.pm.outdated();
    const safeUpdates = Object.entries(outdated)
      .filter(([name, info]) => ['patch', 'minor'].includes(semver.diff(info.current, info.latest)))
      .map(([name, info]) => `${name}@${info.latest}`);

    if (safeUpdates.length > 0) await this.pm.install(safeUpdates);
    return safeUpdates;
  }

  async securityFirst() {
    // Update packages with vulnerabilities first
    const audit = this.pm.audit();
    const vulnerablePackages = new Set();

    Object.values(audit.vulnerabilities || {}).forEach(vuln => {
      if (vuln.via) {
        vuln.via.forEach(v => {
          if (typeof v === 'object' && v.name) vulnerablePackages.add(v.name);
        });
      }
    });

    const updates = Array.from(vulnerablePackages);
    if (updates.length > 0) await this.pm.update(updates);
    return updates;
  }
}
```

## Best Practices

1. **Planning**: Review changelogs before updating major versions
2. **Testing**: Run full test suite after updates
3. **Incremental**: Update one major version at a time
4. **Security**: Prioritize security patches
5. **Lock Files**: Commit lock files for consistency
6. **Automation**: Use renovate or dependabot for continuous updates
7. **CI/CD**: Automate testing in CI pipeline
8. **Rollback**: Have rollback plan ready
9. **Documentation**: Document update decisions
10. **Monitoring**: Monitor application after deployment
