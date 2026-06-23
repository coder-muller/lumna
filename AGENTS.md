# Diretrizes de Desenvolvimento - Lumna

## 1. Contexto do App

Lumna é uma plataforma de cobranças por link para pequenos vendedores, usando Stripe para processar pagamentos. O usuário cria clientes e cobranças avulsas; o cliente final recebe um link e paga via Stripe Checkout. O app usa Stripe Connect com deferred onboarding e retém 0,99% de cada transação como taxa da plataforma.

# 2. Stack

Sempre utilize o `bun` para gerenciar o projeto.

- **Core:** Next.js (App Router) & TypeScript (Modo estrito, evite `any`).

> **Após qualquer implementação**, rode `bun check`.

