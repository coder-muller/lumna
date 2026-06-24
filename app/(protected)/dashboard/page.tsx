import { requireSession } from "@/lib/auth/session"

export default async function DashboardPage() {
  const session = await requireSession()
  return (
    <>
      Bem-vindo, <span className="font-bold">{session.user.name}!</span>
    </>
  )
}
