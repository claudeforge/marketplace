---
allowed-tools: Bash, Read, Write, Edit, Grep, Glob
description: ClaudeForge emergency hotfix deployment specialist for critical production issues and rapid incident response.
---

# ClaudeForge Hotfix Deployer

ClaudeForge intelligent hotfix deployment system that manages emergency production fixes with automated branching strategies, deployment workflows, rollback procedures, and comprehensive incident response protocols.

## Purpose

Transform emergency production fixes from chaotic manual processes to systematic, auditable, and reversible deployment workflows that minimize downtime, ensure code quality, and maintain production stability during critical incidents.

## Features

- **Hotfix Branching**: Automated Git branching strategies for emergency fixes
- **Emergency Deployment**: Fast-track deployment pipelines with safety checks
- **Rollback Procedures**: One-command rollback with state preservation
- **Incident Response**: Structured incident management and communication workflows
- **Change Validation**: Pre-deployment testing and validation automation
- **Audit Logging**: Complete audit trail for compliance and post-mortems
- **Team Coordination**: Automated notifications and stakeholder communication
- **Post-Deployment Monitoring**: Real-time health checks and rollback triggers

## Usage

```bash
/hotfix-deployer [command] [options]
```

Target: $ARGUMENTS (if specified, otherwise analyze current production state)

### Hotfix Commands

**Create Hotfix Branch:**
```bash
/hotfix-deployer create --issue=PROD-2847 --severity=critical --from=production
```
Creates emergency hotfix branch with:
- Branch naming convention (hotfix/PROD-2847-description)
- Production baseline identification
- Automatic issue tracker linking
- Team notification via Slack/Teams
- Incident timeline initialization
- Emergency approval workflow trigger

**Deploy Hotfix:**
```bash
/hotfix-deployer deploy --target=production --verify --notify-stakeholders
```
Executes controlled hotfix deployment:
- Pre-deployment health checks
- Database migration validation
- Configuration consistency check
- Blue-green deployment strategy
- Canary release with gradual rollout
- Automated smoke tests
- Real-time monitoring dashboard
- Stakeholder notification system

**Rollback Deployment:**
```bash
/hotfix-deployer rollback --version=previous --preserve-data --immediate
```
Performs emergency rollback with:
- Instant traffic switching
- Database state preservation
- Session continuity maintenance
- Cache invalidation
- CDN purge coordination
- DNS propagation handling
- Service health verification
- Incident escalation procedures

### Incident Management

**Incident Declaration:**
```bash
/hotfix-deployer incident create --severity=sev1 --title="Payment Gateway Down" --impact=high
```
Initiates incident response with:
- Severity level classification (SEV0-SEV3)
- Automatic team assembly and notification
- Incident commander assignment
- War room creation (Zoom/Slack)
- Status page update automation
- Customer communication templates
- Executive escalation if needed
- Timeline documentation system

**Status Updates:**
```bash
/hotfix-deployer incident update --status=investigating --eta="15 minutes" --broadcast
```
Manages incident communication:
- Regular status update intervals
- Multi-channel broadcasting (Slack, email, status page)
- Stakeholder-specific messaging
- Customer-facing communication
- Internal team coordination
- Progress tracking and timeline
- Evidence collection for post-mortem

**Incident Resolution:**
```bash
/hotfix-deployer incident resolve --root-cause="null pointer" --action-items="add validation"
```
Closes incident with:
- Resolution confirmation and validation
- Root cause documentation
- Action item assignment
- Post-mortem scheduling
- Customer notification
- Status page resolution
- Monitoring alert tuning
- Knowledge base article creation

### Validation and Testing

**Pre-Deployment Validation:**
```bash
/hotfix-deployer validate --environment=staging --test-suite=critical-path
```
Runs validation suite including:
- Critical path smoke tests
- Integration test subset
- Database migration dry-run
- Performance regression checks
- Security vulnerability scan
- Configuration validation
- Dependency conflict detection
- Backward compatibility verification

**Production Verification:**
```bash
/hotfix-deployer verify --endpoints=critical --duration=5m --auto-rollback
```
Monitors deployment health:
- Health endpoint polling
- Error rate monitoring
- Response time tracking
- Database connection pool status
- External service dependencies
- User session validation
- Transaction success rates
- Automatic rollback triggers

## Branching Strategies

### Git Flow Hotfix Model

**Hotfix Branch Creation:**
```bash
# Create from production tag
git checkout -b hotfix/2.1.1 v2.1.0
git push -u origin hotfix/2.1.1

# Make critical fix
git add .
git commit -m "hotfix: fix payment processing null pointer exception

- Add null check for payment method
- Add defensive validation
- Add error logging

Resolves: PROD-2847
Severity: Critical"

# Tag hotfix version
git tag -a v2.1.1 -m "Hotfix: Payment processing fix"
git push origin v2.1.1
```

**Merge Strategy:**
```bash
# Merge to production
git checkout production
git merge --no-ff hotfix/2.1.1
git push origin production

# Merge to develop
git checkout develop
git merge --no-ff hotfix/2.1.1
git push origin develop

# Clean up hotfix branch
git branch -d hotfix/2.1.1
git push origin --delete hotfix/2.1.1
```

### Trunk-Based Hotfix Model

**Direct Production Fix:**
```bash
# Create hotfix from production
git checkout production
git pull origin production
git checkout -b hotfix/payment-fix

# Make fix and fast-forward
git add .
git commit -m "hotfix: payment processing fix"

# Deploy directly
git checkout production
git merge --ff-only hotfix/payment-fix
git push origin production

# Cherry-pick to main
git checkout main
git cherry-pick <hotfix-commit-sha>
git push origin main
```

## Deployment Workflows

### Blue-Green Deployment

**Implementation:**
```yaml
# Kubernetes blue-green deployment
apiVersion: v1
kind: Service
metadata:
  name: app-service
spec:
  selector:
    app: myapp
    version: blue  # Switch to 'green' for deployment
  ports:
    - port: 80
      targetPort: 8080

---
# Blue deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-blue
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: blue
  template:
    metadata:
      labels:
        app: myapp
        version: blue
    spec:
      containers:
      - name: app
        image: myapp:v2.1.0
        ports:
        - containerPort: 8080

---
# Green deployment (new version)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-green
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
      version: green
  template:
    metadata:
      labels:
        app: myapp
        version: green
    spec:
      containers:
      - name: app
        image: myapp:v2.1.1  # New hotfix version
        ports:
        - containerPort: 8080
```

**Deployment Script:**
```bash
#!/bin/bash
# Blue-green deployment script

CURRENT_VERSION=$(kubectl get service app-service -o jsonpath='{.spec.selector.version}')
NEW_VERSION=$([ "$CURRENT_VERSION" = "blue" ] && echo "green" || echo "blue")

echo "Current version: $CURRENT_VERSION"
echo "Deploying to: $NEW_VERSION"

# Deploy new version
kubectl apply -f deployment-$NEW_VERSION.yaml

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l version=$NEW_VERSION --timeout=300s

# Run smoke tests
./run-smoke-tests.sh $NEW_VERSION

if [ $? -eq 0 ]; then
  echo "Smoke tests passed. Switching traffic..."
  kubectl patch service app-service -p '{"spec":{"selector":{"version":"'$NEW_VERSION'"}}}'
  echo "Deployment successful!"
else
  echo "Smoke tests failed. Rolling back..."
  kubectl delete deployment app-$NEW_VERSION
  exit 1
fi
```

### Canary Deployment

**Progressive Rollout:**
```yaml
# Istio VirtualService for canary
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-canary
spec:
  hosts:
  - app.example.com
  http:
  - match:
    - headers:
        canary:
          exact: "true"
    route:
    - destination:
        host: app-service
        subset: v2-1-1
  - route:
    - destination:
        host: app-service
        subset: v2-1-0
      weight: 90
    - destination:
        host: app-service
        subset: v2-1-1
      weight: 10  # Start with 10% traffic
```

**Automated Canary Script:**
```bash
#!/bin/bash
# Progressive canary deployment

WEIGHTS=(10 25 50 75 100)
CANARY_DURATION=300  # 5 minutes per stage

for WEIGHT in "${WEIGHTS[@]}"; do
  echo "Deploying canary with ${WEIGHT}% traffic..."

  # Update traffic split
  kubectl apply -f - <<EOF
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: app-canary
spec:
  hosts:
  - app.example.com
  http:
  - route:
    - destination:
        host: app-service
        subset: v2-1-0
      weight: $((100 - WEIGHT))
    - destination:
        host: app-service
        subset: v2-1-1
      weight: $WEIGHT
EOF

  echo "Monitoring for ${CANARY_DURATION} seconds..."
  sleep $CANARY_DURATION

  # Check error rates
  ERROR_RATE=$(prometheus-query "rate(http_requests_total{status=~'5..'}[5m])")

  if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then
    echo "Error rate too high! Rolling back..."
    kubectl apply -f virtualservice-stable.yaml
    exit 1
  fi

  echo "Stage ${WEIGHT}% successful"
done

echo "Canary deployment complete!"
```

## Rollback Procedures

### Automated Rollback

**Kubernetes Rollback:**
```bash
#!/bin/bash
# Immediate rollback script

echo "Initiating emergency rollback..."

# Rollback deployment
kubectl rollout undo deployment/app-deployment

# Wait for rollback to complete
kubectl rollout status deployment/app-deployment --timeout=300s

# Verify health
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://app.example.com/health)

if [ "$HEALTH" = "200" ]; then
  echo "Rollback successful. Application healthy."

  # Notify team
  curl -X POST https://hooks.slack.com/services/XXX \
    -H 'Content-Type: application/json' \
    -d '{
      "text": "🔄 Emergency rollback completed successfully",
      "attachments": [{
        "color": "good",
        "text": "Application health verified. Production stable."
      }]
    }'
else
  echo "Rollback failed! Health check returned: $HEALTH"
  echo "Escalating to on-call engineer..."
  ./escalate-incident.sh
  exit 1
fi
```

**Database Rollback:**
```bash
#!/bin/bash
# Database migration rollback

echo "Rolling back database migrations..."

# Get current migration version
CURRENT_VERSION=$(psql -tAc "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1")
echo "Current migration: $CURRENT_VERSION"

# Rollback last migration
npm run migrate:rollback

# Verify database integrity
npm run db:verify

if [ $? -eq 0 ]; then
  echo "Database rollback successful"
else
  echo "Database rollback failed! Manual intervention required."
  echo "Creating database snapshot for recovery..."
  pg_dump dbname > emergency-backup-$(date +%Y%m%d-%H%M%S).sql
  exit 1
fi
```

## Incident Response Playbooks

### SEV1 Incident Playbook

**Critical Service Outage:**
```markdown
## SEV1: Complete Service Outage

### Immediate Actions (0-5 minutes)
1. [ ] Declare SEV1 incident in #incidents channel
2. [ ] Page on-call engineer and engineering manager
3. [ ] Update status page: "Investigating service disruption"
4. [ ] Assemble incident response team in war room
5. [ ] Begin incident timeline documentation

### Investigation Phase (5-15 minutes)
1. [ ] Check monitoring dashboards for anomalies
2. [ ] Review recent deployments and changes
3. [ ] Analyze error logs and stack traces
4. [ ] Test critical user journeys manually
5. [ ] Identify root cause hypothesis

### Mitigation Phase (15-30 minutes)
1. [ ] Implement emergency fix or rollback
2. [ ] Deploy hotfix following fast-track process
3. [ ] Verify fix in staging environment
4. [ ] Deploy to production with monitoring
5. [ ] Confirm service restoration

### Recovery Phase (30+ minutes)
1. [ ] Update status page: "Service restored"
2. [ ] Send customer communication
3. [ ] Continue monitoring for 2 hours
4. [ ] Schedule post-mortem within 48 hours
5. [ ] Document action items and learnings
```

### Communication Templates

**Initial Notification:**
```
🚨 INCIDENT DECLARED: SEV1

Title: Payment Gateway Down
Impact: All payment processing unavailable
Started: 2024-03-15 14:32 UTC
Status: Investigating

We are aware of an issue affecting payment processing.
Our team is actively investigating and will provide updates every 15 minutes.

Incident Commander: @john.doe
War Room: https://zoom.us/incident-123

#incident #sev1
```

**Status Update:**
```
📊 INCIDENT UPDATE: SEV1 (15 min)

Status: Identified root cause
Root Cause: Database connection pool exhaustion
Action: Deploying hotfix to increase pool size
ETA: 10 minutes

Next update in 15 minutes.
```

**Resolution Notice:**
```
✅ INCIDENT RESOLVED: SEV1

Title: Payment Gateway Down
Duration: 47 minutes
Resolution: Hotfix deployed (v2.1.1)

Service is fully restored. We will continue monitoring for the next 2 hours.
A detailed post-mortem will be shared within 48 hours.

Thank you for your patience.
```

## CI/CD Integration

### GitHub Actions Hotfix Pipeline

```yaml
name: Emergency Hotfix Deployment

on:
  push:
    branches:
      - 'hotfix/**'

env:
  SEVERITY: critical
  SKIP_TESTS: false

jobs:
  validate:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v3

      - name: Notify deployment start
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "🔥 Hotfix deployment started: ${{ github.ref_name }}",
              "channel": "#deployments"
            }

      - name: Fast security scan
        run: npm audit --audit-level=high

      - name: Run critical tests only
        run: npm run test:critical

  deploy-staging:
    needs: validate
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to staging
        run: |
          npm run deploy:staging
          npm run smoke-test:staging

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Create deployment backup
        run: kubectl create backup production-pre-hotfix-$(date +%s)

      - name: Deploy hotfix
        run: |
          npm run deploy:production
          sleep 30  # Allow for pod startup

      - name: Health check
        run: |
          for i in {1..10}; do
            if curl -f https://api.example.com/health; then
              echo "Health check passed"
              exit 0
            fi
            sleep 5
          done
          echo "Health check failed"
          exit 1

      - name: Automatic rollback on failure
        if: failure()
        run: |
          echo "Deployment failed. Initiating rollback..."
          npm run rollback:production
          kubectl restore backup production-pre-hotfix-*

      - name: Notify deployment result
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "${{ job.status == 'success' && '✅ Hotfix deployed successfully' || '❌ Hotfix deployment failed - rolled back' }}",
              "channel": "#incidents"
            }
```

### Monitoring and Alerting

**Prometheus Alert Rules:**
```yaml
groups:
- name: hotfix-monitoring
  interval: 10s
  rules:
  - alert: HighErrorRateAfterDeploy
    expr: rate(http_requests_total{status=~"5.."}[1m]) > 0.05
    for: 2m
    labels:
      severity: critical
    annotations:
      summary: "High error rate detected after deployment"
      description: "Error rate is {{ $value }} (threshold: 0.05)"

  - alert: ResponseTimeRegression
    expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
    for: 3m
    labels:
      severity: warning
    annotations:
      summary: "P95 response time regression"
      description: "P95 latency is {{ $value }}s (threshold: 2s)"
```

---

**ClaudeForge Hotfix Deployer** - Enterprise-grade emergency deployment system with automated workflows, comprehensive rollback procedures, and structured incident response for production stability.
