import { Suspense } from "react";

import { FinanceDashboard } from "./components/finance-dashboard";

import {
  getCustomers,
  getExpenses,
  getPayments,
  getSubscriptions,
} from "./actions";

export default function Page() {
  const customers = getCustomers();
  const expenses = getExpenses();
  const payments = getPayments();
  const subscritpions = getSubscriptions();

  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full p-6 md:max-w-6xl md:p-10">
          <p>Carregando...</p>
        </div>
      }
    >
      <FinanceDashboard
        promCustomers={customers}
        promExpenses={expenses}
        promPayments={payments}
        promSubscriptions={subscritpions}
      />
    </Suspense>
  );
}
