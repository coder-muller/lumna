"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { deleteCredentials } from "@/server/abacatepay-credentials/delete-credentials"
import { getCredentials } from "@/server/abacatepay-credentials/get-credentials"
import { saveCredentials } from "@/server/abacatepay-credentials/save-credentials"
import type { SaveCredentialsInput } from "@/server/abacatepay-credentials/credentials-schema"

export const abacatepayCredentialsKeys = {
  all: ["abacatepay-credentials"] as const,
}

export function useAbacatepayCredentials({
  enabled = true,
}: {
  enabled?: boolean
} = {}) {
  return useQuery({
    queryKey: abacatepayCredentialsKeys.all,
    enabled,
    queryFn: async () => {
      const response = await getCredentials()

      if ("error" in response) {
        throw new Error(response.error)
      }

      return response.data
    },
  })
}

export function useSaveAbacatepayCredentials() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (input: SaveCredentialsInput) => {
      const response = await saveCredentials(input)

      if ("error" in response) {
        throw new Error(response.error)
      }

      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: abacatepayCredentialsKeys.all,
      })
      router.refresh()
    },
  })
}

export function useDeleteAbacatepayCredentials() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      const response = await deleteCredentials()

      if ("error" in response) {
        throw new Error(response.error)
      }

      return response.data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: abacatepayCredentialsKeys.all,
      })
      router.refresh()
    },
  })
}
