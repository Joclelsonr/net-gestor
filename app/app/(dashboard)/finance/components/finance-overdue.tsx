import { brl } from "@/lib/billing";
import { formatDate } from "@/lib/br-docs";
import { daysLate } from "@/lib/finance-rules";

import type { Payments } from "@/generated/prisma/client";

type FinanceOverdueProps = {
  payments: Payments[];
  customerCount: number;
  today: Date;
};

export function FinanceOverdue({
  payments,
  customerCount,
  today,
}: FinanceOverdueProps) {
  const allOverdue = payments.filter(
    (p) => p.status === "OVERDUE" && p.dueDate < today,
  );
  const overdueTotal = allOverdue.reduce((sum, p) => sum + Number(p.amount), 0);

  const aging = [
    { label: "1–7 dias", min: 1, max: 7 },
    { label: "8–30 dias", min: 8, max: 30 },
    { label: "31–60 dias", min: 31, max: 60 },
    { label: "Mais de 60 dias", min: 61, max: Infinity },
  ].map((bucket) => ({
    ...bucket,
    total: allOverdue
      .filter((p) => {
        const days = daysLate(p.dueDate, today);
        return days >= bucket.min && days <= bucket.max;
      })
      .reduce((sum, p) => sum + Number(p.amount), 0),
  }));

  return (
    <section className="min-w-0 border-t pt-5 xl:border-t-0 xl:border-l xl:pt-0 xl:pl-7">
      <h2 className="text-lg font-semibold">Carteira em atraso</h2>

      <p className="mt-1 text-xs text-muted-foreground">
        Todos os vencimentos anteriores a {formatDate(today)}
      </p>

      <p className="font-display mt-4 text-3xl font-semibold wrap-break-word text-destructive">
        {brl(overdueTotal)}
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        {customerCount} cliente(s) · {allOverdue.length} cobrança(s)
      </p>

      <div className="mt-5 space-y-4">
        {aging.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between gap-2 text-xs">
              <span>{item.label}</span>
              <span className="font-semibold tabular-nums">
                {brl(item.total)}
              </span>
            </div>

            <div className="relative h-2 overflow-hidden rounded-sm bg-muted">
              <svg width="100%" height="8" className="absolute inset-0">
                <rect
                  width={`${overdueTotal ? (item.total / overdueTotal) * 100 : 0}%`}
                  height="8"
                  fill="var(--destructive)"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
