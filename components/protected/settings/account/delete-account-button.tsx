"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AlertTriangleIcon } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/lib/auth/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function DeleteAccountButton() {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (isDeleting) return

    setIsDeleting(true)
    await authClient.deleteUser(
      {
        callbackURL: "/sign-in",
      },
      {
        onSuccess: () => {
          toast.success("Sua conta foi deletada com sucesso!")
          router.push("/sign-in")
          router.refresh()
        },
        onError: () => {
          toast.error("Falha ao deletar conta", {
            description:
              "Tente novamente mais tarde. Se o problema persistir, contate o suporte.",
          })
          setIsDeleting(false)
        },
      }
    )
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="lg" className="w-full">
          Deletar Conta
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Conta</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Alert variant="destructive">
          <AlertTriangleIcon />
          <AlertTitle>Esta ação é irreversível</AlertTitle>
          <AlertDescription>
            Todos os dados relacionados à sua conta serão permanentemente
            removidos.
          </AlertDescription>
        </Alert>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={handleDelete}
          >
            {isDeleting ? <Spinner /> : null}
            {isDeleting ? "Deletando..." : "Tenho certeza, deletar minha conta"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
