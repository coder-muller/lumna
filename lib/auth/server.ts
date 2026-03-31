import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/lib/prisma"
import { nextCookies } from "better-auth/next-js"

export const auth = betterAuth({
    // Project info
    appName: "Lumna",

    // Database adapter
    database: prismaAdapter(prisma, {
        provider: "postgresql",
        usePlural: true
    }),

    // Github OAuth
    socialProviders: {
        github: {
            enabled: true,
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }
    },

    // Plugins
    plugins: [
        nextCookies()
    ]
})
