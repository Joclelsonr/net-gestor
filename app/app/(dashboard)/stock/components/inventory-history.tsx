import { History } from "lucide-react";
import {
  eventLabels,
  fieldLabels,
  inventoryStatuses,
} from "@/constants/inventory-status";
import { formatDate } from "@/lib/br-docs";
import { formatValue, getRecord } from "@/lib/inventory-rules";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import type { Inventory, InventoryEvents } from "@/generated/prisma/client";

type InventoryHistoryProps = {
  item: Inventory;
  events: InventoryEvents[];
  onClose: () => void;
};

export function InventoryHistory({
  item,
  events,
  onClose,
}: InventoryHistoryProps) {
  const orderedEvents = [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  function renderChanges(event: InventoryEvents) {
    const changes = getRecord(event.changes);
    const before = getRecord(changes.before);
    const after = getRecord(changes.after);

    const fields = Array.isArray(changes.fields)
      ? changes.fields.filter(
          (field): field is string => typeof field === "string",
        )
      : Object.keys(after).filter((field) => before[field] !== after[field]);

    if (!fields.length) return null;

    return (
      <div className="mt-3 space-y-2 rounded-lg bg-muted/50 p-3">
        <p className="text-xs font-medium text-muted-foreground">
          Alterações realizadas
        </p>

        {fields.map((field) => {
          const label = fieldLabels[field] ?? field;

          return (
            <div
              key={field}
              className="flex flex-col gap-1 text-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-muted-foreground">{label}</span>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground line-through">
                  {formatValue(field, before[field])}
                </span>

                <span className="text-muted-foreground">→</span>

                <span className="font-medium">
                  {formatValue(field, after[field])}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function renderQuantity(event: InventoryEvents) {
    if (item.category !== "MATERIAL") return null;

    const delta = Number(event.quantityDelta);

    if (
      !Number.isFinite(delta) ||
      delta === 0 ||
      !["REGISTER", "ENTRY", "CONSUMPTION", "ADJUSTMENT"].includes(event.kind)
    ) {
      return null;
    }

    const changes = getRecord(event.changes);
    const after = getRecord(changes.after);

    const isEntry = delta > 0;

    const description =
      event.kind === "REGISTER"
        ? "Saldo inicial"
        : event.kind === "ENTRY"
          ? "Quantidade recebida"
          : event.kind === "CONSUMPTION"
            ? "Quantidade consumida"
            : "Diferença do ajuste";

    return (
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
        <div>
          <p className="text-xs text-muted-foreground">{description}</p>

          <p
            className={`text-base font-semibold ${
              isEntry ? "text-green-600" : "text-red-600"
            }`}
          >
            {isEntry ? "+" : "−"}
            {Math.abs(delta).toLocaleString("pt-BR")} {item.unit}
          </p>
        </div>

        {typeof after.quantity === "number" && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">
              Saldo após movimentação
            </p>

            <p className="font-semibold">
              {after.quantity.toLocaleString("pt-BR")} {item.unit}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Histórico de movimentações</DialogTitle>

          <DialogDescription>
            Acompanhe todas as operações realizadas em{" "}
            <span className="font-medium text-foreground">{item.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-muted/50 p-3">
          <div>
            <p className="text-xs text-muted-foreground">
              {item.category === "MATERIAL" ? "Saldo atual" : "Situação atual"}
            </p>

            <p className="font-semibold">
              {item.category === "MATERIAL"
                ? `${Number(item.quantity).toLocaleString("pt-BR")} ${item.unit ?? ""}`
                : (inventoryStatuses[item.status] ?? item.status)}
            </p>
          </div>

          <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            {orderedEvents.length}{" "}
            {orderedEvents.length === 1 ? "movimentação" : "movimentações"}
          </span>
        </div>

        {!orderedEvents.length ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <History className="size-6 text-muted-foreground" />
            </div>

            <p className="font-medium">Nenhum histórico encontrado</p>

            <p className="max-w-xs text-sm text-muted-foreground">
              As movimentações deste item aparecerão aqui conforme forem
              registradas.
            </p>
          </div>
        ) : (
          <ol className="relative space-y-0">
            {orderedEvents.map((event, index) => (
              <li key={event.id} className="relative flex gap-3 pb-6">
                <div className="flex flex-col items-center">
                  <div className="z-10 flex size-9 shrink-0 items-center justify-center rounded-full border bg-background">
                    <History className="size-4 text-muted-foreground" />
                  </div>

                  {index !== orderedEvents.length - 1 && (
                    <div className="absolute top-9 bottom-0 left-4.25 w-px bg-border" />
                  )}
                </div>

                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                    <p className="font-semibold">
                      {eventLabels[event.kind] ?? event.kind}
                    </p>

                    <time className="text-xs text-muted-foreground">
                      {formatDate(event.createdAt)}
                    </time>
                  </div>

                  {renderQuantity(event)}

                  {renderChanges(event)}
                </div>
              </li>
            ))}
          </ol>
        )}
      </DialogContent>
    </Dialog>
  );
}
