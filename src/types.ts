import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

export interface McpToolContext {
  mcp: McpServer
}

// Define the options type
export interface McpServerOptions {
  name: string
  version: string
}

export type Tools = (context: McpToolContext) => void
