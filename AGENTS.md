# Diretrizes de Desenvolvimento - Lumna

## 1. Contexto do App

Lumna é uma plataforma de cobranças por link para pequenos vendedores. Cada usuário conecta a própria conta AbacatePay (chave de API) e usa o app para criar clientes e cobranças; o cliente final recebe um link e paga via AbacatePay. Sem chave cadastrada, o usuário permanece no onboarding até conectar a integração.

# 2. Stack

Sempre utilize o `bun` para gerenciar o projeto.

- **Core:** Next.js (App Router) & TypeScript (Modo estrito, evite `any`).
- **Auth:** Better Auth
- **DB:** Drizzle + Postgres
- **Forms:** react-hook-form + zod + zodResolver + Controller + Field (shadcn)
- **Data:** server actions + React Query (cache e invalidação)
- **Pagamentos:** AbacatePay (chave do usuário, criptografada com AES-256-GCM)

> **Após qualquer implementação**, rode `bun check`.
