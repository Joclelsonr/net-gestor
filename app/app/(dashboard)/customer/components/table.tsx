"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { InputSearch } from "./input-serach";
import { formatDocument, formatPhone } from "@/lib/br-docs";

import type { Customer } from "@/generated/prisma/client";
import { statusStyle, statusTraduction } from "@/constants/status-styled";

type TableProps = { data: Promise<Customer[]> };

export function Table({ data }: TableProps) {
  const allCustomer = use(data);
  const router = useRouter();
  const [search, setSearch] = useState("");

  const term = search.toLowerCase().replace(/\D/g, "") || search.toLowerCase();
  const rows = (allCustomer ?? []).filter(
    (client) =>
      !search ||
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.cpf.includes(term),
  );

  return (
    <>
      <InputSearch search={search} setSearch={setSearch} />

      <div className="mt-4 overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="hidden px-4 py-3 md:table-cell">CPF/CNPJ</th>
              <th className="hidden px-4 py-3 lg:table-cell">Whatsapp</th>
              <th className="hidden px-4 py-3 lg:table-cell">Tipo</th>
              <th className="hidden px-4 py-3 lg:table-cell">Desde</th>
              <th className="px-4 py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-12 text-center text-muted-foreground"
                >
                  Nenhum cliente encontrado.
                </td>
              </tr>
            )}
            {rows.map((client) => (
              <tr
                key={client.id}
                onClick={() => router.push(`/customer/${client.id}`)}
                className="border-t hover:bg-muted/50 cursor-pointer"
              >
                <td className="px-4 py-3 font-medium">{client.name}</td>
                <td className="hidden px-4 py-3 font-mono text-xs md:table-cell">
                  {formatDocument(client.cpf)}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {client.whatsapp ? formatPhone(client.whatsapp) : "—"}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {client.personType ?? "—"}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  <span>
                    {new Date(client.createdAt).toLocaleDateString("pt-BR", {
                      timeZone: "America/Sao_Paulo",
                    })}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant="outline"
                    className={statusStyle[client.status]}
                  >
                    {statusTraduction[client.status]}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
