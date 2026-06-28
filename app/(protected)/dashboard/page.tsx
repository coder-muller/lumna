"use client"

import Link from "next/link"
import { Plus } from "lucide-react"

import { DashboardErrorState } from "@/components/protected/dashboard/error-state"
import { DashboardLoadingState } from "@/components/protected/dashboard/loading-state"
import { RecentEmptyState } from "@/components/protected/dashboard/recent-empty-state"
import { RecentInvoices } from "@/components/protected/dashboard/recent-invoices"
import { RevenueChart } from "@/components/protected/dashboard/revenue-chart"
import { StatCards } from "@/components/protected/dashboard/stat-cards"
import { Button } from "@/components/ui/button"
import { useDashboard } from "@/hooks/use-dashboard"
import { authClient } from "@/lib/auth/client"

export default function DashboardPage() {
  const { data: session } = authClient.useSession()
  const {
    stats,
    revenueChart,
    recentInvoices,
    isLoadingDashboard,
    isFetchingDashboard,
    errorDashboard,
    refetchDashboard,
    hasRecentInvoices,
  } = useDashboard()

  const firstName = session?.user?.name?.split(" ")[0] ?? ""

  const content = (() => {
    if (isLoadingDashboard) {
      return <DashboardLoadingState />
    }

    if (errorDashboard) {
      return <DashboardErrorState onRetry={() => refetchDashboard()} />
    }

    if (!stats) {
      return <DashboardErrorState onRetry={() => refetchDashboard()} />
    }

    return (
      <>
        <StatCards stats={stats} isFetching={isFetchingDashboard} />
        <RevenueChart data={revenueChart} isFetching={isFetchingDashboard} />
        {hasRecentInvoices ? (
          <RecentInvoices
            invoices={recentInvoices}
            isFetching={isFetchingDashboard}
          />
        ) : (
          <RecentEmptyState />
        )}
      </>
    )
  })()

  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Dashboard
          </h1>
          {firstName ? (
            <p className="text-sm text-muted-foreground">
              Bem-vindo de volta, {firstName}.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Bem-vindo de volta.</p>
          )}
        </div>
        <Button size="lg" className="gap-2" asChild>
          <Link href="/invoices">
            <Plus className="size-4" />
            Nova cobrança
          </Link>
        </Button>
      </div>

      {content}
    </>
  )
}
