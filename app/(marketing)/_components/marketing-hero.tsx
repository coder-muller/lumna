import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import { LogoIcon } from "@/components/ui/logo-icon"
import { cn } from "@/lib/utils"

export function MarketingHero() {
  return (
    <div className="text-center">
      <div className="animate-in duration-700 fill-mode-both zoom-in-95 fade-in motion-reduce:animate-none">
        <LogoIcon className="mx-auto size-16 text-foreground md:size-20" />
      </div>

      <h1 className="mt-10 animate-in text-5xl font-bold tracking-[-0.02em] delay-200 duration-700 fill-mode-both fade-in slide-in-from-bottom-4 motion-reduce:animate-none md:text-7xl">
        Lumna
      </h1>

      <div className="mx-auto mt-8 h-px w-10 animate-in bg-muted-foreground/30 delay-500 duration-500 fill-mode-both fade-in motion-reduce:animate-none" />

      <p className="mx-auto mt-8 max-w-md animate-in text-lg font-light tracking-wide text-muted-foreground delay-500 duration-700 fill-mode-both fade-in slide-in-from-bottom-3 motion-reduce:animate-none md:text-xl">
        Cobranças por link para quem vende no dia a dia
      </p>

      <div className="mt-10 animate-in delay-700 duration-700 fill-mode-both fade-in slide-in-from-bottom-3 motion-reduce:animate-none">
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group h-12 rounded-full px-8"
          )}
        >
          Começar agora
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
