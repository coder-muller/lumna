import { relations } from "drizzle-orm"
import { index, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core"

import { user } from "./auth"

export type CustomerSyncStatus = "synced" | "desynced"

export const customers = pgTable(
  "customers",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    abacatepayCustomerId: text("abacatepay_customer_id").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    taxId: text("tax_id"),
    syncStatus: text("sync_status").notNull().default("synced"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("customers_userId_idx").on(table.userId),
    index("customers_userId_abacatepayCustomerId_idx").on(
      table.userId,
      table.abacatepayCustomerId
    ),
    unique("customers_userId_email_unique").on(table.userId, table.email),
    unique("customers_userId_taxId_unique").on(table.userId, table.taxId),
  ]
)

export type Customer = typeof customers.$inferSelect

export const customersRelations = relations(customers, ({ one }) => ({
  user: one(user, {
    fields: [customers.userId],
    references: [user.id],
  }),
}))
