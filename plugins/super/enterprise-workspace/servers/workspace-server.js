#!/usr/bin/env node
/**
 * Workspace State MCP Server
 * Provides Model Context Protocol server for tracking workspace state,
 * metrics, and compliance status across Claude Code sessions.
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

// State storage path
const STATE_DIR = path.join(os.homedir(), '.claude-workspace-state');
const STATE_FILE = path.join(STATE_DIR, 'workspace-state.json');

// Initialize server
const server = new Server(
  {
    name: 'enterprise-workspace-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// Ensure state directory exists
async function ensureStateDir() {
  try {
    await fs.mkdir(STATE_DIR, { recursive: true });
  } catch (error) {
    console.error('Failed to create state directory:', error);
  }
}

// Load workspace state
async function loadState() {
  try {
    const data = await fs.readFile(STATE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return default state if file doesn't exist
    return {
      workspaces: {},
      metrics: {},
      lastAudit: null,
      complianceStatus: {},
    };
  }
}

// Save workspace state
async function saveState(state) {
  try {
    await fs.writeFile(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

// Define resources
server.setRequestHandler('resources/list', async () => {
  const state = await loadState();

  return {
    resources: [
      {
        uri: 'workspace://state',
        name: 'Current Workspace State',
        description: 'Current state of all tracked workspaces',
        mimeType: 'application/json',
      },
      {
        uri: 'workspace://metrics',
        name: 'Workspace Metrics',
        description: 'Aggregated metrics across workspaces',
        mimeType: 'application/json',
      },
      {
        uri: 'workspace://compliance',
        name: 'Compliance Status',
        description: 'Current compliance status and issues',
        mimeType: 'application/json',
      },
    ],
  };
});

server.setRequestHandler('resources/read', async (request) => {
  const state = await loadState();
  const { uri } = request.params;

  switch (uri) {
    case 'workspace://state':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(state.workspaces, null, 2),
          },
        ],
      };

    case 'workspace://metrics':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(state.metrics, null, 2),
          },
        ],
      };

    case 'workspace://compliance':
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(state.complianceStatus, null, 2),
          },
        ],
      };

    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// Define tools
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'track_workspace',
        description: 'Track workspace initialization or updates',
        inputSchema: {
          type: 'object',
          properties: {
            workspacePath: {
              type: 'string',
              description: 'Path to the workspace',
            },
            action: {
              type: 'string',
              enum: ['init', 'sync', 'audit'],
              description: 'Action performed on workspace',
            },
            metadata: {
              type: 'object',
              description: 'Additional metadata about the action',
            },
          },
          required: ['workspacePath', 'action'],
        },
      },
      {
        name: 'record_metric',
        description: 'Record a workspace metric',
        inputSchema: {
          type: 'object',
          properties: {
            workspacePath: {
              type: 'string',
              description: 'Path to the workspace',
            },
            metricName: {
              type: 'string',
              description: 'Name of the metric',
            },
            value: {
              type: 'number',
              description: 'Metric value',
            },
            timestamp: {
              type: 'string',
              description: 'ISO timestamp',
            },
          },
          required: ['workspacePath', 'metricName', 'value'],
        },
      },
      {
        name: 'update_compliance',
        description: 'Update compliance status',
        inputSchema: {
          type: 'object',
          properties: {
            workspacePath: {
              type: 'string',
              description: 'Path to the workspace',
            },
            category: {
              type: 'string',
              description: 'Compliance category',
            },
            status: {
              type: 'string',
              enum: ['pass', 'warn', 'fail'],
              description: 'Compliance status',
            },
            issues: {
              type: 'array',
              items: { type: 'string' },
              description: 'List of compliance issues',
            },
          },
          required: ['workspacePath', 'category', 'status'],
        },
      },
    ],
  };
});

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  const state = await loadState();

  switch (name) {
    case 'track_workspace': {
      const { workspacePath, action, metadata } = args;
      const workspaceKey = Buffer.from(workspacePath).toString('base64');

      if (!state.workspaces[workspaceKey]) {
        state.workspaces[workspaceKey] = {
          path: workspacePath,
          actions: [],
          createdAt: new Date().toISOString(),
        };
      }

      state.workspaces[workspaceKey].actions.push({
        action,
        metadata,
        timestamp: new Date().toISOString(),
      });

      state.workspaces[workspaceKey].lastAction = action;
      state.workspaces[workspaceKey].lastUpdate = new Date().toISOString();

      await saveState(state);

      return {
        content: [
          {
            type: 'text',
            text: `Tracked ${action} for workspace: ${workspacePath}`,
          },
        ],
      };
    }

    case 'record_metric': {
      const { workspacePath, metricName, value, timestamp } = args;
      const workspaceKey = Buffer.from(workspacePath).toString('base64');

      if (!state.metrics[workspaceKey]) {
        state.metrics[workspaceKey] = {};
      }

      if (!state.metrics[workspaceKey][metricName]) {
        state.metrics[workspaceKey][metricName] = [];
      }

      state.metrics[workspaceKey][metricName].push({
        value,
        timestamp: timestamp || new Date().toISOString(),
      });

      // Keep only last 100 measurements
      if (state.metrics[workspaceKey][metricName].length > 100) {
        state.metrics[workspaceKey][metricName] = state.metrics[workspaceKey][
          metricName
        ].slice(-100);
      }

      await saveState(state);

      return {
        content: [
          {
            type: 'text',
            text: `Recorded ${metricName} = ${value} for ${workspacePath}`,
          },
        ],
      };
    }

    case 'update_compliance': {
      const { workspacePath, category, status, issues } = args;
      const workspaceKey = Buffer.from(workspacePath).toString('base64');

      if (!state.complianceStatus[workspaceKey]) {
        state.complianceStatus[workspaceKey] = {};
      }

      state.complianceStatus[workspaceKey][category] = {
        status,
        issues: issues || [],
        lastChecked: new Date().toISOString(),
      };

      await saveState(state);

      return {
        content: [
          {
            type: 'text',
            text: `Updated ${category} compliance status to ${status} for ${workspacePath}`,
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start server
async function main() {
  await ensureStateDir();

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('Enterprise Workspace MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
