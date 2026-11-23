import { CustomerDataTable } from "./customer-datatable";
import { customerColumns } from "./customer-columns";

import { getClients } from "../actions";

export async function CustomerDataTableWrapper() {
  const data = await getClients();

  return <CustomerDataTable data={data} columns={customerColumns} />;
}
