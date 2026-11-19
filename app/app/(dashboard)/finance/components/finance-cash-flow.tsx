import { brl } from "@/lib/billing";
import { compact } from "@/lib/finance-rules";

import {
  ChartTooltip,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

type FinanceCashFlowProps = {
  series: {
    date: string;
    received: number;
    spent: number;
  }[];
  hasData: boolean;
};

export function FinanceCashFlow({ series, hasData }: FinanceCashFlowProps) {
  return (
    <section className="min-w-0">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Fluxo de caixa</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Recebimentos e despesas pela data do pagamento
          </p>
        </div>

        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Recebimentos
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-warning" />
            Despesas
          </span>
        </div>
      </div>

      <ChartContainer
        className="mt-6 aspect-auto h-72 w-full"
        config={{
          received: {
            label: "Recebimentos",
            color: "var(--primary)",
          },
          spent: {
            label: "Despesas",
            color: "var(--warning)",
          },
        }}
      >
        <AreaChart
          data={series}
          margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} stroke="var(--border)" />

          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            minTickGap={30}
            tickFormatter={(value: string) =>
              value.length === 7
                ? `${value.slice(5)}/${value.slice(2, 4)}`
                : `${value.slice(8)}/${value.slice(5, 7)}`
            }
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            width={54}
            tickFormatter={compact}
          />

          <ChartTooltip
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  String(value).length === 10
                    ? new Date(`${value}T12:00:00`).toLocaleDateString()
                    : String(value)
                }
                formatter={(value, name) => (
                  <div className="flex w-full justify-between gap-4">
                    <span>
                      {name === "received" ? "Recebimentos" : "Despesas"}
                    </span>
                    <strong>{brl(Number(value))}</strong>
                  </div>
                )}
              />
            }
          />

          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="received"
            stroke="var(--color-received)"
            fill="var(--color-received)"
            fillOpacity={0.12}
            strokeWidth={2}
          />

          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="spent"
            stroke="var(--color-spent)"
            fill="var(--color-spent)"
            fillOpacity={0.08}
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>

      {!hasData && (
        <p className="text-center text-xs text-muted-foreground">
          Nenhum pagamento registrado neste período.
        </p>
      )}
    </section>
  );
}
