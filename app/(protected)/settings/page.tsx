import AccountTab from "@/components/protected/settings/account/account-tab"
import StripeTab from "@/components/protected/settings/stripe/stripe-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireSession } from "@/lib/auth/session"
import { getConnectAccountStatus } from "@/server/stripe/get-connect-account-status"
import type { ConnectAccountStatus } from "@/server/stripe/get-connect-account-status"
import { User } from "better-auth"
import { CreditCardIcon, UserIcon } from "lucide-react"

const tabs = (user: User, connectAccount: ConnectAccountStatus) => [
  {
    value: "account",
    label: "Conta",
    icon: UserIcon,
    content: <AccountTab user={user} />,
  },
  {
    value: "stripe",
    label: "Stripe",
    icon: CreditCardIcon,
    content: <StripeTab account={connectAccount} />,
  },
]

export default async function SettingsPage() {
  const session = await requireSession()
  const connectAccount = await getConnectAccountStatus()

  const user = session.user
  const resolvedConnectAccount =
    "error" in connectAccount
      ? {
          status: "DEFERRED" as const,
          chargesEnabled: false,
          payoutsEnabled: false,
        }
      : connectAccount
  const settingsTabs = tabs(user, resolvedConnectAccount)

  return (
    <Tabs defaultValue={settingsTabs[0].value} className="space-y-4">
      <TabsList className="w-full">
        {settingsTabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            <tab.icon />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {settingsTabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mx-auto w-full max-w-7xl"
        >
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
