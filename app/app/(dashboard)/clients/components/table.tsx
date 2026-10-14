"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { InputSearch } from "./input-serach";
import { formatDocument, formatPhone } from "@/lib/br-docs";

import type { ClientTable } from "@/types";

type TableProps = { data: ClientTable[] };

export function Table({ data }: TableProps) {
  const [search, setSearch] = useState("");

  const term = search.toLowerCase().replace(/\D/g, "") || search.toLowerCase();
  const rows = (data ?? []).filter(
    (client) =>
      !search ||
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.document.includes(term),
  );

  const statusStyle: Record<string, string> = {
    ativo: "bg-success/15 text-success border-success/30",
    aguardando: "bg-secondary text-secondary-foreground",
    suspenso: "bg-warning/20 text-foreground border-warning/40",
    cancelado: "bg-destructive/10 text-destructive border-destructive/30",
  };

  return (
    <>
      <InputSearch search={search} setSearch={setSearch} />

      <div className="mt-4 overflow-hidden rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Cód.</th>
              <th className="px-4 py-3">Nome</th>
              <th className="hidden px-4 py-3 md:table-cell">CPF/CNPJ</th>
              <th className="hidden px-4 py-3 lg:table-cell">Telefone</th>
              <th className="hidden px-4 py-3 lg:table-cell">Cidade</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {/* {isLoading && <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">Carregando...</td></tr>} */}
            {/* {error && <tr><td colSpan={6} className="px-4 py-10 text-center text-destructive">Não foi possível carregar os clientes.</td></tr>} */}
            {/* {!isLoading && !error && rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Nenhum cliente encontrado.</td></tr>
            )} */}
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
              <tr key={client.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  #{String(client.code).padStart(5, "0")}
                </td>
                <td className="px-4 py-3 font-medium">{client.name}</td>
                <td className="hidden px-4 py-3 font-mono text-xs md:table-cell">
                  {formatDocument(client.document)}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {client.phone ? formatPhone(client.phone) : "—"}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {client.city ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={statusStyle[client.status]}
                  >
                    {client.status}
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
