const KPI_CARDS = [
  {
    label: "Faturado em",
    value: "R$ 12.345,75",
    detail: "8 cobranças emitidas",
  },
  {
    label: "Recebido",
    value: "R$ 8.267,30",
    detail: "5 cobranças pagas",
  },
  {
    label: "Em aberto",
    value: "R$ 4.078,45",
    detail: "3 cobranças pendentes",
  },
]

export default function MonthlyKPICards() {
  const currentMonth = new Date().toLocaleString("pt-BR", {
    month: "long",
  })

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {KPI_CARDS.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-card p-6 shadow-sm"
        >
          <p className="text-xs tracking-wide text-muted-foreground uppercase">
            {card.label === "Faturado em"
              ? `${card.label} ${currentMonth}`
              : card.label}
          </p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">
            {card.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
        </div>
      ))}
    </div>
  )
}
