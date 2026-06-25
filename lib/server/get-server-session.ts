import { auth } from "@/lib/auth/server"
import { headers } from "next/headers"
import { User, Session } from "better-auth"

export async function getServerSession(): Promise<
  { user: User; session: Session } | { error: string }
> {
  // Get headers from the request
  const headersList = await headers()

  // Get session from the database
  const session = await auth.api.getSession({
    headers: headersList,
  })

  // If session is not found, return error
  if (!session) {
    return {
      error: "Não autorizado",
    }
  }

  // If session is found, return user and session
  return {
    user: session.user,
    session: session.session,
  }
}
