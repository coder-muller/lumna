import { relations } from "drizzle-orm"
import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core"

import { user } from "./auth"
import { customers } from "./customers"

export type InvoiceStatus = "OPEN" | "PAID" | "CANCELED" | "REFUNDED"

export const invoices = pgTable(
  "invoices",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "restrict" }),
    title: text("title").notNull(),
    description: text("description"),
    value: integer("value").notNull(),
    status: text("status").notNull().default("OPEN").$type<InvoiceStatus>(),
    paidAt: timestamp("paid_at"),
    refundedAt: timestamp("refunded_at"),
    abacatepayProductId: text("abacatepay_product_id").notNull(),
    abacatepayCheckoutId: text("abacatepay_checkout_id").notNull(),
    checkoutUrl: text("checkout_url").notNull(),
    refundFailedAt: timestamp("refund_failed_at"),
    refundError: text("refund_error"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("invoices_userId_idx").on(table.userId),
    index("invoices_userId_status_idx").on(table.userId, table.status),
    index("invoices_customerId_idx").on(table.customerId),
    uniqueIndex("invoices_abacatepayCheckoutId_unique").on(
      table.abacatepayCheckoutId
    ),
  ]
)

export type Invoice = typeof invoices.$inferSelect

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(user, {
    fields: [invoices.userId],
    references: [user.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
}))
