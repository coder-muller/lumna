import { requireSession } from "@/lib/auth/functions"

export default async function DashboardPage() {
  await requireSession()
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="text-sm font-semibold">Dashboard</p>
      <p className="text-xs font-normal text-muted-foreground">
        Ainda em desenvolvimento...
      </p>
    </div>
  )
}
