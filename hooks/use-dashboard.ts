"use client"

import { useQuery } from "@tanstack/react-query"

import { getDashboard } from "@/server/dashboard/get-dashboard"
import type { DashboardData } from "@/server/dashboard/get-dashboard"

const getDashboardAction = async (): Promise<DashboardData> => {
  const response = await getDashboard()

  if ("error" in response) {
    throw new Error(response.error)
  }

  return response
}

export const useDashboard = () => {
  const {
    data,
    isLoading: isLoadingDashboard,
    isFetching: isFetchingDashboard,
    error: errorDashboard,
    refetch: refetchDashboard,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardAction,
  })

  const hasRecentInvoices = (data?.recentInvoices.length ?? 0) > 0
  const isEmptyDashboard = (data?.stats.totalCount ?? 0) === 0

  return {
    stats: data?.stats,
    revenueChart: data?.revenueChart ?? [],
    recentInvoices: data?.recentInvoices ?? [],
    isLoadingDashboard,
    isFetchingDashboard,
    errorDashboard,
    refetchDashboard,
    hasRecentInvoices,
    isEmptyDashboard,
  }
}
