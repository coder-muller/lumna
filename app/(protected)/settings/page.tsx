import AccountTab from "@/components/protected/settings/account/account-tab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireSession } from "@/lib/auth/session"
import { User } from "better-auth"
import { CreditCardIcon, UserIcon } from "lucide-react"

const tabs = (user: User) => [
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
    content: <div>Stripe</div>,
  },
]

export default async function SettingsPage() {
  const session = await requireSession()

  const user = session.user

  return (
    <Tabs defaultValue={tabs(user)[0].value} className="space-y-4">
      <TabsList className="w-full">
        {tabs(user).map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            <tab.icon />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs(user).map((tab) => (
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
