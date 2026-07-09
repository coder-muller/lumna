CREATE TABLE "invoices" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"customer_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"value" integer NOT NULL,
	"status" text DEFAULT 'OPEN' NOT NULL,
	"paid_at" timestamp,
	"refunded_at" timestamp,
	"abacatepay_product_id" text NOT NULL,
	"abacatepay_checkout_id" text NOT NULL,
	"checkout_url" text NOT NULL,
	"refund_failed_at" timestamp,
	"refund_error" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "abacatepay_credentials" ADD COLUMN "webhook_id" text;--> statement-breakpoint
ALTER TABLE "abacatepay_credentials" ADD COLUMN "encrypted_webhook_secret" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "invoices_userId_idx" ON "invoices" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "invoices_userId_status_idx" ON "invoices" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "invoices_customerId_idx" ON "invoices" USING btree ("customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoices_abacatepayCheckoutId_unique" ON "invoices" USING btree ("abacatepay_checkout_id");