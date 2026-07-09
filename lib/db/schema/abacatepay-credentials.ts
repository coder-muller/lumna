import { relations } from "drizzle-orm"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { user } from "./auth"

export const abacatepayCredentials = pgTable("abacatepay_credentials", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  encryptedKey: text("encrypted_key").notNull(),
  keyPrefix: text("key_prefix").notNull(),
  keyHint: text("key_hint").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
})

export const abacatepayCredentialsRelations = relations(
  abacatepayCredentials,
  ({ one }) => ({
    user: one(user, {
      fields: [abacatepayCredentials.userId],
      references: [user.id],
    }),
  })
)
