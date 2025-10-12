---
description: Build Claude Desktop Extensions (DXT) with proper MCP server setup and manifest configuration
version: 1.0.0
---

# Claude Desktop Extension Builder

Build Claude Desktop Extensions using the Model Context Protocol to extend Claude Desktop with custom tools and capabilities.

## What It Does

- Creates MCP-compatible server implementations
- Generates valid extension manifest files
- Sets up proper tool definitions and schemas
- Configures stdio transport for local execution
- Enables custom functionality in Claude Desktop

## How to Use

Run this command when you want to create a new Desktop Extension:

```bash
/claude-desktop-extension
```

The command will guide you through creating a complete extension with server code and manifest.

## Example Structure

A basic DXT includes two main files:

**manifest.json**
```json
{
  "name": "my-extension",
  "version": "1.0.0",
  "description": "Custom tools for Claude",
  "main": "server.js",
  "mcp": {
    "transport": "stdio"
  }
}
```

**server.js**
```javascript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-extension',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler('tools/list', async () => ({
  tools: [{
    name: 'my_tool',
    description: 'Does something useful',
    inputSchema: {
      type: 'object',
      properties: {
        input: { type: 'string' }
      }
    }
  }]
}));

server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'my_tool') {
    return {
      content: [{ type: 'text', text: `Processed: ${args.input}` }]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

## Use Cases

- **File System Tools**: Add custom file operations beyond built-in capabilities
- **API Integrations**: Connect Claude to external services and APIs
- **Data Processing**: Create specialized data transformation tools
- **System Utilities**: Access system information or execute commands
- **Database Access**: Query and modify database contents

## Best Practices

- **Error Handling**: Wrap tool logic in try-catch blocks and return meaningful error messages
- **Input Validation**: Use JSON Schema to validate tool inputs before processing
- **Async Operations**: Use async/await for I/O operations and external API calls
- **Logging**: Add console.error() for debugging (output goes to Claude Desktop logs)
- **Tool Naming**: Use snake_case for tool names and be descriptive
- **Schema Design**: Define clear input schemas with required fields and types
- **Response Format**: Always return structured content arrays
- **Testing**: Test with sample inputs before deploying to Claude Desktop

## Installation

After building your extension:

1. Save files in a dedicated directory
2. Run `npm install @modelcontextprotocol/sdk`
3. Add to Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "my-extension": {
      "command": "node",
      "args": ["/path/to/your/server.js"]
    }
  }
}
```

4. Restart Claude Desktop

## Common Patterns

**Reading environment variables:**
```javascript
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error('API_KEY not configured');
}
```

**Making HTTP requests:**
```javascript
const response = await fetch('https://api.example.com/data');
const data = await response.json();
return { content: [{ type: 'text', text: JSON.stringify(data) }] };
```

**File operations:**
```javascript
import fs from 'fs/promises';
const content = await fs.readFile(args.path, 'utf-8');
return { content: [{ type: 'text', text: content }] };
```

## Troubleshooting

- **Extension not appearing**: Check Claude Desktop logs for connection errors
- **Tool failures**: Ensure proper error handling and valid return formats
- **Transport issues**: Verify stdio transport is configured correctly
- **Schema validation**: Test input schemas match your tool expectations

## Resources

- DXT Documentation: https://github.com/anthropics/dxt
- MCP SDK: https://github.com/modelcontextprotocol
- Examples: https://github.com/anthropics/dxt/tree/main/examples
