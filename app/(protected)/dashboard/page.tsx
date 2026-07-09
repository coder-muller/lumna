import { requireSession } from "@/lib/auth/session"

export default async function Page() {
  const { user } = await requireSession()

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl leading-none font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {user.name.split(" ")[0]}.
        </p>
      </div>
    </div>
  )
}
