import { OAuthButton } from "@/components/auth/oauth-button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FieldGroup, FieldSeparator } from "@/components/ui/field"
import { getSession } from "@/lib/auth/functions"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  // Check if user is already logged in
  const session = await getSession()
  if (session) redirect("/dashboard")

  return (
    <div className="w-full max-w-xs space-y-4 md:max-w-sm">
      <div>
        <h1 className="text-xl font-bold">Bem-vindo ao Lumna</h1>
        <p className="text-sm text-muted-foreground">
          Faça login para continuar
        </p>
      </div>
      <div className="space-y-4">
        <FieldGroup>
          <Alert>
            <AlertTitle>Email e senha ainda não implementado</AlertTitle>
            <AlertDescription>
              Estamos trabalhando para adicionar este recurso em breve.
            </AlertDescription>
          </Alert>
          <FieldSeparator>ou</FieldSeparator>
          <OAuthButton className="w-full" />
        </FieldGroup>
      </div>
    </div>
  )
}
