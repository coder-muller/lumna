import { AuthDivider } from "@/components/auth-divider"
import { DecorIcon } from "@/components/ui/decor-icon"
import OAuthButtons from "@/components/auth/oauth-buttons"
import SignUpForm from "@/components/auth/sign-up-form"

export default async function SignUpPage() {
  return (
    <div className="relative flex w-full max-w-xs flex-col justify-between p-6 md:max-w-md md:p-8 dark:bg-[radial-gradient(50%_80%_at_20%_0%,--theme(--color-foreground/.1),transparent)]">
      <div className="absolute -inset-y-6 -left-px w-px bg-border" />
      <div className="absolute -inset-y-6 -right-px w-px bg-border" />
      <div className="absolute -inset-x-6 -top-px h-px bg-border" />
      <div className="absolute -inset-x-6 -bottom-px h-px bg-border" />
      <DecorIcon position="top-left" />
      <DecorIcon position="bottom-right" />
      <div className="w-full max-w-sm animate-in space-y-8">
        <div className="flex flex-col space-y-1">
          <h1 className="text-2xl font-bold tracking-wide">
            Bem vindo ao Lumna!
          </h1>
          <p className="text-base text-muted-foreground">
            Crie sua conta para continuar
          </p>
        </div>
        <div className="space-y-4">
          <SignUpForm />
          <AuthDivider>OU</AuthDivider>
          <OAuthButtons />
        </div>
      </div>
    </div>
  )
}
