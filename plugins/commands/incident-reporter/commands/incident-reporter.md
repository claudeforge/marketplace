---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: Create incident reports with root cause analysis, timelines, and action items for effective incident management
---

# Incident Reporter

Create detailed incident reports, perform root cause analysis, generate timelines, and track action items for effective incident management.

## Incident Lifecycle

```javascript
const incidentLifecycle = {
  detection: ['Alert triggered', 'Initial assessment', 'Severity classification', 'Incident created'],
  response: ['Assemble team', 'Begin investigation', 'Implement mitigations', 'Update stakeholders'],
  resolution: ['Confirm service restoration', 'Monitor for recurrence', 'Close incident'],
  postMortem: ['Schedule meeting', 'Analyze root cause', 'Define action items', 'Document lessons'],
  followUp: ['Track action items', 'Implement preventive measures', 'Verify effectiveness']
};
```

## Incident Report Class

```javascript
class IncidentReport {
  constructor(incidentData) {
    this.id = incidentData.id || this.generateIncidentId();
    this.title = incidentData.title;
    this.startTime = incidentData.startTime || new Date();
    this.endTime = incidentData.endTime || null;
    this.severity = incidentData.severity;
    this.status = incidentData.status || 'investigating';
    this.commander = incidentData.commander;
    this.responders = incidentData.responders || [];
    this.timeline = [];
    this.actionItems = [];
    this.impact = {};
  }

  generateIncidentId() {
    const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INC-${date}-${randomId}`;
  }

  addTimelineEvent(event) {
    this.timeline.push({
      timestamp: event.timestamp || new Date(),
      type: event.type,
      description: event.description,
      author: event.author
    });
    this.timeline.sort((a, b) => a.timestamp - b.timestamp);
  }

  addActionItem(item) {
    const actionItem = {
      id: `AI-${(this.actionItems.length + 1).toString().padStart(3, '0')}`,
      action: item.action,
      owner: item.owner,
      priority: item.priority,
      dueDate: item.dueDate,
      status: item.status || 'not_started',
      createdAt: new Date()
    };
    this.actionItems.push(actionItem);
    return actionItem;
  }

  setImpact(impactData) {
    this.impact = {
      usersAffected: impactData.usersAffected,
      duration: impactData.duration,
      revenueImpact: impactData.revenueImpact,
      servicesAffected: impactData.servicesAffected,
      slaBreached: impactData.slaBreached || false,
      ...impactData
    };
  }

  calculateMetrics() {
    if (!this.endTime) return { duration: 'Ongoing' };

    const duration = (this.endTime - this.startTime) / 1000 / 60; // minutes
    const detectionEvent = this.timeline.find(e => e.type === 'detection');
    const acknowledgeEvent = this.timeline.find(e => e.type === 'acknowledged');

    return {
      duration: `${Math.floor(duration)} minutes`,
      mttd: detectionEvent ? `${Math.floor((detectionEvent.timestamp - this.startTime) / 1000 / 60)} minutes` : 'N/A',
      mtta: acknowledgeEvent ? `${Math.floor((acknowledgeEvent.timestamp - this.startTime) / 1000 / 60)} minutes` : 'N/A',
      mttr: `${Math.floor(duration)} minutes`
    };
  }

  exportMarkdown() {
    const metrics = this.calculateMetrics();

    return `# Incident Report: ${this.title}

**Incident ID:** ${this.id}
**Date:** ${this.startTime.toISOString().split('T')[0]}
**Status:** ${this.status}
**Severity:** ${this.severity}
**Commander:** ${this.commander}

## Impact
- **Users Affected:** ${this.impact.usersAffected || 'TBD'}
- **Duration:** ${metrics.duration}
- **Services:** ${this.impact.servicesAffected?.join(', ') || 'TBD'}
- **SLA Breach:** ${this.impact.slaBreached ? 'Yes' : 'No'}

## Timeline
${this.timeline.map(e => `- **${e.timestamp.toLocaleTimeString()}**: ${e.description} (${e.author})`).join('\n')}

## Action Items
${this.actionItems.map(item => `- [ ] **${item.id}**: ${item.action} (${item.owner}, ${item.priority}, Due: ${item.dueDate})`).join('\n')}

## Metrics
- **MTTD:** ${metrics.mttd}
- **MTTA:** ${metrics.mtta}
- **MTTR:** ${metrics.mttr}`;
  }
}

// Usage
const incident = new IncidentReport({
  title: 'Database Connection Pool Exhaustion',
  severity: 'SEV1',
  commander: 'John Doe',
  responders: ['Jane Smith', 'Bob Wilson']
});

incident.addTimelineEvent({
  type: 'detection',
  description: 'High error rate alert triggered',
  author: 'Monitoring System'
});

incident.setImpact({
  usersAffected: '~5000 users (15%)',
  duration: '25 minutes',
  revenueImpact: 10000,
  servicesAffected: ['API Gateway', 'User Service'],
  slaBreached: true
});

incident.addActionItem({
  action: 'Implement connection pool monitoring',
  owner: 'SRE Team',
  priority: 'P0',
  dueDate: '2024-04-15'
});
```

## Root Cause Analysis (5 Whys)

```javascript
class FiveWhysAnalysis {
  constructor(problem) {
    this.problem = problem;
    this.whys = [];
    this.rootCause = null;
  }

  askWhy(question, answer) {
    this.whys.push({ question, answer });
    if (this.whys.length >= 5 || this.isRootCause(answer)) {
      this.rootCause = answer;
    }
    return this;
  }

  exportMarkdown() {
    return `## Root Cause Analysis: 5 Whys

**Problem:** ${this.problem}

${this.whys.map((why, i) => `**Why ${i + 1}:** ${why.question}\n**Answer:** ${why.answer}`).join('\n\n')}

**Root Cause:** ${this.rootCause || 'Not yet determined'}`;
  }
}
```

## Severity Classification

```javascript
const severityLevels = {
  SEV1: {
    name: 'Critical',
    description: 'Complete service outage or critical security incident',
    responseTime: '15 minutes',
    examples: ['Complete service down', 'Data breach', 'Payment system failure']
  },
  SEV2: {
    name: 'High',
    description: 'Major feature degraded but service partially functional',
    responseTime: '1 hour',
    examples: ['Performance degradation', 'Core feature unavailable', 'Affecting >25% users']
  },
  SEV3: {
    name: 'Medium',
    description: 'Minor feature issue or limited user impact',
    responseTime: '4 hours',
    examples: ['Non-critical feature bug', 'Affecting <5% users', 'Minor performance issue']
  }
};

function classifyIncidentSeverity(criteria) {
  const { serviceDown, usersAffected, revenueImpact, dataLoss, securityBreach } = criteria;

  if (serviceDown || dataLoss || securityBreach) return 'SEV1';
  if (usersAffected > 25 || revenueImpact > 10000) return 'SEV2';
  if (usersAffected > 5 || revenueImpact > 1000) return 'SEV3';
  return 'SEV4';
}
```

## Best Practices

### Documentation
- Start documenting immediately when incident begins
- Record all actions with timestamps
- Capture logs, metrics, screenshots
- Write objectively, not emotionally
- Focus on facts, not blame

### Communication
- Set clear expectations for update frequency
- Use consistent channels
- Update stakeholders proactively
- Be transparent about unknowns
- Avoid technical jargon in customer communications

### Post-Mortem
- Conduct within 48 hours of resolution
- Make post-mortems blameless
- Focus on systems and processes
- Identify specific, actionable improvements
- Assign clear owners and due dates
- Share learnings across organization

### Metrics to Track
- MTTD (Mean Time to Detect)
- MTTA (Mean Time to Acknowledge)
- MTTR (Mean Time to Resolve)
- Error budget impact
- Action item completion rate
