import { auth } from "@/lib/auth/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

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
