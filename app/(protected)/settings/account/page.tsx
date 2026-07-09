import { AccountSettings } from "@/components/protected/settings/account-settings"
import { requireSession } from "@/lib/auth/session"

export default async function AccountSettingsPage() {
  const { user } = await requireSession()

  return (
    <AccountSettings
      user={{ name: user.name, email: user.email, image: user.image }}
    />
  )
}
