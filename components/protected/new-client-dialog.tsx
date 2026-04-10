"use client"

import { useState } from "react"
import { Plus, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createClientAction } from "@/lib/billing/actions"

export function NewClientDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus data-icon="inline-start" />
          Novo cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo cliente</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await createClientAction(formData)
            setOpen(false)
          }}
        >
          <FieldGroup className="mt-4">
            <Field>
              <FieldLabel htmlFor="nc-name">Nome completo</FieldLabel>
              <Input
                id="nc-name"
                name="name"
                placeholder="Ex: Maria Santos"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="nc-email">Email</FieldLabel>
              <Input
                id="nc-email"
                name="email"
                type="email"
                placeholder="Ex: maria@email.com"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="nc-phone">Telefone</FieldLabel>
              <Input id="nc-phone" name="phone" placeholder="(11) 99999-0000" />
            </Field>
            <Field>
              <FieldLabel htmlFor="nc-notes">Observações</FieldLabel>
              <Textarea
                id="nc-notes"
                name="notes"
                rows={3}
                placeholder="Notas internas sobre o cliente"
              />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                <UserPlus data-icon="inline-start" />
                Salvar cliente
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}
