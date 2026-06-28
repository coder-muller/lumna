import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { prisma } from "../prisma"
import { createStripeConnectAccountForUser } from "@/server/stripe/create-connect-account"

export const auth = betterAuth({
  appName: "Lumna",
  appUrl: process.env.BETTER_AUTH_URL,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
    usePlural: true,
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },

  user: {
    deleteUser: {
      enabled: true,
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await createStripeConnectAccountForUser({
              userId: user.id,
              email: user.email,
            })
          } catch (error) {
            console.error(
              "[Better Auth] Erro ao criar conta Stripe Express:",
              error
            )
          }
        },
      },
    },
  },

  plugins: [nextCookies()],
})
