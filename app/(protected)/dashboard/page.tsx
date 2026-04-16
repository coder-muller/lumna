import StripeConnectBanner from "@/components/protected/dashboard/stripe-connect-banner"
import MonthlyKPICards from "@/components/protected/dashboard/monthly-kpi-cards"
import RevenueChart from "@/components/protected/dashboard/revenue-chart"
import RecentInvoices from "@/components/protected/dashboard/recent-invoices"

const stripeAccountStatus = "complete" as const

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Olá, Guilherme 👋 Aqui está o resumo do seu mês
        </p>
      </div>

      <StripeConnectBanner status={stripeAccountStatus} />
      <MonthlyKPICards />
      <RevenueChart />
      <RecentInvoices />
    </div>
  )
}
