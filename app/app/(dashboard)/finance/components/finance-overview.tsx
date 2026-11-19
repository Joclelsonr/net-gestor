import type { ReactNode } from "react";

type FinanceOverviewProps = {
  cashFlow: ReactNode;
  overdue: ReactNode;
  collectionPriority: ReactNode;
  expenseCategories: ReactNode;
  paymentMethods: ReactNode;
};

export function FinanceOverview({
  cashFlow,
  overdue,
  collectionPriority,
  expenseCategories,
  paymentMethods,
}: FinanceOverviewProps) {
  return (
    <div className="mt-6 space-y-8">
      <div className="grid gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {cashFlow}
        {overdue}
      </div>

      <div className="grid gap-8 border-t pt-7 lg:grid-cols-2">
        {collectionPriority}
        {expenseCategories}
      </div>

      {paymentMethods}
    </div>
  );
}
