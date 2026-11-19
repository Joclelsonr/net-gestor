import { brl } from "@/lib/billing";
import { TrendingUp } from "lucide-react";
import { inPeriod } from "@/lib/finance-rules";
import { paymentMethods } from "@/constants/finance-status";

import type { Payments } from "@/generated/prisma/client";

type FinancePaymentMethodsProps = {
  payments: Payments[];
  start: Date;
  end: Date;
};

export function FinancePaymentMethods({
  payments,
  start,
  end,
}: FinancePaymentMethodsProps) {
  const items: { label: string; total: number }[] = Object.entries(
    paymentMethods,
  ).map(([key, label]) => ({
    label,
    total: payments
      .filter(
        (p) =>
          p.status === "PAID" &&
          p.paymentMethod === key &&
          inPeriod(p.paidDate, start, end),
      )
      .reduce((sum, p) => sum + Number(p.amount), 0),
  }));

  return (
    <section className="border-t pt-7">
      <div className="flex items-center gap-2">
        <TrendingUp className="text-primary" />
        <h2 className="text-lg font-semibold">
          Recebimentos por forma de pagamento
        </h2>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 border-l-2 pl-3">
            <dt className="text-xs text-muted-foreground">{item.label}</dt>

            <dd className="mt-1 font-semibold wrap-break-word tabular-nums">
              {brl(item.total)}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
