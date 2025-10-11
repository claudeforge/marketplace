---
description: Automated application deployment with blue-green strategies, rollback capability, and comprehensive monitoring
version: 1.0.0
---

# Application Deployment Command

Expert deployment orchestration with zero-downtime strategies, automated rollback, health monitoring, and production readiness validation.

## Deployment Strategies

### Blue-Green Deployment
Deploy to inactive environment, run health checks, switch traffic atomically, keep previous version for instant rollback.

### Canary Deployment
Deploy to small subset, monitor metrics, gradually increase traffic, rollback if anomalies detected.

### Rolling Deployment
Update servers in batches, maintain availability, monitor health, pause or rollback on failures.

## Infrastructure as Code
Terraform, Kubernetes, Helm, CloudFormation for repeatable deployments.

## Success Criteria
Safe, reliable, zero-downtime deployment with instant rollback capability.
