import { OAuthButton } from "@/components/auth/oauth-button"
import { Separator } from "@/components/ui/separator"
import { getSession } from "@/lib/auth/functions"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const session = await getSession()
  if (session) redirect("/dashboard")

  return (
    <div className="flex flex-col gap-6 py-12">
      <div>
        <h1 className="text-2xl font-bold text-balance text-foreground">
          Boas-vindas ao Lumna
        </h1>
        <p className="text-sm text-pretty text-muted-foreground">
          Entre com Google para comecar
        </p>
      </div>

      <OAuthButton className="w-full" variant="outline" />

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">
          ou continue com email
        </span>
        <Separator className="flex-1" />
      </div>

      <div className="rounded-lg border border-border p-3 opacity-50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Email e senha</span>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            Em breve
          </span>
        </div>
      </div>

      <p className="text-center text-xs text-pretty text-muted-foreground">
        Ao continuar, voce concorda com os{" "}
        <a href="#" className="underline">
          Termos de Uso
        </a>{" "}
        e{" "}
        <a href="#" className="underline">
          Politica de Privacidade
        </a>{" "}
        do Lumna.
      </p>
    </div>
  )
}
