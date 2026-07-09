"use server"

import { headers } from "next/headers"

import { auth } from "@/lib/auth/server"
import { getSession } from "@/lib/auth/session"

import { updateNameSchema, type UpdateNameInput } from "./account-schema"

export async function updateName(
  input: UpdateNameInput
): Promise<{ data: { name: string } } | { error: string }> {
  const parsed = updateNameSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" }
  }

  const session = await getSession()

  if (!session) {
    return { error: "Não autorizado" }
  }

  try {
    await auth.api.updateUser({
      body: { name: parsed.data.name },
      headers: await headers(),
    })

    return { data: { name: parsed.data.name } }
  } catch {
    return { error: "Não foi possível atualizar o nome" }
  }
}
