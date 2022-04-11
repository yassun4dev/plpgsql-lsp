import { Logger } from "vscode-jsonrpc/node"
import { TextDocument } from "vscode-languageserver-textdocument"

import { PostgresPool } from "@/postgres/pool"


export const FILE_QUERY_COMMAND_INFO = {
  title: "PL/pgSQL: Execute File Query",
  command: "plpgsql-lsp.executeFileQuery",
  execute: executeFileQuery,
} as const

export async function executeFileQuery(
  pgPool: PostgresPool, document: TextDocument, logger: Logger,
): Promise<void> {
  const pgClient = await pgPool.connect()
  try {
    await pgClient.query(document.getText())
  }
  catch (error: unknown) {
    logger.error((error as Error).message)

    throw error
  }
  finally {
    await pgClient.release()
  }
}