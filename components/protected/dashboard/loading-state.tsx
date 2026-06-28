import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const stats = [
  { label: "Recebido no mês" },
  { label: "Em aberto" },
  { label: "Pagas" },
  { label: "Total de cobranças" },
]

const recentRows = Array.from({ length: 6 })

export function DashboardLoadingState() {
  return (
    <>
      <section
        aria-label="Resumo"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="animate-fade-in-up rounded-xl border border-border/60 bg-card p-5 opacity-0 fill-mode-[forwards] [animation-delay:150ms]"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-4 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-7 w-28" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </section>

      <section
        aria-label="Receita"
        className="animate-fade-in-up rounded-xl border border-border/60 bg-card p-5 opacity-0 fill-mode-[forwards] [animation-delay:300ms]"
      >
        <div className="mb-4 flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-7 w-24 rounded-md" />
        </div>
        <Skeleton className="h-[240px] w-full rounded-lg" />
      </section>

      <section
        aria-label="Cobranças recentes"
        className="animate-fade-in-up rounded-xl border border-border/60 bg-card opacity-0 fill-mode-[forwards] [animation-delay:450ms]"
      >
        <div className="flex items-center justify-between border-b border-border/60 p-5">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-7 w-20 rounded-md" />
        </div>
        <div className="divide-y divide-border/60">
          {recentRows.map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-4 p-4",
                "transition-colors hover:bg-muted/30"
              )}
            >
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="hidden h-6 w-20 rounded-full sm:block" />
              <Skeleton className="h-5 w-24" />
              <Skeleton className="hidden h-3 w-12 md:block" />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
