# SRE (Site Reliability Engineering) Expert

A practical guide to Site Reliability Engineering practices including SLI/SLO/SLA definitions, incident response, monitoring, and best practices.

## Core SRE Principles

- **Error Budgets**: Balance reliability and feature velocity (1 - SLO target)
- **Toil Reduction**: Minimize repetitive manual work (target < 50% of time)
- **Monitoring**: White-box and black-box monitoring with actionable alerts
- **Emergency Response**: Structured on-call, runbooks, blameless post-mortems
- **Capacity Planning**: Forecasting, load testing, automated scaling

## SLI, SLO, and SLA

### Service Level Indicators (SLIs)

Quantitative measures of service level:

- **Availability**: Success rate (e.g., 99.9% of requests succeed)
- **Latency**: Response time percentiles (P50, P95, P99)
- **Throughput**: Requests per second
- **Correctness**: Valid response rate
- **Durability**: Data retention and integrity

### Service Level Objectives (SLOs)

Target values for SLIs:

```javascript
const sloExample = {
  availability: {
    target: 99.9,  // 99.9% uptime
    window: '30 days',
    errorBudget: 0.1  // 43.2 minutes/month
  },
  latency: {
    p95: 200,  // 95th percentile < 200ms
    p99: 500,  // 99th percentile < 500ms
  }
};
```

**Error Budget Formula**: `(1 - Actual Uptime) / (1 - SLO Target)`

### Service Level Agreements (SLAs)

Contracts with consequences:

- Define compensation for SLA breaches
- Specify exclusions (maintenance, force majeure)
- Document escalation procedures

## Four Golden Signals

1. **Latency**: Time to serve requests
2. **Traffic**: Demand on the system (requests/sec)
3. **Errors**: Rate of failed requests
4. **Saturation**: How full the service is (CPU, memory, disk)

## Monitoring and Alerting

### Alert Best Practices

- Alert on symptoms, not causes
- Keep alert fatigue low
- Every alert must be actionable
- Set appropriate severity levels
- Include remediation steps in alerts

### Prometheus Alert Example

```yaml
- alert: HighErrorRate
  expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: "High error rate detected"
    description: "Error rate is {{ $value | humanizePercentage }}"
```

## Incident Response

### Severity Levels

**SEV1 - Critical**
- Complete service outage
- Response time: 15 minutes
- Update frequency: Every 30 minutes

**SEV2 - High**
- Major functionality degraded
- Response time: 1 hour
- Update frequency: Every 1-2 hours

**SEV3 - Medium**
- Minor functionality issue
- Response time: 4 hours
- Update frequency: Daily

**SEV4 - Low**
- Cosmetic issues
- Response time: 24 hours
- Update frequency: As needed

### Incident Management Process

1. **Detection**: Alert triggered or issue reported
2. **Response**: Assemble team, begin investigation
3. **Mitigation**: Implement fixes, restore service
4. **Resolution**: Confirm restoration, monitor stability
5. **Post-Mortem**: Analyze root cause, create action items

## Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

**Date**: YYYY-MM-DD
**Severity**: SEV#
**Duration**: X hours Y minutes
**Impact**: X users affected

## What Happened
[Brief technical description]

## Root Cause
[Why it happened]

## Timeline
| Time | Event |
|------|-------|
| 14:00 | Issue detected |
| 14:05 | Team engaged |
| 14:20 | Service restored |

## What Went Well
- Quick detection
- Effective communication

## What Went Wrong
- No monitoring for X
- Insufficient testing

## Action Items
| Action | Owner | Priority | Due Date |
|--------|-------|----------|----------|
| Add monitoring | SRE | P0 | 2024-04-15 |
| Update runbook | DevOps | P1 | 2024-04-20 |
```

## On-Call Best Practices

- Acknowledge alerts within 5 minutes
- Update incident status every 30 minutes
- Use runbooks for common issues
- Escalate if uncertain
- Document all actions
- Clean handoff to next engineer

## Chaos Engineering

### Principles

1. Define steady-state behavior (baseline metrics)
2. Hypothesize steady state continues during chaos
3. Introduce real-world variables (failures)
4. Prove/disprove hypothesis
5. Minimize blast radius
6. Automate experiments

### Common Experiments

- Network latency injection
- Instance termination
- Database failover
- Dependency failures
- Resource exhaustion

## Capacity Planning

### Forecasting Steps

1. Collect historical metrics (CPU, memory, requests, storage)
2. Calculate growth trends
3. Project future capacity needs
4. Plan scaling ahead of demand
5. Test capacity assumptions with load tests

### Utilization Targets

- **70% Target**: Maintain 70% utilization for headroom
- **Scale Up**: When sustained >80% utilization
- **Scale Down**: When sustained <40% utilization

## Best Practices

**Reliability**
- Define and track SLOs for all critical services
- Implement error budgets
- Use gradual rollouts and feature flags
- Design for failure and redundancy
- Regular disaster recovery drills

**Monitoring**
- Monitor the four golden signals
- Use symptom-based alerting
- Keep alert fatigue low
- Implement comprehensive logging and tracing
- Set up synthetic monitoring

**Incidents**
- Clear incident severity definitions
- Standardized response procedures
- Blameless post-mortems for all incidents
- Track MTTR (Mean Time To Recovery)
- Practice incident response regularly

**Automation**
- Automate toil ruthlessly
- Use infrastructure as code
- Automated testing at all levels
- Automated deployment pipelines
- Self-healing systems where possible

**Culture**
- Blameless culture - focus on systems
- Share on-call responsibilities fairly
- Invest in developer productivity
- Document everything
- Continuous learning and improvement

## Key Metrics

- **MTTD**: Mean Time to Detect
- **MTTA**: Mean Time to Acknowledge
- **MTTR**: Mean Time to Resolve
- **Error Budget**: Remaining allowed downtime
- **SLO Compliance**: Percentage of time SLOs are met
