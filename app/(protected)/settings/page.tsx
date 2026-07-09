import { AbacatepaySettings } from "@/components/protected/settings/abacatepay-settings"

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">
          Preferências da conta e integrações de pagamento.
        </p>
      </div>

      <AbacatepaySettings />
    </div>
  )
}
