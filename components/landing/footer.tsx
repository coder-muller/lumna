import Link from "next/link"
import { LumnaLogo } from "./logo"

const footerLinks = {
  Produto: [
    { label: "Funcionalidades", href: "#funcionalidades" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "Preço", href: "#preco" },
    { label: "FAQ", href: "#faq" },
  ],
  Conta: [
    { label: "Entrar", href: "/login" },
    { label: "Criar conta", href: "/register" },
  ],
  Legal: [
    { label: "Termos de uso", href: "#" },
    { label: "Privacidade", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="group flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                <LumnaLogo className="size-4 text-primary" />
              </div>
              <span className="font-heading text-lg font-medium tracking-tight">
                Lumna
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Plataforma simples de cobranças por link para pequenos negócios e
              freelancers.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="mb-4 text-sm font-medium text-foreground">
                {category}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Lumna. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Processado com segurança por</span>
            <span className="font-medium text-foreground">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
