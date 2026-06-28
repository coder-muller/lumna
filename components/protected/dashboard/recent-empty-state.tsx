"use client"

import Link from "next/link"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileTextIcon, PlusIcon } from "lucide-react"

export function RecentEmptyState() {
  return (
    <section aria-label="Cobranças recentes">
      <Card className="animate-fade-in-up gap-0 border-border/60 py-0 opacity-0 fill-mode-[forwards] [animation-delay:450ms]">
        <CardHeader className="border-b border-border/60 py-5">
          <CardTitle className="text-base">Últimas cobranças</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Empty className="border-0">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileTextIcon />
              </EmptyMedia>
              <EmptyTitle>Nenhuma cobrança ainda</EmptyTitle>
              <EmptyDescription>
                Crie sua primeira cobrança para começar a receber pagamentos
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/invoices">
                  <PlusIcon />
                  Criar primeira cobrança
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>
    </section>
  )
}
