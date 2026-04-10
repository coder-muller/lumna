import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh">
      {/* Left column — form area */}
      <div className="flex flex-1 flex-col justify-center px-8 md:px-12">
        <div className="mx-auto w-full max-w-md">
          <header className="mb-2 flex items-center justify-between">
            <Logo />
            <ThemeToggle />
          </header>
          {children}
        </div>
      </div>

      {/* Right column — branding panel (hidden on mobile) */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-lumna-ultralight p-12 lg:flex dark:bg-lumna-light/20">
        <div className="flex flex-col gap-4">
          {[
            "Pagamento direto na sua conta",
            "Link de pagamento em 2 minutos",
            "Sem mensalidade",
          ].map((text, i) => (
            <div
              key={i}
              className="animate-slide-up flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
              style={{
                animationDelay: `${i * 150}ms`,
                animationFillMode: "both",
              }}
            >
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-success-light">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-success"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-sm font-medium text-foreground">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
