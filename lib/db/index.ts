import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

const globalForDb = globalThis as unknown as {
  postgresClient: ReturnType<typeof postgres> | undefined
}

function createClient() {
  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set")
  }

  return postgres(databaseUrl, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  })
}

const client = globalForDb.postgresClient ?? createClient()

if (process.env.NODE_ENV !== "production") {
  globalForDb.postgresClient = client
}

export const db = drizzle(client, { schema })
