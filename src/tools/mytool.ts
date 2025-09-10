import type { McpToolContext } from '../types'
import { exec } from 'node:child_process'
import util from 'node:util'
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js'
import * as dotenv from 'dotenv'
import { z } from 'zod'

const execPromise = util.promisify(exec)

dotenv.config()

export function registerMyTool({ mcp }: McpToolContext): void {
  mcp.tool(
    'search_npm_packages',
    'Search for npm packages',
    {
      query: z.string().describe('Search query'),
    },
    async ({ query }) => {
      try {
        const { stdout, stderr } = await execPromise(`npm search ${query}`)
        // Only throw error if stderr contains actual errors, not just warnings                                                        │
        if (stderr && !stderr.includes('npm warn')) {
          throw new McpError(
            ErrorCode.InternalError,
            `npm search error: ${stderr}`,
          )
        }

        return {
          content: [
            {
              type: 'text',
              text: stdout,
            },
          ],
        }
      }
      catch (error) {
        if (error instanceof McpError) {
          throw error
        }
        if (error instanceof Error) {
          throw new McpError(
            ErrorCode.InternalError,
            `Unexpected error: ${error.message}`,
          )
        }
        throw new McpError(
          ErrorCode.InternalError,
          'Unexpected error occurred',
        )
      }
    },
  )
}
