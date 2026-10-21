import { Suspense } from "react";

import { Table } from "./components/table";
import { ButtonNewCustomer } from "./components/button-new-customer";

import { getClients } from "./actions";

export default async function Page() {
  const data = getClients();

  return (
    <div className="mx-auto w-full p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Cadastro
          </p>
          <h1 className="text-3xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {/* {data?.length ?? 0} cadastrados */}
          </p>
        </div>

        <ButtonNewCustomer />
      </div>

      <Suspense fallback={<div className="mt-10">Carregando clientes...</div>}>
        <Table data={data} />
      </Suspense>
    </div>
  );
}
