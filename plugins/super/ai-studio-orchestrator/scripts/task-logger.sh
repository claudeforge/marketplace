#!/bin/bash
# Task execution logger for orchestration tracking
set -euo pipefail

TASK_ID="${1:-unknown}"
ACTION="${2:-start}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

LOG_DIR="${CLAUDE_PLUGIN_ROOT}/../../../.orchestration-logs"
mkdir -p "$LOG_DIR"

echo "{\"timestamp\":\"$TIMESTAMP\",\"task_id\":\"$TASK_ID\",\"action\":\"$ACTION\"}" >> "$LOG_DIR/task-log.jsonl"
