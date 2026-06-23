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
      "Os pagamentos são processados pela Stripe Checkout, aceitando cartão de crédito, débito, Pix e outros métodos habilitados pela Stripe. O Lumna não processa cartões diretamente.",
  },
  {
    question: "Existe taxa mensal ou limite de cobranças?",
    answer:
      "Não há taxa mensal, taxa de adesão ou limite de cobranças. O Lumna cobra uma taxa de plataforma de 0,99% por transação. Além disso, aplicam-se as taxas de processamento da Stripe (3,99% + R$ 0,50 para cartões nacionais).",
  },
  {
    question: "Como funcionam as taxas para cartões internacionais?",
    answer:
      "Para pagamentos com cartão internacional, a Stripe cobra um adicional de 2% sobre a transação, além da taxa padrão.",
  },
  {
    question: "Como funciona o deferred onboarding?",
    answer:
      "Com o onboarding diferido da Stripe, você pode criar cobranças e receber pagamentos antes de completar toda a verificação de identidade. Os valores ficam retidos temporariamente até que a conta seja verificada.",
  },
  {
    question: "O Lumna armazena dados de cartão?",
    answer:
      "Não. Todo o processamento de pagamentos, checkout e armazenamento de dados sensíveis é feito pela Stripe. O Lumna atua apenas como uma camada de gestão e organização das cobranças.",
  },
  {
    question: "Posso enviar o link de pagamento por email?",
    answer:
      "Sim. Se o cliente tiver um email cadastrado, você pode enviar o link diretamente por email. Também é possível copiar o link e compartilhar por WhatsApp, SMS ou qualquer outro canal.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:gap-24">
          <div className="md:w-1/3">
            <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Perguntas <br className="hidden md:block" />
              <span className="text-muted-foreground">frequentes.</span>
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              Tudo o que você precisa saber sobre a Lumna. Se tiver outras
              dúvidas, entre em contato.
            </p>
          </div>

          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rounded-2xl border border-border/50 bg-card/30 px-6 py-2 transition-colors data-[state=open]:bg-card/80"
                >
                  <AccordionTrigger className="text-left text-base font-medium hover:no-underline [&[data-state=open]>svg]:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
