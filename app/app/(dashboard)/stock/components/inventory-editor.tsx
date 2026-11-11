"use client";

import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { inventoryEntries, InventorySelect } from "./inventory-select";
import { categories, inventoryStatuses } from "@/constants/inventory-status";

import { upsertInventory } from "../actions";

import type {
  Customer,
  Inventory,
  InventoryStatus,
  InventoryCategory,
} from "@/generated/prisma/client";
import type { TInventory } from "../schema";

type InventoryEditor = {
  item: Inventory | null;
  customers: Customer[];
  onClose: () => void;
};

export function InventoryEditor({ item, customers, onClose }: InventoryEditor) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TInventory>({
    name: item?.name ?? "",
    category: item?.category ?? "",
    brand: item?.brand ?? "",
    model: item?.model ?? "",
    mac: item?.mac ?? "",
    serial: item?.serial ?? "",
    quantity: item?.quantity ?? 1,
    unit: item?.unit ?? "",
    minimumStock: item?.minimumStock ?? 1,
    location: item?.location ?? "",
    status: item?.status ?? "",
    customerId: item?.customerId ?? "",
    notes: item?.notes ?? "",
  });

  async function save(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const result = await upsertInventory(form, item?.id);
    if (result.success) {
      onClose();
      toast.add({ type: "success", description: result.message });
    } else {
      toast.add({ type: "error", description: result.message });
    }
    setLoading(false);
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !loading) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? "Editar item" : "Cadastrar item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <InventorySelect
            label="Categoria"
            value={form.category}
            disabled={!!item}
            options={inventoryEntries(categories)}
            onChange={(v) =>
              setForm({ ...form, category: v as InventoryCategory })
            }
          />
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              required
              placeholder="Roteador"
              maxLength={150}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Marca</Label>
            <Input
              id="brand"
              placeholder="TP-Link"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Modelo</Label>
            <Input
              id="model"
              placeholder="EX520"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
          </div>
          {form.category !== "MATERIAL" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="mac">
                  MAC{form.category === "ROUTER" ? " *" : ""}
                </Label>
                <Input
                  id="mac"
                  required={form.category === "ROUTER"}
                  disabled={!!item?.customerId}
                  placeholder="AA:BB:CC:DD:EE:FF"
                  value={form.mac}
                  onChange={(e) => setForm({ ...form, mac: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serial">Número de série</Label>
                <Input
                  id="serial"
                  placeholder="166292013501"
                  value={form.serial}
                  onChange={(e) => setForm({ ...form, serial: e.target.value })}
                />
              </div>
            </>
          )}
          {form.category === "MATERIAL" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade inicial</Label>
                <Input
                  id="quantity"
                  required
                  type="number"
                  min="1"
                  step="1"
                  disabled={!!item}
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: Number(e.target.value) })
                  }
                />
              </div>
              <InventorySelect
                label="Unidade"
                value={form.unit}
                onChange={(v) => setForm({ ...form, unit: v })}
                options={[
                  { value: "un", label: "Unidades" },
                  { value: "m", label: "Metros" },
                  { value: "kg", label: "Quilos" },
                  { value: "cx", label: "Caixas" },
                ]}
              />
              <div className="space-y-2">
                <Label htmlFor="min">Estoque mínimo</Label>
                <Input
                  id="min"
                  required
                  type="number"
                  min="0"
                  step="any"
                  value={form.minimumStock}
                  onChange={(e) =>
                    setForm({ ...form, minimumStock: Number(e.target.value) })
                  }
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label htmlFor="location">Local / depósito</Label>
            <Input
              id="location"
              placeholder="Depósito X"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <InventorySelect
            label="Situação"
            value={form.status}
            options={inventoryEntries(inventoryStatuses)}
            onChange={(v) => setForm({ ...form, status: v as InventoryStatus })}
          />
          {form.category === "ROUTER" && form.status === "ASSIGNED" && (
            <InventorySelect
              label="Cliente vinculado"
              value={form.customerId}
              options={[
                { value: "", label: "Selecione o cliente" },
                ...customers.map((c) => ({
                  value: c.id,
                  label: `${c.name}`,
                })),
              ]}
              onChange={(v) => setForm({ ...form, customerId: v })}
            />
          )}
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2 sm:col-span-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
