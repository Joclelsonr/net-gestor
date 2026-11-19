import Link from "next/link";

import { Ban, Check, Wallet } from "lucide-react";

import { brl } from "@/lib/billing";
import { daysLate } from "@/lib/finance-rules";
import { formatDate } from "@/lib/br-docs";
import { paymentState } from "@/lib/payment-rules";
import { paymentMethods } from "@/constants/finance-status";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Customer, Expenses, Payments } from "@/generated/prisma/client";

export type FinanceEntry =
  | (Payments & { categoryLabel: string })
  | (Expenses & { customerId: null; categoryLabel: string });

type FinanceEntryTableProps = {
  entries: FinanceEntry[];
  customers: Customer[];
  isExpense: boolean;
};

export function FinanceEntryTable({
  entries,
  customers,
  isExpense,
}: FinanceEntryTableProps) {
  const today = new Date();

  function onPay(entry: FinanceEntry) {
    console.log("pagar", entry);
  }

  function onReceive(entry: FinanceEntry) {
    console.log("receber", entry);
  }

  function onCancel(entry: FinanceEntry) {
    console.log("cancelar", entry);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-185 text-left text-sm">
          <thead className="border-y bg-muted/50 text-xs text-muted-foreground">
            <tr>
              {[
                isExpense ? "Despesa / Categoria" : "Cliente / Cobrança",
                "Vencimento",
                "Valor",
                "Situação",
                "Pagamento",
                "",
              ].map((heading, index) => (
                <th key={index} className="px-4 py-3 font-medium">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/40">
                <td className="max-w-72 px-4 py-4">
                  {entry.customerId ? (
                    <Link
                      href={`/customer/${entry.customerId}`}
                      className="block truncate font-semibold text-primary"
                    >
                      {
                        customers.find(
                          (customer) => customer.id === entry.customerId,
                        )?.name
                      }
                    </Link>
                  ) : (
                    <p className="truncate font-semibold">
                      {entry.description}
                    </p>
                  )}

                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {isExpense ? entry.categoryLabel : entry.description}
                  </p>
                </td>

                <td className="px-4 py-4 whitespace-nowrap">
                  {formatDate(entry.dueDate)}

                  {entry.status === "WAITING" && entry.dueDate < today && (
                    <p className="mt-1 text-xs text-destructive">
                      {daysLate(entry.dueDate, today)} dias de atraso
                    </p>
                  )}
                </td>

                <td className="px-4 py-4 font-semibold whitespace-nowrap tabular-nums">
                  {brl(entry.amount)}
                </td>

                <td className="px-4 py-4">
                  <Badge variant="outline">{paymentState(entry, today)}</Badge>
                </td>

                <td className="px-4 py-4 text-xs whitespace-nowrap text-muted-foreground">
                  {entry.paidDate ? (
                    <>
                      {formatDate(entry.paidDate)}

                      <p className="mt-1">
                        {paymentMethods[
                          entry.paymentMethod as keyof typeof paymentMethods
                        ] || "Não informado"}
                      </p>
                    </>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-4 py-4">
                  {entry.status === "WAITING" ||
                    (entry.status === "ONTIME" && (
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            isExpense ? onPay(entry) : onReceive(entry)
                          }
                        >
                          <Check />
                          {isExpense ? "Pagar" : "Receber"}
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Cancelar ${entry.description}`}
                          title="Cancelar lançamento"
                          onClick={() => onCancel(entry)}
                        >
                          <Ban />
                        </Button>
                      </div>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!entries.length && (
        <div className="py-14 text-center">
          <Wallet className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Nenhum lançamento encontrado neste período.
          </p>
        </div>
      )}
    </>
  );
}
