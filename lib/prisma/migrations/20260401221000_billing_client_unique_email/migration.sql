-- Enforce one client per email inside each user workspace.
CREATE UNIQUE INDEX "billing_clients_userId_email_key" ON "billing_clients"("userId", "email");
