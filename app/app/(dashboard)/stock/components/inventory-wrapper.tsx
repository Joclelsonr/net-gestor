"use client";

import Link from "next/link";

import { use, useState } from "react";
import {
  Plus,
  Cable,
  Router,
  Search,
  Pencil,
  Package,
  History,
  ArrowDownUp,
  AlertTriangle,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InventoryEditor } from "./inventory-editor";
import { normalizeMac } from "@/lib/inventory-rules";
import { InventoryHistory } from "./inventory-history";
import { InventoryMovement } from "./inventory-movement";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { inventoryEntries, InventorySelect } from "./inventory-select";
import { categories, inventoryStatuses } from "@/constants/inventory-status";

import type {
  Customer,
  Inventory,
  InventoryEvents,
} from "@/generated/prisma/client";

type InventoryWrapperProps = {
  promiseInventorys: Promise<
    (Inventory & { inventoryMovements: InventoryEvents[] })[]
  >;
  promiseCustomers: Promise<Customer[]>;
};

export function InventoryWrapper({
  promiseInventorys,
  promiseCustomers,
}: InventoryWrapperProps) {
  const inventorys = use(promiseInventorys);
  const customers = use(promiseCustomers);

  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [lowOnly, setLowOnly] = useState(false);
  const [status, setStatus] = useState("ALL");
  const [movement, setMovement] = useState<Inventory | null>(null);
  const [editor, setEditor] = useState<{ item: Inventory | null } | null>(null);
  const [history, setHistory] = useState<
    (Inventory & { inventoryMovements: InventoryEvents[] }) | null
  >(null);

  const routes = inventorys.filter((i) => i.customerId).length;
  const available = inventorys.filter(
    (i) => i.category !== "MATERIAL" && i.status === "AVAILABLE",
  ).length;
  const material = inventorys.filter(
    (i) => i.category === "MATERIAL" && i.status !== "ASSIGNED",
  ).length;
  const low = inventorys.filter(
    (i) =>
      i.category === "MATERIAL" &&
      i.status !== "AVAILABLE" &&
      Number(i.quantity) <= Number(i.minimumStock),
  );

  const macSearch = normalizeMac(search);
  const text = search.toLowerCase().trim();
  const visible = inventorys.filter(
    (i) =>
      (tab === "ALL" || i.category === tab) &&
      (status === "ALL" || i.status === status) &&
      (!lowOnly || low.some((m) => m.id === i.id)) &&
      (`${i.name} ${i.brand} ${i.model} ${i.serial} ${i.location} ${i.mac ?? ""}`
        .toLowerCase()
        .includes(text) ||
        (!!macSearch && i.mac === macSearch)),
  );

  const data = [
    {
      label: "Equipamentos disponíveis",
      count: available,
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Roteadores nos clientes",
      count: routes,
      icon: Router,
      color: "text-success",
    },
    {
      label: "Tipos de materiais",
      count: material,
      icon: Cable,
      color: "text-primary",
    },
    {
      label: "Estoque baixo",
      count: low,
      icon: AlertTriangle,
      color: "text-warning",
    },
  ];

  const colors: Record<string, string> = {
    AVAILABLE: "border-success/30 text-success",
    ASSIGNED: "border-primary/30 text-primary",
    MAINTENANCE: "border-warning/40 text-warning",
    DAMAGED: "text-muted-foreground",
  };

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-widest text-primary uppercase">
            Patrimônio e almoxarifado
          </p>
          <h1 className="text-3xl font-semibold">Estoque</h1>
        </div>
        <Button
          size="lg"
          onClick={() => setEditor({ item: null })}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Plus />
          Cadastrar item
        </Button>
      </header>
      <dl className="my-6 grid grid-cols-2 divide-x border-y py-4 lg:grid-cols-4">
        {data.map((s) => (
          <div key={s.label} className="px-3 py-2 md:px-5">
            <dt className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              {s.label}
              <s.icon className={`h-4 w-4 shrink-0 ${s.color}`} />
            </dt>
            <dd className="font-display mt-2 text-3xl font-semibold">
              {Number(s.count)}
            </dd>
          </div>
        ))}
      </dl>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="flex w-full border md:w-100">
          <TabsTrigger value="ALL">Todos</TabsTrigger>
          <TabsTrigger value="ROUTER">Roteadores</TabsTrigger>
          <TabsTrigger value="EQUIPAMENT">Equipamentos</TabsTrigger>
          <TabsTrigger value="MATERIAL">Materiais</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="my-5 grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px_auto]">
        <div className="relative">
          <Search className="absolute top-2 left-2 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Buscar item"
            className="pl-9"
            placeholder="Nome, MAC, série ou cliente"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <InventorySelect
          label="Filtrar situação"
          value={status}
          onChange={setStatus}
          options={[
            { value: "ALL", label: "Todas as situações" },
            ...inventoryEntries(inventoryStatuses),
          ]}
        />
        <Button
          variant={lowOnly ? "secondary" : "outline"}
          aria-pressed={lowOnly}
          onClick={() => setLowOnly(!lowOnly)}
        >
          <AlertTriangle />
          Estoque baixo
        </Button>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">
        {inventorys.length} item(ns)
      </p>
      {!visible.length && (
        <div className="py-14 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-medium">Nenhum item encontrado.</p>
        </div>
      )}
      <div className="space-y-3">
        {visible?.map((inventory) => {
          const Icon =
            inventory.category === "ROUTER"
              ? Router
              : inventory.category === "MATERIAL"
                ? Cable
                : Package;
          return (
            <article
              key={inventory.id}
              className="flex min-w-0 flex-wrap items-center gap-1 rounded-lg border bg-card p-4 sm:p-5 md:gap-4"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md bg-secondary text-primary">
                <Icon />
              </div>
              <div className="min-w-0 flex-1 basis-44">
                <p className="text-xs text-muted-foreground">
                  {categories[inventory.category as keyof typeof categories]}
                </p>
                <h2 className="font-semibold wrap-break-word">
                  {inventory.name}
                </h2>
                <p className="text-sm wrap-break-word text-muted-foreground">
                  {[inventory.brand, inventory.model, inventory.location]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {inventory.mac && (
                  <p className="font-mono text-xs break-all">{inventory.mac}</p>
                )}
                {inventory.serial && (
                  <p className="text-xs wrap-break-word text-muted-foreground">
                    Série: {inventory.serial}
                  </p>
                )}
              </div>
              <div className="min-w-0 basis-40 text-sm">
                {inventory.category === "MATERIAL" ? (
                  <>
                    <p className="font-semibold">
                      {Number(inventory.quantity).toLocaleString("pt-BR")}{" "}
                      {inventory.unit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mínimo:{" "}
                      {Number(inventory.minimumStock).toLocaleString("pt-BR")}{" "}
                      {inventory.unit}
                    </p>
                    {low.some((m) => m.id === inventory.id) && (
                      <p className="mt-1 text-xs text-warning">
                        Reposição necessária
                      </p>
                    )}
                  </>
                ) : inventory.customerId ? (
                  <Link
                    href={`/customer/${inventory.customerId}`}
                    className="text-sm text-muted-foreground"
                  >
                    {customers
                      .find((customer) => customer.id === inventory.customerId)
                      ?.name.trim()
                      .split(/\s+/)
                      .slice(0, 2)
                      .join(" ")}
                  </Link>
                ) : (
                  <p className="text-muted-foreground">
                    Sem vínculo com cliente
                  </p>
                )}
              </div>
              <Badge variant="outline" className={colors[inventory.status]}>
                {
                  inventoryStatuses[
                    inventory.status as keyof typeof inventoryStatuses
                  ]
                }
              </Badge>
              <div className="flex shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Editar ${inventory.name}`}
                  title="Editar item"
                  onClick={() => setEditor({ item: inventory })}
                >
                  <Pencil />
                </Button>
                {inventory.category === "MATERIAL" &&
                  inventory.status !== "ASSIGNED" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Movimentar ${inventory.name}`}
                      title="Entrada / saída"
                      onClick={() => setMovement(inventory)}
                    >
                      <ArrowDownUp />
                    </Button>
                  )}
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Histórico de ${inventory.name}`}
                  title="Histórico"
                  onClick={() => setHistory(inventory)}
                >
                  <History />
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      {editor && (
        <InventoryEditor
          key={editor.item?.id || "new"}
          item={editor.item}
          customers={customers}
          onClose={() => setEditor(null)}
        />
      )}
      {movement && (
        <InventoryMovement item={movement} onClose={() => setMovement(null)} />
      )}
      {history && (
        <InventoryHistory
          item={history}
          events={history.inventoryMovements}
          onClose={() => setHistory(null)}
        />
      )}
    </div>
  );
}
