import { auth } from "@/lib/auth/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import type { NextRequest } from "next/server"

export async function getSession() {
  return auth.api.getSession({
    headers: await headers(),
  })
}

export async function requireSession() {
  const session = await getSession()

  if (!session) {
    redirect("/sign-in")
  }

  return session
}

export async function getRequestSession(request: Request | NextRequest) {
  return auth.api.getSession({
    headers: request.headers,
  })
}

export async function requireUserId() {
  const session = await requireSession()

  return session.user.id
}
