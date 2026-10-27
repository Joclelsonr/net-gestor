import Link from "next/link";

import { ArrowLeft } from "lucide-react";
import { FormNewClient } from "./components/form-new-client";

export default function Page() {
  return (
    <div className="mx-auto w-full p-6 md:p-10">
      <Link
        href="/customer"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Clientes
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Novo cliente</h1>

      <FormNewClient />
    </div>
  );
}
