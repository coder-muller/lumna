"use client"

import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { deleteAccount } from "@/server/account/delete-account"
import { updateName } from "@/server/account/update-name"
import type {
  DeleteAccountInput,
  UpdateNameInput,
} from "@/server/account/account-schema"

export function useUpdateName() {
  const router = useRouter()

  return useMutation({
    mutationFn: async (input: UpdateNameInput) => {
      const response = await updateName(input)

      if ("error" in response) {
        throw new Error(response.error)
      }

      return response.data
    },
    onSuccess: async () => {
      router.refresh()
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (input: DeleteAccountInput) => {
      const response = await deleteAccount(input)

      if ("error" in response) {
        throw new Error(response.error)
      }

      return response.data
    },
    onSuccess: async () => {
      queryClient.clear()
      router.replace("/sign-in")
    },
  })
}
