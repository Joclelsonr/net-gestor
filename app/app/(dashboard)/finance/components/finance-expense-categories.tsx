import { brl } from "@/lib/billing";
import { inPeriod } from "@/lib/finance-rules";
import { expenseCategories } from "@/constants/finance-status";

import type { Expenses } from "@/generated/prisma/client";

type FinanceExpenseCategoriesProps = {
  expenses: Expenses[];
  totalSpent: number;
  start: Date;
  end: Date;
};

export function FinanceExpenseCategories({
  expenses,
  totalSpent,
  start,
  end,
}: FinanceExpenseCategoriesProps) {
  const items = Object.entries(expenseCategories)
    .map(([key, label]) => ({
      label,
      total: expenses
        .filter(
          (e) =>
            e.category === key &&
            e.status === "PAID" &&
            inPeriod(e.paidDate, start, end),
        )
        .reduce((sum, e) => sum + Number(e.amount), 0),
    }))
    .filter((e) => e.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <section className="min-w-0 lg:border-l lg:pl-7">
      <h2 className="text-lg font-semibold">Despesas por categoria</h2>

      <p className="mt-1 text-xs text-muted-foreground">
        Pagamentos realizados no período
      </p>

      <div className="mt-5 space-y-4">
        {!items.length && (
          <p className="py-8 text-sm text-muted-foreground">
            Nenhuma despesa paga neste período.
          </p>
        )}

        {items.map((item) => (
          <div key={item.label}>
            <div className="mb-2 flex justify-between gap-2 text-sm">
              <span>{item.label}</span>
              <strong className="tabular-nums">{brl(item.total)}</strong>
            </div>

            <div className="relative h-2 overflow-hidden rounded-sm bg-muted">
              <svg width="100%" height="8">
                <rect
                  width={`${totalSpent ? (item.total / totalSpent) * 100 : 0}%`}
                  height="8"
                  fill="var(--warning)"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
