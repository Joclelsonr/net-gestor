import { Suspense } from "react";

import { SkeletonTable } from "./components/skeleton-table";
import { ButtonNewCustomer } from "./components/button-new-customer";
import { CustomerDataTableWrapper } from "./components/customer-datatable-wrapper";

export default function Page() {
  return (
    <div className="mx-auto w-full p-6 md:max-w-6xl md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            Cadastro
          </p>
          <h1 className="text-3xl font-semibold">Clientes</h1>
        </div>

        <ButtonNewCustomer />
      </div>

      <Suspense fallback={<SkeletonTable />}>
        <CustomerDataTableWrapper />
      </Suspense>
    </div>
  );
}
