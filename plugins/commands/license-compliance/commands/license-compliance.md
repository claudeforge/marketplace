# License Compliance Scanner

Scan open-source licenses, generate SBOMs, ensure compliance, and manage legal obligations in software projects.

## Core Features

- Scan dependency licenses (npm, yarn, pnpm)
- License compatibility checking
- SBOM generation (SPDX, CycloneDX)
- Policy-based compliance enforcement
- Risk assessment (high/medium/low)
- Automated CI/CD integration

## License Types Reference

```javascript
// Permissive (Low Risk)
const permissive = {
  MIT: { compatible: ['Most licenses'], requires: ['Copyright notice', 'License text'] },
  Apache2: { compatible: ['MIT', 'BSD', 'GPL-3.0'], patentGrant: true },
  BSD: { compatible: ['Most licenses'], noEndorsement: true }
};

// Copyleft (High Risk)
const copyleft = {
  'GPL-2.0': { forces: 'All GPL', sourceDisclosure: true, riskLevel: 'high' },
  'GPL-3.0': { forces: 'All GPL', patentProtection: true, riskLevel: 'high' },
  'AGPL-3.0': { forces: 'All AGPL', networkTrigger: true, riskLevel: 'critical' },
  'LGPL-3.0': { forces: 'Modified library only', allowDynamicLinking: true, riskLevel: 'medium' }
};

// Check compatibility
function checkCompatibility(projectLicense, depLicense) {
  const matrix = {
    'MIT': ['MIT', 'Apache-2.0', 'BSD', 'GPL-2.0', 'GPL-3.0'],
    'Apache-2.0': ['MIT', 'Apache-2.0', 'BSD', 'GPL-3.0'],
    'GPL-3.0': ['MIT', 'Apache-2.0', 'BSD', 'GPL-3.0', 'LGPL-3.0']
  };

  return matrix[projectLicense]?.includes(depLicense) || false;
}
```

## License Scanner

```javascript
const fs = require('fs');
const path = require('path');

class LicenseScanner {
  scan(projectPath) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf8'));
    const nodeModules = path.join(projectPath, 'node_modules');

    const licenses = new Map();
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    for (const [name, version] of Object.entries(deps)) {
      const pkgPath = path.join(nodeModules, name, 'package.json');
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        licenses.set(name, {
          version: pkg.version,
          license: pkg.license || 'UNKNOWN',
          repository: pkg.repository?.url || ''
        });
      }
    }

    return this.generateReport(licenses);
  }

  generateReport(licenses) {
    const licenseGroups = new Map();

    for (const [pkg, info] of licenses) {
      const license = info.license;
      if (!licenseGroups.has(license)) licenseGroups.set(license, []);
      licenseGroups.get(license).push({ package: pkg, ...info });
    }

    const summary = [];
    for (const [license, packages] of licenseGroups) {
      summary.push({
        license,
        count: packages.length,
        percentage: ((packages.length / licenses.size) * 100).toFixed(1)
      });
    }

    return { totalPackages: licenses.size, licenses: licenseGroups, summary };
  }
}

// Usage
const scanner = new LicenseScanner();
const report = scanner.scan(process.cwd());
console.log(`Total: ${report.totalPackages}`);
report.summary.forEach(s => console.log(`${s.license}: ${s.count} (${s.percentage}%)`));
```

## Policy-Based Compliance

```javascript
class LicensePolicy {
  constructor() {
    this.rules = { allowed: [], disallowed: [], requiresReview: [] };
  }

  setAllowed(licenses) { this.rules.allowed = licenses; return this; }
  setDisallowed(licenses) { this.rules.disallowed = licenses; return this; }
  setRequiresReview(licenses) { this.rules.requiresReview = licenses; return this; }

  evaluate(license) {
    if (this.rules.disallowed.includes(license)) {
      return { approved: false, action: 'reject', reason: `${license} is disallowed` };
    }
    if (this.rules.allowed.includes(license)) {
      return { approved: true, action: 'approve', reason: `${license} is approved` };
    }
    if (this.rules.requiresReview.includes(license)) {
      return { approved: false, action: 'review', reason: `${license} requires manual review` };
    }
    return { approved: false, action: 'review', reason: 'Not in policy' };
  }

  evaluateAll(dependencies) {
    const results = { approved: [], rejected: [], needsReview: [] };

    for (const [name, info] of Object.entries(dependencies)) {
      const evaluation = this.evaluate(info.license);
      const entry = { package: name, ...info, ...evaluation };

      if (evaluation.action === 'approve') results.approved.push(entry);
      else if (evaluation.action === 'reject') results.rejected.push(entry);
      else results.needsReview.push(entry);
    }

    return results;
  }
}

// Usage
const policy = new LicensePolicy()
  .setAllowed(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC'])
  .setDisallowed(['GPL-2.0', 'GPL-3.0', 'AGPL-3.0'])
  .setRequiresReview(['LGPL-2.1', 'LGPL-3.0', 'MPL-2.0']);

const evaluation = policy.evaluateAll(dependencies);
console.log('Rejected:', evaluation.rejected.length);
console.log('Needs Review:', evaluation.needsReview.length);
```

## CI/CD Integration

```yaml
# .github/workflows/license-check.yml
name: License Compliance

on: [pull_request, push]

jobs:
  license-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm install -g license-checker
      - run: license-checker --json --out licenses.json
      - run: node scripts/check-licenses.js
```

```javascript
// scripts/check-licenses.js
const fs = require('fs');
const allowedLicenses = ['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC'];

const licenses = JSON.parse(fs.readFileSync('licenses.json', 'utf8'));
const violations = [];

for (const [pkg, info] of Object.entries(licenses)) {
  if (!allowedLicenses.includes(info.licenses)) {
    violations.push({ package: pkg, license: info.licenses });
  }
}

if (violations.length > 0) {
  console.error('License violations:');
  violations.forEach(v => console.error(`  - ${v.package}: ${v.license}`));
  process.exit(1);
}

console.log('All licenses compliant!');
```

## Best Practices

1. **Proactive**: Define license policy before starting project
2. **Automation**: Automate scanning in CI/CD pipeline
3. **Review**: Review licenses for all new dependencies
4. **SBOM**: Maintain SBOM as part of release artifacts
5. **Documentation**: Document license obligations and exceptions
6. **Legal**: Include legal review for copyleft licenses
7. **Updates**: Track license changes over time
8. **Training**: Train developers on license compliance
9. **Remediation**: Replace incompatible dependencies promptly
10. **Archival**: Archive compliance reports for audits
