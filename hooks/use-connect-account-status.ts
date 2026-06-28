"use client"

import { useQuery } from "@tanstack/react-query"

import { getConnectAccountStatus } from "@/server/stripe/get-connect-account-status"
import type { ConnectAccountStatus } from "@/server/stripe/get-connect-account-status"

const getConnectAccountStatusAction =
  async (): Promise<ConnectAccountStatus> => {
    const response = await getConnectAccountStatus()

    if ("error" in response) {
      throw new Error(response.error)
    }

    return response
  }

export const useConnectAccountStatus = () => {
  const {
    data: connectAccount,
    isLoading: isLoadingConnectAccount,
    isFetching: isFetchingConnectAccount,
    error: errorConnectAccount,
    refetch: refetchConnectAccount,
  } = useQuery({
    queryKey: ["stripe-connect-account"],
    queryFn: getConnectAccountStatusAction,
  })

  return {
    connectAccount,
    isLoadingConnectAccount,
    isFetchingConnectAccount,
    errorConnectAccount,
    refetchConnectAccount,
  }
}
