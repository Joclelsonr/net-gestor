"use client";

import Link from "next/link";

import { useState } from "react";

import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDocument, formatPhone } from "@/lib/br-docs";

export default function Page() {
  const data = [
    {
      id: 1,
      code: 1,
      name: "João da Silva",
      document: "12345678901",
      phone: "11999999999",
      city: "São Paulo",
      status: "ativo",
    },
  ];
  const [q, setQ] = useState("");

  const term = q.toLowerCase().replace(/\D/g, "") || q.toLowerCase();
  const rows = (data ?? []).filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.document.includes(term),
  );

  const statusStyle: Record<string, string> = {
    ativo: "bg-success/15 text-success border-success/30",
    prospecto: "bg-secondary text-secondary-foreground",
    suspenso: "bg-warning/20 text-foreground border-warning/40",
    cancelado: "bg-destructive/10 text-destructive border-destructive/30",
  };

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
          <Button className="bg-blue-400 hover:bg-blue-500 h-10">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Novo cliente
            </div>
          </Button>
        </Link>
      </div>

      <div className="relative mt-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Buscar por nome, CPF ou CNPJ"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

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
            {rows.map((c) => (
              <tr key={c.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  #{String(c.code).padStart(5, "0")}
                </td>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="hidden px-4 py-3 font-mono text-xs md:table-cell">
                  {formatDocument(c.document)}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {c.phone ? formatPhone(c.phone) : "—"}
                </td>
                <td className="hidden px-4 py-3 lg:table-cell">
                  {c.city ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline" className={statusStyle[c.status]}>
                    {c.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
