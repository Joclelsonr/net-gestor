import { Suspense } from "react";

import { InventoryWrapper } from "./components/inventory-wrapper";

import { getCustomers, getInventory } from "./actions";

export default async function Page() {
  const inventorys = getInventory();
  const customers = getCustomers();

  return (
    <div className="mx-auto w-full p-6 md:max-w-6xl md:p-10">
      <Suspense fallback={<p>Carregando...</p>}>
        <InventoryWrapper
          promiseInventorys={inventorys}
          promiseCustomers={customers}
        />
      </Suspense>
    </div>
  );
}
