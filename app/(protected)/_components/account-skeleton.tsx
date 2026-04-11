import { cn } from "@/lib/utils"

export function AccountSkeleton() {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 lg:grid-cols-2",
        "*:w-full *:rounded-md *:bg-muted *:ring-1 *:ring-border *:dark:bg-muted/50"
      )}
    >
      <div className="min-h-80" />
      <div className="min-h-80" />
      <div className="min-h-72" />
      <div className="min-h-72" />
      <div className="min-h-96 lg:col-span-2" />
    </div>
  )
}
