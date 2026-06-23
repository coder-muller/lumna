import Link from "next/link"
import { LumnaLogo } from "./logo"
import { Separator } from "@/components/ui/separator"

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
    <footer className="border-t border-border/50 bg-muted/30 py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <LumnaLogo className="size-6 text-primary" />
              <span className="font-heading text-lg font-semibold tracking-tight">
                Lumna
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Plataforma simples de cobranças por link para pequenos negócios,
              freelancers e prestadores de serviço.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                {category}
              </p>
              <ul className="mt-3 space-y-2">
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

        <Separator className="my-8 bg-border/60" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Lumna. Todos os direitos reservados.
          </p>
          <p>
            Pagamentos processados por{" "}
            <span className="font-medium text-foreground">Stripe</span>.
          </p>
        </div>
      </div>
    </footer>
  )
}
