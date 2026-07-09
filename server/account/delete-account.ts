"use server"

import { headers } from "next/headers"

import { auth } from "@/lib/auth/server"
import { getSession } from "@/lib/auth/session"

import { deleteAccountSchema, type DeleteAccountInput } from "./account-schema"

export async function deleteAccount(
  input: DeleteAccountInput
): Promise<{ data: { success: true } } | { error: string }> {
  const parsed = deleteAccountSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  if (parsed.data.email.toLowerCase() !== session.user.email.toLowerCase()) {
    return { error: "O e-mail informado não corresponde à sua conta" }
  }

  try {
    await auth.api.deleteUser({
      body: {},
      headers: await headers(),
    })

    return { data: { success: true } }
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Não foi possível excluir a conta"

    if (
      message.includes("SESSION_EXPIRED") ||
      message.includes("SESSION_NOT_FRESH") ||
      message.toLowerCase().includes("fresh")
    ) {
      return {
        error: "Sessão expirada. Saia e entre novamente para excluir a conta.",
      }
    }

    return { error: "Não foi possível excluir a conta" }
  }
}
