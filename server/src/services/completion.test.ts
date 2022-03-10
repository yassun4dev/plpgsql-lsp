import * as assert from "assert"
import { CompletionItem, Position } from "vscode-languageserver"
import { TextDocument } from "vscode-languageserver-textdocument"

import { Server, setupTestServer } from "@/server/server"
import { TextDocumentTestManager } from "@/server/textDocumentManager"
import { SettingsBuilder } from "@/settings"


describe("Completion Tests", () => {
  let server: Server

  beforeEach(() => {
    const settings = new SettingsBuilder().build()
    server = setupTestServer(settings)
  })

  afterEach(async () => {
    for (const pgPool of server.pgPools.values()) {
      await pgPool.end()
    }
  })

  async function onCompletion(
    content: string, position: Position,
  ): Promise<CompletionItem[] | undefined> {
    const textDocument = TextDocument.create("test.pgsql", "postgres", 0, content);

    (server.documents as TextDocumentTestManager).set(textDocument)

    if (server.handlers === undefined) {
      throw new Error("handlers is undefined")
    }

    return server.handlers.onCompletion({
      position,
      textDocument,
    })
  }

  describe("Completion", function () {
    it("Completion items exist", async () => {
      const completions = await onCompletion(
        "companies", Position.create(1, 1),
      )
      assert.ok(completions && completions.length > 1)
    })
  })
})
