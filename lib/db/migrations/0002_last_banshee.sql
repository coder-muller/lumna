CREATE TABLE "customers" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"abacatepay_customer_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"tax_id" text,
	"sync_status" text DEFAULT 'synced' NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "customers_userId_email_unique" UNIQUE("user_id","email"),
	CONSTRAINT "customers_userId_taxId_unique" UNIQUE("user_id","tax_id")
);
--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "customers_userId_idx" ON "customers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "customers_userId_abacatepayCustomerId_idx" ON "customers" USING btree ("user_id","abacatepay_customer_id");