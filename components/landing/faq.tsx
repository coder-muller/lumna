import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Preciso ter uma conta na Stripe para usar o Lumna?",
    answer:
      "Não. O Lumna cria automaticamente uma conta conectada Stripe Express quando você se cadastra. Você pode começar a usar imediatamente e completar a verificação da Stripe quando for necessário para liberar os repasses.",
  },
  {
    question: "Quais métodos de pagamento são aceitos?",
    answer:
      "Os pagamentos são processados pela Stripe Checkout, então aceitamos cartão de crédito e débito, além de outros métodos habilitados pela Stripe de acordo com a região. O Lumna não processa cartões diretamente.",
  },
  {
    question: "Existe taxa mensal ou limite de cobranças?",
    answer:
      "Não há taxa mensal, taxa de adesão ou limite de cobranças. Você paga apenas 0,99% sobre o valor de cada transação concluída com sucesso.",
  },
  {
    question: "Como funciona o deferred onboarding?",
    answer:
      "Com o onboarding diferido da Stripe, você pode criar cobranças e receber pagamentos antes de completar toda a verificação de identidade. Os valores podem ficar retidos temporariamente até que a conta seja verificada.",
  },
  {
    question: "O Lumna armazena dados de cartão?",
    answer:
      "Não. Todo o processamento de pagamentos, checkout e armazenamento de dados sensíveis é feito pela Stripe. O Lumna atua apenas como uma camada de gestão e organização das cobranças.",
  },
  {
    question: "Posso enviar o link de pagamento por email?",
    answer:
      "Sim. Se o cliente tiver um email cadastrado, você pode enviar o link de pagamento diretamente por email. Também é possível copiar o link e compartilhar por WhatsApp, SMS ou qualquer outro canal.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="border-t border-border/50 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium text-primary">Dúvidas</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
