"use client"

import * as React from "react"
import { toast } from "sonner"

import { ApiKeyForm } from "@/components/protected/abacatepay/api-key-form"
import {
  useAbacatepayCredentials,
  useDeleteAbacatepayCredentials,
} from "@/hooks/use-abacatepay-credentials"
import { formatMaskedKey } from "@/lib/abacatepay/key-format"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

export function AbacatepaySettings() {
  const {
    data: credentials,
    isLoading,
    isError,
    error,
  } = useAbacatepayCredentials()
  const deleteCredentials = useDeleteAbacatepayCredentials()
  const [isEditing, setIsEditing] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-full max-w-md" />
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-sm text-destructive">
        {error instanceof Error
          ? error.message
          : "Não foi possível carregar a chave"}
      </p>
    )
  }

  if (!credentials) {
    return null
  }

  const maskedKey = formatMaskedKey(credentials.keyPrefix, credentials.keyHint)

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">AbacatePay</h2>
        <p className="text-sm text-muted-foreground">
          Gerencie a chave de API usada para criar cobranças e clientes.
        </p>
      </div>

      {isEditing ? (
        <div className="max-w-md">
          <ApiKeyForm
            autoFocus
            submitLabel="Atualizar chave"
            onSuccess={() => setIsEditing(false)}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Chave conectada</p>
            <p className="font-mono text-sm text-muted-foreground">
              {maskedKey}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              Alterar
            </Button>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
              <AlertDialogTrigger
                render={<Button type="button" variant="destructive" />}
              >
                Excluir
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Excluir chave da AbacatePay?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Você voltará ao onboarding e precisará cadastrar uma nova
                    chave para continuar usando o app.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={deleteCredentials.isPending}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    disabled={deleteCredentials.isPending}
                    onClick={(event) => {
                      event.preventDefault()
                      deleteCredentials.mutate(undefined, {
                        onSuccess: () => {
                          setIsDeleteOpen(false)
                          toast.success("Chave removida")
                        },
                        onError: (err) => toast.error(err.message),
                      })
                    }}
                  >
                    {deleteCredentials.isPending ? (
                      <>
                        <Spinner data-icon="inline-start" />
                        Excluindo...
                      </>
                    ) : (
                      "Excluir chave"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </section>
  )
}
