import { Separator } from "@/components/ui/separator"
import { User } from "better-auth"
import { UserInfoForm } from "./user-info-form"
import { DeleteAccountButton } from "./delete-account-button"

interface AccountTabProps {
  user: User
}

export default function AccountTab({ user }: AccountTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Conta</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas configurações de conta e preferências.
        </p>
      </div>

      <Separator orientation="horizontal" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <h2 className="font-medium">Informações do Usuário</h2>
          <p className="text-sm text-muted-foreground">
            Atualize suas informações de perfil.
          </p>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <UserInfoForm userName={user.name} userEmail={user.email} />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <h2 className="font-medium">Deletar Conta</h2>
          <p className="text-sm text-muted-foreground">
            Apague sua conta permanentemente.
          </p>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  )
}
