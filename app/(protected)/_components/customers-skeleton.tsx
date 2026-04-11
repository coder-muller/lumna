import { cn } from "@/lib/utils"

export function CustomersSkeleton() {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 lg:grid-cols-4",
        "*:w-full *:rounded-md *:bg-muted *:ring-1 *:ring-border *:dark:bg-muted/50"
      )}
    >
      <div className="col-span-2 h-12 lg:col-span-2" />
      <div className="h-12 lg:col-span-1" />
      <div className="h-12 lg:col-span-1" />
      <div className="min-h-56 lg:col-span-1" />
      <div className="min-h-56 lg:col-span-1" />
      <div className="col-span-2 min-h-56 lg:col-span-2" />
      <div className="col-span-2 min-h-[33rem] lg:col-span-4" />
    </div>
  )
}
