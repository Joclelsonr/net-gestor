import Link from "next/link";

import { Plus } from "lucide-react";
import { Table } from "./components/table";
import { Button } from "@/components/ui/button";

import { getClients } from "./actions";

export default async function Page() {
  const data = await getClients();

  return (
    <div className="mx-auto w-full p-6 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Cadastro
          </p>
          <h1 className="text-3xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            {data?.length ?? 0} cadastrados
          </p>
        </div>

        <Link href="/clients/new">
          <Button className="bg-blue-500 hover:bg-blue-600" size="lg">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Novo cliente
            </div>
          </Button>
        </Link>
      </div>

      <Table data={data} />
    </div>
  );
}
