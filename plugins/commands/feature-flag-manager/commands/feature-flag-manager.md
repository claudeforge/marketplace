---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge feature flag management specialist for LaunchDarkly, Unleash, and progressive feature rollouts.
---

# ClaudeForge Feature Flag Manager

ClaudeForge intelligent feature flag management system that orchestrates progressive feature rollouts, A/B testing, canary releases, and kill switches with comprehensive analytics, team coordination, and risk mitigation strategies.

## Purpose

Transform feature deployment from risky big-bang releases to controlled, data-driven rollouts that enable rapid iteration, minimize blast radius, and provide instant rollback capabilities across distributed systems.

## Features

- **Flag Lifecycle Management**: Create, configure, and retire feature flags with governance
- **Progressive Rollouts**: Gradual feature deployment with user targeting and percentage-based distribution
- **A/B Testing**: Experimentation framework with statistical significance tracking
- **Kill Switches**: Emergency feature disable with instant propagation
- **User Targeting**: Sophisticated targeting rules based on attributes, segments, and context
- **Analytics Integration**: Real-time feature usage metrics and conversion tracking
- **Multi-Environment Support**: Consistent flag management across dev, staging, and production
- **Audit Trail**: Complete change history for compliance and debugging

## Usage

```bash
/feature-flag-manager [command] [options]
```

Target: $ARGUMENTS (if specified, otherwise manage all flags in current environment)

### Flag Management Commands

**Create Feature Flag:**
```bash
/feature-flag-manager create --name=new-checkout-flow --type=release --environments=all
```
Creates new feature flag with:
- Unique flag key generation
- Default variation configuration
- Environment-specific settings
- Access control and permissions
- Documentation requirements
- Review and approval workflow
- Integration with issue tracker
- Automated test flag generation

**Update Flag Configuration:**
```bash
/feature-flag-manager update --flag=new-checkout-flow --targeting=enabled --rules=beta-users
```
Updates flag configuration including:
- Targeting rules and prerequisites
- User segment assignments
- Percentage rollout adjustments
- Variation value modifications
- Fallback configuration
- Environment synchronization
- Change tracking and audit
- Team notification system

**Delete Feature Flag:**
```bash
/feature-flag-manager delete --flag=old-feature --check-usage --archive
```
Safely removes feature flags:
- Usage analysis across codebase
- Dependent feature detection
- Staged deletion process
- Code cleanup suggestions
- Archive for audit trail
- Team notification
- Technical debt tracking
- Migration guide generation

### Rollout Strategies

**Percentage Rollout:**
```bash
/feature-flag-manager rollout --flag=new-ui --percentage=25 --increment=25 --interval=1h
```
Implements progressive rollout:
- Initial percentage deployment
- Automated incremental increases
- Monitoring-based progression
- Error rate threshold checks
- Automatic pause on issues
- Rollback triggers
- User consistency (sticky assignments)
- Schedule-based progression

**Targeted Rollout:**
```bash
/feature-flag-manager rollout --flag=premium-features --segment=enterprise-users --context=subscription-tier
```
Deploys to specific user segments:
- User attribute-based targeting
- Custom segment definitions
- Multi-condition rule sets
- Geographic targeting
- Device/platform targeting
- Account-level overrides
- Test user exclusions
- Gradual segment expansion

**Ring Deployment:**
```bash
/feature-flag-manager rollout --flag=api-v2 --strategy=rings --rings="internal,beta,ga"
```
Implements ring-based deployment:
- Internal team ring (5% of users)
- Beta user ring (20% of users)
- General availability ring (100% of users)
- Automated progression gates
- Ring-specific monitoring
- Quality gates between rings
- Fast ring rollback capability
- Documentation updates per ring

### A/B Testing

**Create Experiment:**
```bash
/feature-flag-manager experiment create --name=checkout-optimization --variants=A,B --split=50/50 --duration=14d
```
Sets up A/B test with:
- Variant definition and allocation
- Statistical power calculation
- Sample size requirements
- Success metric definition
- Control group preservation
- Random assignment algorithm
- Consistent user experience
- Early stopping criteria

**Analyze Results:**
```bash
/feature-flag-manager experiment analyze --name=checkout-optimization --metrics=conversion,revenue
```
Provides statistical analysis:
- Conversion rate comparison
- Statistical significance testing
- Confidence interval calculation
- Revenue impact analysis
- User engagement metrics
- Segment-based breakdowns
- Visualization and reporting
- Winner recommendation

**Graduate Experiment:**
```bash
/feature-flag-manager experiment graduate --name=checkout-optimization --winner=B --cleanup-code
```
Completes experiment lifecycle:
- Winner deployment to 100%
- Loser variant removal
- Code cleanup automation
- A/B test flag removal
- Documentation updates
- Team communication
- Learning documentation
- Next iteration planning

### Kill Switch Operations

**Emergency Disable:**
```bash
/feature-flag-manager kill-switch --flag=problematic-feature --immediate --notify-team
```
Instantly disables feature:
- Zero-downtime flag flip
- Immediate CDN/cache invalidation
- Real-time client notification
- Automatic team alerts
- Incident documentation
- Rollback verification
- Impact assessment
- Root cause investigation trigger

**Scheduled Disable:**
```bash
/feature-flag-manager schedule disable --flag=holiday-promotion --date=2024-12-26 --time=00:00:00
```
Plans feature deactivation:
- Scheduled flag changes
- Timezone-aware execution
- Pre-execution notifications
- Automated verification
- Rollback plan preparation
- Communication automation
- Metric baseline capture
- Post-disable monitoring

## Integration Platforms

### LaunchDarkly Integration

**Configuration:**
```javascript
// launchdarkly-config.js
import * as LaunchDarkly from 'launchdarkly-node-server-sdk';

const ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY, {
  sendEvents: true,
  allAttributesPrivate: false,
  stream: true,
  offline: false
});

await ldClient.waitForInitialization();

export async function evaluateFlag(flagKey, user, defaultValue) {
  try {
    const context = {
      kind: 'user',
      key: user.id,
      email: user.email,
      custom: {
        accountTier: user.subscription,
        signupDate: user.createdAt,
        region: user.region
      }
    };

    return await ldClient.variation(flagKey, context, defaultValue);
  } catch (error) {
    console.error('Flag evaluation error:', error);
    return defaultValue;
  }
}
```

**React Integration:**
```javascript
import { withLDProvider, useFlags, useLDClient } from 'launchdarkly-react-client-sdk';

function App() {
  const { newCheckoutFlow, premiumFeatures } = useFlags();
  const ldClient = useLDClient();

  useEffect(() => {
    // Track feature usage
    if (newCheckoutFlow) {
      ldClient?.track('checkout-flow-viewed', {
        version: 'new'
      });
    }
  }, [newCheckoutFlow, ldClient]);

  return (
    <div>
      {newCheckoutFlow ? <NewCheckout /> : <LegacyCheckout />}
      {premiumFeatures && <PremiumSection />}
    </div>
  );
}

export default withLDProvider({
  clientSideID: process.env.REACT_APP_LD_CLIENT_ID,
  user: {
    key: userId,
    email: userEmail,
    custom: {
      subscriptionTier: userTier
    }
  }
})(App);
```

### Unleash Integration

**Server Configuration:**
```javascript
// unleash-config.js
const { initialize } = require('unleash-client');

const unleash = initialize({
  url: 'https://unleash.example.com/api',
  appName: 'my-application',
  instanceId: process.env.INSTANCE_ID,
  environment: process.env.NODE_ENV,
  customHeaders: {
    Authorization: process.env.UNLEASH_API_TOKEN
  },
  strategies: [
    {
      name: 'gradualRollout',
      implementation: gradualRolloutStrategy
    },
    {
      name: 'userWithId',
      implementation: userTargetingStrategy
    }
  ]
});

unleash.on('ready', () => {
  console.log('Unleash client ready');
});

unleash.on('error', (error) => {
  console.error('Unleash error:', error);
});

function isFeatureEnabled(flagName, context = {}) {
  return unleash.isEnabled(flagName, context, (name, enabled) => {
    // Track feature evaluations
    trackFeatureEvaluation(name, enabled, context);
  });
}

module.exports = { unleash, isFeatureEnabled };
```

**Custom Strategies:**
```javascript
// Custom rollout strategy
const gradualRolloutStrategy = {
  name: 'gradualRollout',
  execute: (context, parameters) => {
    const userId = context.userId;
    const percentage = parseInt(parameters.percentage, 10);

    // Consistent hashing for user assignment
    const hash = murmurhash(userId + parameters.groupId);
    const bucket = hash % 100;

    return bucket < percentage;
  }
};

// User segment strategy
const segmentStrategy = {
  name: 'userSegment',
  execute: (context, parameters) => {
    const userSegment = context.properties?.segment;
    const allowedSegments = parameters.segments.split(',');

    return allowedSegments.includes(userSegment);
  }
};
```

### Split.io Integration

**TypeScript Configuration:**
```typescript
// splitio-config.ts
import { SplitFactory } from '@splitsoftware/splitio';

interface UserContext {
  id: string;
  email: string;
  attributes: Record<string, any>;
}

class FeatureFlagService {
  private client: any;
  private isReady: boolean = false;

  async initialize() {
    const factory = SplitFactory({
      core: {
        authorizationKey: process.env.SPLIT_API_KEY!,
        key: 'customer-id'
      },
      scheduler: {
        impressionsRefreshRate: 60
      }
    });

    this.client = factory.client();

    await new Promise((resolve) => {
      this.client.on(this.client.Event.SDK_READY, () => {
        this.isReady = true;
        resolve(true);
      });
    });
  }

  getTreatment(
    flagKey: string,
    user: UserContext,
    attributes?: Record<string, any>
  ): string {
    if (!this.isReady) {
      return 'control';
    }

    return this.client.getTreatment(
      user.id,
      flagKey,
      { ...user.attributes, ...attributes }
    );
  }

  getTreatmentWithConfig(
    flagKey: string,
    user: UserContext
  ): { treatment: string; config: any } {
    const result = this.client.getTreatmentWithConfig(
      user.id,
      flagKey,
      user.attributes
    );

    return {
      treatment: result.treatment,
      config: result.config ? JSON.parse(result.config) : null
    };
  }

  track(
    eventType: string,
    user: UserContext,
    value?: number,
    properties?: Record<string, any>
  ): boolean {
    return this.client.track(
      user.id,
      'user',
      eventType,
      value,
      properties
    );
  }
}

export const featureFlagService = new FeatureFlagService();
```

## Advanced Targeting Rules

### User Attribute Targeting

**Complex Rule Configuration:**
```json
{
  "flag": "premium-dashboard",
  "targeting": {
    "enabled": true,
    "rules": [
      {
        "id": "enterprise-users",
        "conditions": [
          {
            "attribute": "subscription_tier",
            "operator": "equals",
            "value": "enterprise"
          },
          {
            "attribute": "account_age_days",
            "operator": "greater_than",
            "value": 30
          }
        ],
        "variation": "enabled"
      },
      {
        "id": "beta-testers",
        "conditions": [
          {
            "attribute": "user_id",
            "operator": "in_segment",
            "value": "beta-testers-segment"
          }
        ],
        "variation": "enabled",
        "rollout": {
          "percentage": 50
        }
      }
    ],
    "defaultVariation": "disabled"
  }
}
```

### Geographic Targeting

**Region-Based Rollout:**
```javascript
const geoTargetingRules = {
  flag: 'new-payment-provider',
  rules: [
    {
      name: 'US-East-Rollout',
      conditions: [
        { attribute: 'country', operator: 'equals', value: 'US' },
        { attribute: 'region', operator: 'in', value: ['us-east-1', 'us-east-2'] }
      ],
      variation: 'new-provider',
      percentage: 100
    },
    {
      name: 'US-West-Canary',
      conditions: [
        { attribute: 'country', operator: 'equals', value: 'US' },
        { attribute: 'region', operator: 'in', value: ['us-west-1', 'us-west-2'] }
      ],
      variation: 'new-provider',
      percentage: 10
    },
    {
      name: 'EU-Regions',
      conditions: [
        { attribute: 'country', operator: 'in', value: ['DE', 'FR', 'GB', 'IT', 'ES'] }
      ],
      variation: 'old-provider',
      percentage: 100
    }
  ],
  defaultVariation: 'old-provider'
};
```

### Time-Based Targeting

**Scheduled Feature Activation:**
```javascript
function evaluateTimeBasedFlag(flagConfig, currentTime) {
  const schedule = flagConfig.schedule;

  // Check if current time is within activation window
  if (schedule.startDate && currentTime < new Date(schedule.startDate)) {
    return false;
  }

  if (schedule.endDate && currentTime > new Date(schedule.endDate)) {
    return false;
  }

  // Check day of week restrictions
  if (schedule.daysOfWeek) {
    const currentDay = currentTime.getDay();
    if (!schedule.daysOfWeek.includes(currentDay)) {
      return false;
    }
  }

  // Check time of day restrictions
  if (schedule.timeRange) {
    const currentHour = currentTime.getHours();
    const startHour = schedule.timeRange.start;
    const endHour = schedule.timeRange.end;

    if (currentHour < startHour || currentHour >= endHour) {
      return false;
    }
  }

  return true;
}

// Example usage
const blackFridayFlag = {
  name: 'black-friday-deals',
  schedule: {
    startDate: '2024-11-29T00:00:00Z',
    endDate: '2024-12-02T23:59:59Z',
    daysOfWeek: [5, 6, 0], // Friday, Saturday, Sunday
    timeRange: { start: 0, end: 24 }
  }
};
```

## Monitoring and Analytics

### Feature Usage Metrics

**Analytics Integration:**
```javascript
import { trackFeatureUsage } from './analytics';

class FeatureFlagAnalytics {
  constructor(analyticsClient) {
    this.analytics = analyticsClient;
    this.flagEvaluations = new Map();
  }

  trackEvaluation(flagKey, variation, user) {
    // Track flag evaluation
    this.analytics.track('Feature Flag Evaluated', {
      flag: flagKey,
      variation: variation,
      userId: user.id,
      timestamp: Date.now()
    });

    // Update evaluation counter
    const key = `${flagKey}:${variation}`;
    const count = this.flagEvaluations.get(key) || 0;
    this.flagEvaluations.set(key, count + 1);
  }

  trackConversion(flagKey, variation, user, eventType, value) {
    // Track feature conversion event
    this.analytics.track('Feature Conversion', {
      flag: flagKey,
      variation: variation,
      eventType: eventType,
      value: value,
      userId: user.id,
      timestamp: Date.now()
    });
  }

  getEvaluationStats() {
    const stats = {};
    for (const [key, count] of this.flagEvaluations) {
      const [flag, variation] = key.split(':');
      if (!stats[flag]) stats[flag] = {};
      stats[flag][variation] = count;
    }
    return stats;
  }
}
```

### A/B Test Analytics

**Statistical Analysis:**
```javascript
class ABTestAnalyzer {
  calculateSignificance(controlMetrics, variantMetrics) {
    // Calculate conversion rates
    const controlRate = controlMetrics.conversions / controlMetrics.impressions;
    const variantRate = variantMetrics.conversions / variantMetrics.impressions;

    // Calculate pooled standard error
    const pooledRate = (controlMetrics.conversions + variantMetrics.conversions) /
                       (controlMetrics.impressions + variantMetrics.impressions);

    const standardError = Math.sqrt(
      pooledRate * (1 - pooledRate) *
      (1 / controlMetrics.impressions + 1 / variantMetrics.impressions)
    );

    // Calculate z-score
    const zScore = (variantRate - controlRate) / standardError;

    // Calculate p-value (two-tailed test)
    const pValue = 2 * (1 - this.normalCDF(Math.abs(zScore)));

    // Calculate confidence interval
    const marginOfError = 1.96 * standardError;
    const lift = ((variantRate - controlRate) / controlRate) * 100;

    return {
      controlRate: (controlRate * 100).toFixed(2) + '%',
      variantRate: (variantRate * 100).toFixed(2) + '%',
      lift: lift.toFixed(2) + '%',
      pValue: pValue.toFixed(4),
      significant: pValue < 0.05,
      confidenceInterval: [
        ((variantRate - marginOfError) * 100).toFixed(2) + '%',
        ((variantRate + marginOfError) * 100).toFixed(2) + '%'
      ],
      sampleSize: {
        control: controlMetrics.impressions,
        variant: variantMetrics.impressions
      }
    };
  }

  normalCDF(x) {
    // Approximation of cumulative normal distribution
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }
}
```

### Real-Time Dashboard

**Metrics Visualization:**
```javascript
// Feature flag dashboard metrics
const dashboardMetrics = {
  flags: [
    {
      key: 'new-checkout-flow',
      status: 'active',
      rollout: 45,
      evaluations: 125430,
      variations: {
        enabled: { count: 56444, percentage: 45 },
        disabled: { count: 68986, percentage: 55 }
      },
      metrics: {
        conversionRate: {
          enabled: 12.4,
          disabled: 10.8,
          lift: 14.8
        },
        errorRate: {
          enabled: 0.02,
          disabled: 0.03
        },
        avgResponseTime: {
          enabled: 245,
          disabled: 298
        }
      },
      lastModified: '2024-03-15T14:32:00Z',
      modifiedBy: 'john.doe@example.com'
    }
  ]
};
```

---

**ClaudeForge Feature Flag Manager** - Enterprise-grade feature management with progressive rollouts, A/B testing, and comprehensive analytics for data-driven product development.
