import { Button } from "@/components/ui/button"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-bold">Lumna</h2>
        <p className="text-sm font-normal text-muted-foreground">
          Um app feito para gerenciar suas cobranças.
          <br className="md:hidden" /> Não adaptado.
        </p>
      </div>
      <Button variant="default" size="lg" className="group mt-4" asChild>
        <Link href="/dashboard">
          Acessar dashboard
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  )
}
