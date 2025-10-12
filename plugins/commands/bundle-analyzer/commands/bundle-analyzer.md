---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge bundle size analysis and optimization specialist for webpack, rollup, and modern build tools.
---

# ClaudeForge Bundle Analyzer

ClaudeForge intelligent bundle analysis system that identifies, analyzes, and optimizes JavaScript bundle sizes with comprehensive visualization, tree shaking recommendations, and automated code splitting strategies.

## Purpose

Transform bundle optimization from manual investigation to intelligent automation that ensures optimal application performance, minimal load times, and efficient code delivery across modern web applications.

## Features

- **Bundle Analysis**: Deep analysis of webpack, rollup, and vite bundles with visual dependency graphs
- **Size Optimization**: Identify and eliminate bloated dependencies and unused code
- **Tree Shaking**: Optimize tree shaking configuration for maximum dead code elimination
- **Code Splitting**: Intelligent code splitting strategies for optimal chunk sizes
- **Dependency Audit**: Analyze dependency tree and identify duplicate or redundant packages
- **Performance Metrics**: Measure real-world performance impact with Web Vitals integration
- **Report Generation**: Comprehensive reports with actionable optimization recommendations
- **CI/CD Integration**: Automated bundle size monitoring in continuous integration pipelines

## Usage

```bash
/bundle-analyzer [command] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current build output)

### Analysis Commands

**Full Bundle Analysis:**
```bash
/bundle-analyzer analyze --build-dir=dist --format=html
```
Generates comprehensive bundle analysis including:
- Visual treemap of bundle composition
- Module size breakdown by category
- Duplicate dependency detection
- Largest modules and optimization opportunities
- Import cost analysis
- Bundle size trends over time

**Webpack Bundle Analysis:**
```bash
/bundle-analyzer webpack --stats-file=stats.json --threshold=500kb
```
Analyzes webpack bundles with:
- webpack-bundle-analyzer integration
- Chunk size analysis and optimization
- Module concatenation opportunities
- Dynamic import boundary detection
- Vendor bundle optimization
- SplitChunks configuration recommendations

**Source Map Explorer:**
```bash
/bundle-analyzer source-map --bundle=main.js --output=report.html
```
Uses source-map-explorer for:
- Visual representation of bundle content
- Source file size attribution
- Library version detection
- Minification effectiveness analysis
- Gzip/Brotli compression preview

### Optimization Commands

**Tree Shaking Optimization:**
```bash
/bundle-analyzer tree-shake --aggressive --side-effects-check
```
Optimizes tree shaking with:
- Side effects analysis and package.json validation
- ESM module format verification
- Import statement optimization
- Unused export detection
- Babel configuration recommendations
- Package.json sideEffects configuration

**Code Splitting Strategy:**
```bash
/bundle-analyzer code-split --strategy=route-based --max-chunk=250kb
```
Implements intelligent code splitting:
- Route-based splitting for SPA applications
- Component-level splitting with React.lazy/Vue async
- Vendor bundle separation strategies
- Common chunk extraction optimization
- Dynamic import insertion points
- Prefetch/preload directive generation

**Dependency Optimization:**
```bash
/bundle-analyzer dependencies --find-duplicates --suggest-alternatives
```
Optimizes dependency usage:
- Duplicate dependency detection and resolution
- Lighter alternative library suggestions
- Peer dependency conflict resolution
- Bundle phobia integration for size checking
- Package.json dependency audit
- Monorepo workspace optimization

### Advanced Features

**Performance Budget:**
```bash
/bundle-analyzer budget --max-initial=500kb --max-route=250kb --fail-on-breach
```
Enforces performance budgets with:
- Initial bundle size limits
- Per-route chunk size constraints
- Asset size monitoring (images, fonts, etc.)
- CI/CD integration for automated checks
- Historical size tracking
- Budget breach notifications

**Compression Analysis:**
```bash
/bundle-analyzer compress --algorithms=gzip,brotli,zstd --level=11
```
Analyzes compression effectiveness:
- Multiple compression algorithm comparison
- Compression ratio analysis
- Pre-compression build plugin recommendations
- CDN compression configuration
- Content-encoding header validation

**Import Cost Analysis:**
```bash
/bundle-analyzer imports --annotate --threshold=50kb
```
Provides import-level insights:
- Per-import size calculation
- Named vs default import optimization
- Import statement annotations in source
- Barrel export detection and optimization
- Module replacement recommendations

## Analysis Methodologies

### Bundle Size Metrics

**Core Web Vitals Impact:**
- **First Contentful Paint (FCP)**: Initial bundle load time impact
- **Largest Contentful Paint (LCP)**: Critical resource optimization
- **Time to Interactive (TTI)**: JavaScript parse and execution cost
- **Total Blocking Time (TBT)**: Main thread blocking analysis
- **Cumulative Layout Shift (CLS)**: Dynamic import layout impact

**Size Categories:**
- **Initial Bundle**: Critical path JavaScript for first render
- **Route Chunks**: Lazy-loaded route-specific code
- **Vendor Bundles**: Third-party library code
- **Shared Chunks**: Common code across multiple routes
- **Async Chunks**: Dynamically imported modules

### Optimization Strategies

**Tree Shaking Excellence:**
```javascript
// Bad: CommonJS imports prevent tree shaking
const _ = require('lodash');
const cloneDeep = _.cloneDeep;

// Good: ESM named imports enable tree shaking
import { cloneDeep } from 'lodash-es';

// Best: Direct function imports minimize bundle size
import cloneDeep from 'lodash-es/cloneDeep';
```

**Code Splitting Patterns:**
```javascript
// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));

// Component-based splitting with prefetch
const HeavyChart = lazy(() => import(
  /* webpackChunkName: "chart" */
  /* webpackPrefetch: true */
  './components/HeavyChart'
));

// Dynamic import with error boundary
const loadModule = () => import('./module').catch(err => {
  console.error('Module load failed:', err);
  return { default: FallbackComponent };
});
```

**Webpack Configuration Optimization:**
```javascript
// Optimal SplitChunks configuration
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          const packageName = module.context.match(
            /[\\/]node_modules[\\/](.*?)([\\/]|$)/
          )[1];
          return `vendor.${packageName.replace('@', '')}`;
        },
        priority: 10
      },
      common: {
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true,
        enforce: true
      }
    }
  },
  runtimeChunk: 'single',
  moduleIds: 'deterministic'
}
```

## Tool Integration

### Webpack Bundle Analyzer

**Installation and Setup:**
```bash
npm install --save-dev webpack-bundle-analyzer
```

**Configuration:**
```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'bundle-report.html',
      openAnalyzer: false,
      generateStatsFile: true,
      statsFilename: 'bundle-stats.json'
    })
  ]
};
```

### Source Map Explorer

**Analysis Workflow:**
```bash
# Generate source maps
npm run build -- --source-map

# Analyze main bundle
npx source-map-explorer dist/main.*.js --html dist/sme-report.html

# Compare bundles
npx source-map-explorer dist/*.js --only-mapped
```

### Bundle Phobia Integration

**Dependency Size Checking:**
```bash
# Check package size before installation
npx bundle-phobia moment

# Compare alternatives
npx bundle-phobia moment date-fns dayjs

# Size impact analysis
npx bundle-phobia --interactive
```

## Performance Optimization Techniques

### Dependency Management

**Library Alternatives:**
- **moment.js (67KB)** → **date-fns (13KB)** or **dayjs (2KB)**
- **lodash (71KB)** → **lodash-es (24KB)** with tree shaking
- **axios (13KB)** → **native fetch** with polyfill (0KB modern browsers)
- **jquery (87KB)** → **vanilla JS** or **cash (6KB)**
- **core-js (90KB)** → **targeted polyfills** with browserslist

**Tree Shaking Optimization:**
```json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}
```

### Build Tool Configuration

**Vite Optimization:**
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@mui/material', '@mui/icons-material'],
          'utils': ['lodash-es', 'date-fns']
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
};
```

**Rollup Optimization:**
```javascript
// rollup.config.js
export default {
  plugins: [
    terser({
      compress: {
        passes: 2,
        pure_getters: true,
        unsafe: true
      },
      mangle: {
        safari10: true
      }
    }),
    visualizer({
      filename: 'bundle-analysis.html',
      gzipSize: true,
      brotliSize: true
    })
  ]
};
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Bundle Size Check

on: [pull_request]

jobs:
  bundle-size:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Install dependencies
        run: npm ci

      - name: Build and analyze
        run: npm run build

      - name: Analyze bundle size
        uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          limit: "500 KB"

      - name: Comment PR with bundle report
        uses: marocchino/sticky-pull-request-comment@v2
        with:
          path: bundle-report.md
```

### Size Limit Configuration

```json
{
  "size-limit": [
    {
      "name": "Initial Bundle",
      "path": "dist/main.*.js",
      "limit": "500 KB",
      "gzip": true
    },
    {
      "name": "Total App Size",
      "path": "dist/**/*.js",
      "limit": "1.5 MB",
      "gzip": true
    }
  ]
}
```

## Reporting and Visualization

### HTML Report Generation

**Comprehensive Analysis Report:**
- Bundle composition treemap visualization
- Size breakdown by module category
- Dependency graph with version information
- Optimization recommendations ranked by impact
- Historical size trend charts
- Compression effectiveness analysis

### Command Line Output

**Summary Statistics:**
```
Bundle Analysis Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Bundle Size: 1.2 MB (489 KB gzipped)
Initial Load: 456 KB (189 KB gzipped)
Lazy Chunks: 744 KB (300 KB gzipped)

Top 5 Largest Modules:
1. node_modules/react-dom/cjs/react-dom.production.min.js - 120 KB
2. node_modules/@mui/material/esm/index.js - 87 KB
3. node_modules/recharts/es6/index.js - 65 KB
4. src/pages/Dashboard/index.js - 43 KB
5. node_modules/date-fns/esm/index.js - 38 KB

Optimization Opportunities:
• Replace moment.js with date-fns (saves 54 KB)
• Enable aggressive tree shaking (potential 120 KB reduction)
• Split vendor bundle into smaller chunks
• Consider dynamic imports for Dashboard (43 KB)

Performance Budget Status: ⚠️  WARNING
Initial bundle exceeds recommended 400 KB limit
```

### JSON Export

**Programmatic Analysis:**
```json
{
  "bundles": [
    {
      "name": "main",
      "size": 456000,
      "gzipSize": 189000,
      "modules": 342,
      "duplicates": 3
    }
  ],
  "recommendations": [
    {
      "type": "dependency-replacement",
      "module": "moment",
      "suggestion": "date-fns",
      "savings": 54000
    }
  ]
}
```

---

**ClaudeForge Bundle Analyzer** - Intelligent bundle size optimization with comprehensive analysis, actionable recommendations, and automated performance monitoring.
