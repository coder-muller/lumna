import { cn } from "@/lib/utils"

export function DashboardSkeleton() {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 lg:grid-cols-4",
        "*:min-h-48 *:w-full *:rounded-md *:bg-muted *:ring-1 *:ring-border *:dark:bg-muted/50"
      )}
    >
      <div />
      <div />
      <div />
      <div />
      <div className="col-span-2 min-h-[23rem] lg:col-span-2" />
      <div className="col-span-2 min-h-[23rem] lg:col-span-2" />
      <div className="col-span-2 min-h-[28.5rem] lg:col-span-4" />
    </div>
  )
}
