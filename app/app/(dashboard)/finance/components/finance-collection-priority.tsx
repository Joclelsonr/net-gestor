import Link from "next/link";

import { brl } from "@/lib/billing";
import { daysLate } from "@/lib/finance-rules";

type FinanceCollectionPriorityProps = {
  items: [
    string,
    {
      total: number;
      count: number;
      oldest: string;
    },
  ][];
  today: Date;
};

export function FinanceCollectionPriority({
  items,
  today,
}: FinanceCollectionPriorityProps) {
  return (
    <section className="min-w-0">
      <h2 className="text-lg font-semibold">Prioridade de cobrança</h2>

      <p className="mt-1 text-xs text-muted-foreground">
        Maiores saldos em atraso · todos os períodos
      </p>

      <div className="mt-4 divide-y">
        {!items.length && (
          <p className="py-8 text-sm text-muted-foreground">
            Nenhum cliente com cobrança em atraso.
          </p>
        )}

        {items.map(([id, debt], index) => (
          <div key={id} className="flex items-center gap-3 py-4">
            <span className="w-6 font-mono text-xs text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0 flex-1">
              <Link
                href={`/customer/${id}`}
                className="block truncate text-sm font-semibold text-primary"
              >
                {/* {item.customerName} */}
              </Link>

              <p className="mt-1 text-xs text-muted-foreground">
                {debt.count} cobrança(s) · até{" "}
                {daysLate(new Date(debt.oldest), today)} dias de atraso
              </p>
            </div>

            <span className="shrink-0 text-sm font-semibold tabular-nums">
              {brl(debt.total)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
