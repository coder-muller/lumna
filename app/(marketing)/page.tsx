import { MarketingHero } from "./_components/marketing-hero"
import { MarketingNav } from "./_components/marketing-nav"

export default function Page() {
  return (
    <div className="relative min-h-svh">
      <MarketingNav />

      <main className="flex min-h-svh items-center justify-center px-6">
        <MarketingHero />
      </main>

      <footer className="absolute inset-x-0 bottom-0 flex h-14 items-center justify-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Lumna
        </p>
      </footer>
    </div>
  )
}
