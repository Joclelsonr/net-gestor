import { inPeriod } from "@/lib/finance-rules";
import { expenseCategories } from "@/constants/finance-status";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { FinanceSelect } from "./finance-select";
import { FinanceEntryTable } from "./finance-entry-table";
import { FinancePagination } from "./finance-pagination";

import type { Payments, Expenses, Customer } from "@/generated/prisma/client";

type FinanceEntriesProps = {
  payments: Payments[];
  customers: Customer[];
  expenses: Expenses[];
  isExpense: boolean;
  search: string;
  status: string;
  page: number;
  start: Date;
  end: Date;
  today: Date;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPageChange: (page: number) => void;
};

export function FinanceEntries({
  payments,
  customers,
  expenses,
  isExpense,
  search,
  status,
  page,
  start,
  end,
  today,
  onSearchChange,
  onStatusChange,
  onPageChange,
}: FinanceEntriesProps) {
  const customerMap = new Map(
    customers.map((customer) => [customer.id, customer]),
  );

  const entries = isExpense
    ? expenses.map((e) => ({
        ...e,
        customerId: null,
        categoryLabel:
          expenseCategories[e.category as keyof typeof expenseCategories],
      }))
    : payments.map((p) => ({ ...p, categoryLabel: "Cobrança" }));

  const filtered = entries
    .filter(
      (r) =>
        inPeriod(r.dueDate, start, end) &&
        (status === "todos" ||
          (status === "ONTIME"
            ? r.status === "OVERDUE" && r.dueDate < today
            : r.status === status)) &&
        `${r.description} ${r.customerId ? customerMap.get(r.customerId)?.name : r.categoryLabel}`
          .toLowerCase()
          .includes(search.toLowerCase()),
    )
    .sort(
      (a, b) =>
        a.dueDate.getTime() - b.dueDate.getTime() || a.id.localeCompare(b.id),
    );

  const pages = Math.max(1, Math.ceil(filtered.length / 15));
  const currentPage = Math.min(page, pages);

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-0 flex-1 basis-64">
          <Search className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            aria-label="Buscar lançamento"
            placeholder="Buscar lançamento..."
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>

        <div className="w-52">
          <FinanceSelect
            label="Filtrar situação financeira"
            value={status}
            onChange={onStatusChange}
            options={[
              { value: "todos", label: "Todas as situações" },
              { value: "ONTIME", label: "Em dia" },
              { value: "OVERDUE", label: "Em atraso" },
              { value: "PAID", label: "Pagos" },
              { value: "WAITING", label: "Aguardando" },
              { value: "CANCELED", label: "Cancelados" },
            ]}
          />
        </div>
      </div>

      <p className="my-4 text-xs text-muted-foreground">
        {filtered.length} lançamento(s) · vencimentos de{" "}
        {start.toLocaleDateString("pt-BR")} a {end.toLocaleDateString("pt-BR")}
      </p>

      <FinanceEntryTable
        entries={entries}
        customers={customers}
        isExpense={isExpense}
      />

      <FinancePagination
        pages={pages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </section>
  );
}
