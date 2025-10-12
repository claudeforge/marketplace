# FinOps Expert - Cloud Cost Optimization

Comprehensive cloud cost optimization, FinOps practices, and cost management strategies across major cloud providers with focus on AWS.

## Core FinOps Principles

1. **Teams collaborate** - Finance, Engineering, and Business work together
2. **Everyone owns costs** - Distributed decision-making with centralized governance
3. **Centralized FinOps team** - Dedicated team manages the practice
4. **Accessible, timely reports** - Real-time visibility into cloud costs
5. **Business value drives decisions** - Balance cost, speed, and quality
6. **Leverage variable cost model** - Optimize for cloud's pay-as-you-go nature

## FinOps Lifecycle

```javascript
const finopsLifecycle = {
  inform: {
    activities: ['Cost allocation/tagging', 'Showback/chargeback', 'Benchmarking', 'Budget management']
  },
  optimize: {
    activities: ['Rightsizing resources', 'Reserved capacity', 'Spot instances', 'Waste identification']
  },
  operate: {
    activities: ['Policy enforcement', 'Anomaly detection', 'Reporting automation']
  }
};
```

## AWS Cost Explorer

```javascript
const AWS = require('aws-sdk');
const costExplorer = new AWS.CostExplorer({ region: 'us-east-1' });

// Get monthly costs by service
async function getMonthlyCosts() {
  const params = {
    TimePeriod: { Start: '2024-01-01', End: '2024-02-01' },
    Granularity: 'MONTHLY',
    Metrics: ['UnblendedCost'],
    GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }]
  };

  const data = await costExplorer.getCostAndUsage(params).promise();
  return data.ResultsByTime;
}

// Cost analysis tool
class CostAnalyzer {
  constructor(region = 'us-east-1') {
    this.costExplorer = new AWS.CostExplorer({ region });
  }

  async getServiceCosts(startDate, endDate) {
    const params = {
      TimePeriod: { Start: startDate, End: endDate },
      Granularity: 'DAILY',
      Metrics: ['UnblendedCost'],
      GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }]
    };

    const result = await this.costExplorer.getCostAndUsage(params).promise();
    return this.aggregateCosts(result.ResultsByTime);
  }

  aggregateCosts(results) {
    const serviceCosts = {};
    results.forEach(timeFrame => {
      timeFrame.Groups.forEach(group => {
        const service = group.Keys[0];
        const cost = parseFloat(group.Metrics.UnblendedCost.Amount);
        serviceCosts[service] = (serviceCosts[service] || 0) + cost;
      });
    });

    return Object.entries(serviceCosts)
      .map(([service, cost]) => ({ service, cost }))
      .sort((a, b) => b.cost - a.cost);
  }
}
```

## Cost Optimization Strategies

### 1. Compute Optimization

```javascript
class EC2Optimizer {
  async analyzeInstanceUtilization(instanceId, days = 14) {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setDate(startTime.getDate() - days);

    const params = {
      Namespace: 'AWS/EC2',
      MetricName: 'CPUUtilization',
      Dimensions: [{ Name: 'InstanceId', Value: instanceId }],
      StartTime: startTime,
      EndTime: endTime,
      Period: 3600,
      Statistics: ['Average', 'Maximum']
    };

    const data = await this.cloudWatch.getMetricStatistics(params).promise();
    return this.calculateUtilizationStats(data.Datapoints);
  }

  async identifyIdleInstances(threshold = 5) {
    const instances = await this.ec2.describeInstances().promise();
    const idleInstances = [];

    for (const reservation of instances.Reservations) {
      for (const instance of reservation.Instances) {
        if (instance.State.Name !== 'running') continue;

        const stats = await this.analyzeInstanceUtilization(instance.InstanceId);
        if (stats.CPUUtilization.avgUtilization < threshold) {
          idleInstances.push({
            instanceId: instance.InstanceId,
            instanceType: instance.InstanceType,
            avgCPU: stats.CPUUtilization.avgUtilization
          });
        }
      }
    }
    return idleInstances;
  }
}
```

### 2. Storage Optimization

```javascript
class S3Optimizer {
  async applyLifecyclePolicy(bucketName) {
    const lifecycleConfig = {
      Rules: [
        { Id: 'Transition to IA', Status: 'Enabled',
          Transitions: [{ Days: 30, StorageClass: 'STANDARD_IA' }] },
        { Id: 'Transition to Glacier', Status: 'Enabled',
          Transitions: [{ Days: 90, StorageClass: 'GLACIER' }] },
        { Id: 'Delete old versions', Status: 'Enabled',
          NoncurrentVersionExpiration: { NoncurrentDays: 90 } }
      ]
    };

    return await this.s3.putBucketLifecycleConfiguration({
      Bucket: bucketName,
      LifecycleConfiguration: lifecycleConfig
    }).promise();
  }
}
```

## Reserved Instances vs On-Demand

```javascript
class PricingCalculator {
  compareOptions(instanceType, quantity = 1, months = 12) {
    const onDemand = this.calculateOnDemandCost(instanceType, 730, months);

    const ri1Year = {
      upfrontCost: 0,
      monthlyRecurring: 0.0640 * 730 * quantity,
      totalCost: 0.0640 * 730 * quantity * 12
    };

    return {
      instanceType,
      onDemand,
      reservedInstances: {
        '1yr_no_upfront': {
          ...ri1Year,
          savingsVsOnDemand: onDemand.totalCost - ri1Year.totalCost,
          savingsPercent: ((onDemand.totalCost - ri1Year.totalCost) / onDemand.totalCost) * 100
        }
      }
    };
  }

  generateRecommendation(utilizationPercent, consistentWorkload) {
    if (utilizationPercent < 40) {
      return { recommendation: 'On-Demand', reason: 'Low utilization - stay flexible' };
    }
    if (utilizationPercent >= 75 && consistentWorkload) {
      return { recommendation: '3-Year RI (All Upfront)', reason: 'High consistent utilization - maximize savings' };
    }
    if (utilizationPercent >= 60) {
      return { recommendation: '1-Year RI', reason: 'Moderate consistent utilization' };
    }
    return { recommendation: 'Savings Plan', reason: 'Variable workload - flexibility needed' };
  }
}
```

## Rightsizing Recommendations

```javascript
class RightsizingEngine {
  generateRecommendation(instance, metrics, costs) {
    const cpuAvg = metrics.CPUUtilization_Average.average;
    const cpuP95 = metrics.CPUUtilization_Maximum.p95;

    if (cpuAvg < 10 && cpuP95 < 25) {
      return {
        action: 'DOWNSIZE',
        currentType: instance.instanceType,
        recommendedType: this.getSmallerInstanceType(instance.instanceType),
        reason: `Very low CPU utilization (avg: ${cpuAvg.toFixed(1)}%, p95: ${cpuP95.toFixed(1)}%)`,
        estimatedSavings: this.estimateSavings(instance.instanceType, this.getSmallerInstanceType(instance.instanceType))
      };
    }

    if (cpuP95 > 80 && metrics.CPUUtilization_Maximum.max > 90) {
      return {
        action: 'UPSIZE',
        currentType: instance.instanceType,
        recommendedType: this.getLargerInstanceType(instance.instanceType),
        reason: `High CPU utilization (p95: ${cpuP95.toFixed(1)}%)`
      };
    }

    if (cpuAvg < 2 && metrics.CPUUtilization_Maximum.max < 10) {
      return {
        action: 'TERMINATE',
        reason: 'Idle instance',
        estimatedSavings: costs.monthlyCost
      };
    }

    return { action: 'KEEP', reason: 'Instance is appropriately sized' };
  }
}
```

## Cost Allocation Tags

```javascript
const costAllocationStrategy = {
  required: ['Environment', 'CostCenter', 'Project', 'Owner', 'Application'],
  optional: ['Backup', 'Compliance', 'Schedule']
};

class CostTaggingManager {
  async auditEC2Tags() {
    const instances = await this.ec2.describeInstances().promise();
    const untaggedResources = [];
    const requiredTagKeys = ['Environment', 'CostCenter', 'Project', 'Owner'];

    for (const reservation of instances.Reservations) {
      for (const instance of reservation.Instances) {
        const instanceTags = instance.Tags || [];
        const existingTagKeys = instanceTags.map(t => t.Key);
        const missingTags = requiredTagKeys.filter(key => !existingTagKeys.includes(key));

        if (missingTags.length > 0) {
          untaggedResources.push({
            resourceType: 'EC2',
            resourceId: instance.InstanceId,
            missingTags
          });
        }
      }
    }
    return untaggedResources;
  }
}
```

## Budget Alerts

```javascript
class BudgetManager {
  async createMonthlyCostBudget(accountId, budgetAmount, email) {
    const budget = {
      BudgetName: `monthly-cost-budget-${new Date().getFullYear()}`,
      BudgetType: 'COST',
      TimeUnit: 'MONTHLY',
      BudgetLimit: { Amount: budgetAmount.toString(), Unit: 'USD' }
    };

    const notifications = [
      { Notification: { NotificationType: 'ACTUAL', ComparisonOperator: 'GREATER_THAN', Threshold: 80 },
        Subscribers: [{ SubscriptionType: 'EMAIL', Address: email }] },
      { Notification: { NotificationType: 'FORECASTED', ComparisonOperator: 'GREATER_THAN', Threshold: 100 },
        Subscribers: [{ SubscriptionType: 'EMAIL', Address: email }] }
    ];

    return await this.budgets.createBudget({
      AccountId: accountId,
      Budget: budget,
      NotificationsWithSubscribers: notifications
    }).promise();
  }
}
```

## Best Practices

### Cost Optimization Checklist

**Compute:**
- Right-size EC2 instances
- Use reserved instances for steady workloads
- Implement auto-scaling
- Use spot instances for fault-tolerant workloads
- Stop/start dev environments off-hours

**Storage:**
- Implement S3 lifecycle policies
- Use appropriate storage classes
- Delete unattached EBS volumes
- Clean up old snapshots
- Enable S3 Intelligent-Tiering

**Database:**
- Right-size RDS instances
- Use reserved instances for RDS
- Enable automated backups with retention
- Use Aurora Serverless for variable workloads
- Archive old data to S3

**Monitoring:**
- Set up cost anomaly detection
- Create budget alerts
- Monitor reserved instance utilization
- Track savings plans coverage
- Review Cost Explorer regularly

### Review Schedule

- **Daily**: Monitor anomaly alerts, review top 10 cost drivers
- **Weekly**: Review RI utilization, analyze cost trends, check for idle resources
- **Monthly**: Executive cost review, budget vs actual, rightsizing recommendations
- **Quarterly**: FinOps KPI review, strategy update, multi-year RI planning
