import { brl } from "@/lib/billing";
import { financeSummary, monthRange } from "@/lib/finance-rules";

import { AlertCircle, ArrowDownLeft, ArrowUpRight, Wallet } from "lucide-react";

import type {
  Expenses,
  Payments,
  Subscriptions,
} from "@/generated/prisma/client";

type FinanceSummaryData = ReturnType<typeof financeSummary>;

type FinanceSummaryProps = {
  payments: Payments[];
  expenses: Expenses[];
  summary: FinanceSummaryData;
  subscriptions: Subscriptions[];
  today: Date;
};

export function FinanceSummary({
  payments,
  expenses,
  summary,
  subscriptions,
  today,
}: FinanceSummaryProps) {
  const lastMonthDate = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1),
  );
  const prior = monthRange(lastMonthDate);
  const previous = financeSummary(
    payments,
    expenses,
    prior.start,
    prior.end,
    today,
  );

  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "ACTIVE" && s.startDate <= today,
  );

  const recurring = activeSubscriptions.reduce(
    (sum, s) => sum + Number(s.price),
    0,
  );

  const variation = previous.received
    ? ((summary.received - previous.received) / previous.received) * 100
    : null;

  const additionalInfo = [
    ["Faturado por vencimento", brl(summary.billed)],
    ["A receber no período", brl(summary.receivable)],
    ["Receita mensal contratada", brl(recurring)],
    ["Contratos ativos", String(activeSubscriptions.length)],
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="min-w-0 border-l-4 border-success bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Recebido no período
            <ArrowDownLeft className="text-success" />
          </div>

          <p
            className="font-display mt-3 text-2xl font-semibold wrap-break-word tabular-nums"
            data-testid="finance-received"
          >
            {brl(summary.received)}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            {variation === null
              ? "Sem recebimentos no período anterior"
              : `${variation >= 0 ? "+" : ""}${variation.toFixed(1).replace(".", ",")}% vs. período anterior`}
          </p>
        </div>

        <div className="min-w-0 border-l-4 border-warning bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Despesas pagas
            <ArrowUpRight className="text-warning" />
          </div>

          <p
            className="font-display mt-3 text-2xl font-semibold wrap-break-word tabular-nums"
            data-testid="finance-spent"
          >
            {brl(summary.spent)}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            {brl(summary.payable)} a pagar no período
          </p>
        </div>

        <div className="bg-panel text-panel-foreground min-w-0 border-l-4 border-primary p-5">
          <div className="flex items-center justify-between text-sm">
            Saldo do período
            <Wallet className="text-signal" />
          </div>

          <p
            className="font-display mt-3 text-2xl font-semibold wrap-break-word tabular-nums"
            data-testid="finance-net"
          >
            {brl(summary.net)}
          </p>

          <p className="mt-2 text-xs opacity-75">
            Recebimentos − despesas pagas
          </p>
        </div>

        <div className="min-w-0 border-l-4 border-destructive bg-card p-5">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            Em atraso no período
            <AlertCircle className="text-destructive" />
          </div>

          <p className="font-display mt-3 text-2xl font-semibold wrap-break-word tabular-nums">
            {brl(summary.overdue)}
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            {summary.overdueCount} cobrança(s) ·{" "}
            {summary.delinquency.toFixed(1).replace(".", ",")}% do faturado
          </p>
        </div>
      </div>

      <dl className="my-6 grid grid-cols-2 gap-y-4 border-y py-5 lg:grid-cols-4">
        {additionalInfo.map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 px-3 lg:border-r lg:last:border-0"
          >
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="font-display mt-1 text-lg font-semibold wrap-break-word tabular-nums">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
