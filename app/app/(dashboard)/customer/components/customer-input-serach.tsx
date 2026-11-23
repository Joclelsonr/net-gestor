import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import type { ReactTable, RowData } from "@tanstack/react-table";
import type { DataTableFeatures } from "./customer-datatable-features";

interface CustomerInputSearchProps<TData extends RowData> {
  table: ReactTable<DataTableFeatures, TData>;
}

export function CustomerInputSearch<TData extends RowData>({
  table,
}: CustomerInputSearchProps<TData>) {
  return (
    <div className="relative mt-6">
      <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        // className="max-w-sm"
        className="h-10 w-full bg-white pl-9"
        placeholder="Buscar por nome, CPF ou CNPJ"
        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
        onChange={(event) =>
          table.getColumn("name")?.setFilterValue(event.target.value) ||
          table.getColumn("cpf")?.setFilterValue(event.target.value)
        }
      />
    </div>
  );
}
