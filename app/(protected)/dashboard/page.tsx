import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { requireSession } from "@/lib/auth/functions"
import { UserIcon } from "lucide-react"

export default async function DashboardPage() {
  const session = await requireSession()

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <Avatar>
          <AvatarImage
            src={session.user.image || undefined}
            alt={session.user.name || undefined}
          />
          <AvatarFallback>
            {session.user.name?.[0] || (
              <UserIcon className="size-3 text-muted-foreground" />
            )}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <p className="text-sm font-medium">{session.user.name}</p>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
        </div>
      </div>
    </div>
  )
}
