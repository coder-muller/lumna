import {
  KeyRoundIcon,
  LinkIcon,
  MonitorSmartphoneIcon,
  UserIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/protected/account/profile-form"
import { ChangePasswordForm } from "@/components/protected/account/change-password-form"
import { SessionsSection } from "@/components/protected/account/sessions-section"
import { StripeConnectionSection } from "@/components/protected/account/stripe-connection-section"

const FAKE_USER = {
  name: "Guilherme Müller",
  email: "guilhermemullerxx@gmail.com",
  avatar:
    "https://api.dicebear.com/9.x/thumbs/svg?seed=5d2b4c9a-1f3e-4a7b-8c6d-0e9f2a4b5c8d",
  emailVerified: true,
  id: "usr_4f8a2b1c3d5e6f7a8b9c0d1e2f3a4b5c",
}

const ACCOUNT_TABS = [
  { label: "Perfil", value: "profile", icon: UserIcon },
  { label: "Conexões", value: "connections", icon: LinkIcon },
  { label: "Segurança", value: "security", icon: KeyRoundIcon },
  { label: "Sessões", value: "sessions", icon: MonitorSmartphoneIcon },
] as const

export default function AccountPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-balance">Conta</h1>
        <p className="text-sm text-pretty text-muted-foreground">
          Gerencie seus dados pessoais, a senha da conta e as sessões ativas.
        </p>
      </div>

      <div className="rounded-xl border">
        {/* User header */}
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-16">
              <AvatarImage src={FAKE_USER.avatar} alt={FAKE_USER.name} />
              <AvatarFallback>{FAKE_USER.name[0]}</AvatarFallback>
            </Avatar>

            <div className="flex min-w-0 flex-col gap-1">
              <h2 className="text-base font-medium text-balance">
                {FAKE_USER.name}
              </h2>
              <p className="truncate text-sm text-muted-foreground">
                {FAKE_USER.email}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            {FAKE_USER.emailVerified ? (
              <Badge variant="outline">Email verificado</Badge>
            ) : (
              <Badge variant="destructive">Email não verificado</Badge>
            )}
            <p className="text-xs text-muted-foreground tabular-nums">
              id: {FAKE_USER.id}
            </p>
          </div>
        </div>

        <Separator orientation="horizontal" />

        {/* Tabs */}
        <Tabs
          defaultValue="profile"
          orientation="vertical"
          className="flex flex-col gap-6 p-5 md:flex-row"
        >
          <TabsList
            variant="line"
            className="h-fit w-full shrink-0 flex-row overflow-x-auto md:w-44 md:flex-col md:overflow-visible"
          >
            {ACCOUNT_TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                <tab.icon className="size-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-w-0 flex-1">
            <TabsContent value="profile">
              <ProfileForm
                userName={FAKE_USER.name}
                userImage={FAKE_USER.avatar}
              />
            </TabsContent>

            <TabsContent value="connections">
              <StripeConnectionSection />
            </TabsContent>

            <TabsContent value="security">
              <ChangePasswordForm />
            </TabsContent>

            <TabsContent value="sessions">
              <SessionsSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
