# npm-query-mcp - MCP Server for NPM Package Search

This is a Model Context Protocol (MCP) server that provides NPM package search functionality through multiple transport protocols.

## Development Commands

### Build and Setup
```bash
# Build the project
npm run build

# Development with hot reload
npm run start

# Development with MCP inspector (recommended)
npm run dev

# Prepare development environment
npm run dev:prepare
```

### Testing and Quality
```bash
# Run tests
npm run test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run typecheck
```

### MCP Server Testing
```bash
# Test with stdio transport (default)
npm run run-cli

# Test with HTTP transport + inspector
npm run dev-http

# Test with SSE transport + inspector (deprecated)
npm run dev-sse

# Test with stdio + inspector
npm run dev-stdio

# Use MCP inspector standalone
npm run inspect
```

## Architecture

### Core Components

- **`src/index.ts`**: CLI entry point using `citty` for command-line interface
- **`src/server.ts`**: MCP server creation and transport management (stdio/HTTP/SSE)
- **`src/types.ts`**: TypeScript interfaces for MCP tool context and server options
- **`src/tools/`**: Directory containing MCP tool implementations

### Transport Protocols

The server supports three transport methods:

1. **stdio** (default): Standard I/O for local usage
2. **HTTP**: REST API with streaming support for remote/local usage  
3. **SSE**: Server-Sent Events (deprecated)

### Tool System

Tools are registered in `src/tools/mytool.ts`:
- **`search_npm_packages`**: Executes `npm search` command and returns results
- Uses Zod for input validation
- Implements proper error handling with MCP error codes

### Build System

- **Primary**: `unbuild` with ESBuild for production builds
- **Development**: `tsx` for TypeScript execution
- **Testing**: Vitest
- **Linting**: ESLint with Antfu config

## MCP Client Configuration

### Cursor IDE (.cursor/mcp.json)
```json
{
  "mcpServers": {
    "npm-search-server": {
      "command": "node",
      "args": ["./bin/cli.mjs"]
    }
  }
}
```

### Published Package Usage
```json
{
  "mcpServers": {
    "npm-search-server": {
      "command": "npx",
      "args": ["npm-query-mcp"]
    }
  }
}
```

## Key Files

- **`bin/cli.mjs`**: Built CLI executable
- **`dist/index.mjs`**: Built server module
- **`.cursor/mcp.json`**: Example MCP client configuration
- **`build.config.ts`**: Unbuild configuration
- **`package.json`**: Defines CLI binaries and export paths