import Link from "next/link";

import { ArrowLeft } from "lucide-react";

import { EditForm } from "./edit-form";
import { getCustomerById } from "../actions";

type EditFormProps = { params: Promise<{ id: string }> };

export async function EditComponent({ params }: EditFormProps) {
  const { id } = await params;

  const customer = await getCustomerById(id);


  return (
    <>
      <Link
        href={`/customer/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft /> Voltar ao cliente
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Editar cliente</h1>

      <EditForm customer={customer} />
    </>
  );
}
