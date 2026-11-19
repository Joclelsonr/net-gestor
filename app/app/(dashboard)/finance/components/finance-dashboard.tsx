"use client";

import { useState, use } from "react";
import { useFinanceFilters } from "@/hooks/use-finance-filters";
import { cashSeries, financeSummary } from "@/lib/finance-rules";

import { FinanceTabs } from "./finance-tabs";
import { FinanceHeader } from "./finance-header";
import { FinanceSummary } from "./finance-summary";
import { FinanceEntries } from "./finance-entries";
import { FinanceOverdue } from "./finance-overdue";
import { FinanceOverview } from "./finance-overview";
import { FinanceCashFlow } from "./finance-cash-flow";
import { FinanceEntryDialog } from "./finance-entry-dialog";
import { FinancePeriodFilter } from "./finance-period-filter";
import { FinanceCancelDialog } from "./finance-cancel-dialog";
import { FinancePaymentMethods } from "./finance-payment-methods";
import { FinanceExpenseCategories } from "./finance-expense-categories";
import { FinanceCollectionPriority } from "./finance-collection-priority";

import type {
  Customer,
  Expenses,
  Payments,
  Subscriptions,
} from "@/generated/prisma/client";
import type { FinanceDialogState } from "./finance-entry-dialog";

type TDebts = { total: number; count: number; oldest: string };

type FinanceDashboardProps = {
  promPayments: Promise<Payments[]>;
  promExpenses: Promise<Expenses[]>;
  promCustomers: Promise<Customer[]>;
  promSubscriptions: Promise<Subscriptions[]>;
};

export function FinanceDashboard({
  promPayments,
  promExpenses,
  promCustomers,
  promSubscriptions,
}: FinanceDashboardProps) {
  const payments = use(promPayments);
  const expenses = use(promExpenses);
  const customers = use(promCustomers);
  const subscriptions = use(promSubscriptions);

  const today = new Date();

  const {
    tab,
    start,
    end,
    search,
    status,
    page,
    loading,
    setStart,
    setEnd,
    changeSearch,
    changePeriod,
    changeStatus,
    changeTab,
    setPage,
    setLoading,
  } = useFinanceFilters();

  const isExpense = tab === "expenses";

  const [dialog, setDialog] = useState<FinanceDialogState | null>(null);

  const summary = financeSummary(payments, expenses, start, end, today);
  const series = cashSeries(payments, expenses, start, end);

  const debts = new Map<string, TDebts>();
  const topDebts = [...debts.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .slice(0, 5);

  return (
    <div className="mx-auto w-full p-6 md:max-w-6xl md:p-10">
      <FinanceHeader setDialog={setDialog} />

      <FinancePeriodFilter
        start={start}
        end={end}
        onStartChange={setStart}
        onEndChange={setEnd}
        onPeriodChange={changePeriod}
      />

      <FinanceSummary
        payments={payments}
        expenses={expenses}
        summary={summary}
        subscriptions={subscriptions}
        today={today}
      />

      <FinanceTabs value={tab} onChange={changeTab} />

      {tab === "overview" ? (
        <FinanceOverview
          cashFlow={
            <FinanceCashFlow
              series={series}
              hasData={Boolean(summary.received || summary.spent)}
            />
          }
          overdue={
            <FinanceOverdue
              payments={payments}
              customerCount={debts.size}
              today={today}
            />
          }
          collectionPriority={
            <FinanceCollectionPriority items={topDebts} today={today} />
          }
          expenseCategories={
            <FinanceExpenseCategories
              expenses={expenses}
              totalSpent={summary.spent}
              start={start}
              end={end}
            />
          }
          paymentMethods={
            <FinancePaymentMethods
              payments={payments}
              start={start}
              end={end}
            />
          }
        />
      ) : (
        <FinanceEntries
          customers={customers}
          payments={payments}
          expenses={expenses}
          isExpense={isExpense}
          search={search}
          status={status}
          page={page}
          start={start}
          end={end}
          today={today}
          onSearchChange={changeSearch}
          onStatusChange={changeStatus}
          onPageChange={setPage}
        />
      )}

      <p className="mt-8 border-t pt-4 text-xs text-muted-foreground">
        Baixas manuais · sem emissão de boleto ou PIX integrado · receita
        contratada não representa valor recebido
      </p>

      {dialog && (
        <FinanceEntryDialog
          customers={customers}
          state={dialog}
          isLoading={loading}
          onLoading={setLoading}
          onClose={() => setDialog(null)}
        />
      )}

      <FinanceCancelDialog loading={loading} />
    </div>
  );
}
