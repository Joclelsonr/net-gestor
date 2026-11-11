"use client";

import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { moveInventory } from "../actions";

import type { Inventory } from "@/generated/prisma/client";

type MovementMode = "ADD" | "REMOVE";
type InventoryMovementProps = {
  item: Inventory;
  onClose: () => void;
};

export function InventoryMovement({ item, onClose }: InventoryMovementProps) {
  const [mode, setMode] = useState<MovementMode>("ADD");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount = Number(quantity);
  const currentQuantity = Number(item.quantity);

  const validQuantity = Number.isInteger(amount) && amount > 0;

  const insufficientStock =
    mode === "REMOVE" && validQuantity && amount > currentQuantity;

  async function save(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!validQuantity) {
      setError("Informe uma quantidade inteira maior que zero.");
      return;
    }

    if (insufficientStock) {
      setError("A quantidade informada é maior que o saldo disponível.");
      return;
    }

    setLoading(true);

    try {
      const result = await moveInventory(item.id, mode, amount);

      if (!result.success) {
        setError(result.message);
        return;
      }

      onClose();
    } catch {
      setError("Não foi possível registrar a movimentação.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !loading) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Movimentar · {item.name}</DialogTitle>

          <DialogDescription>
            Registre uma entrada ou saída deste material.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">Saldo disponível</p>

          <p className="text-xl font-semibold">
            {currentQuantity.toLocaleString("pt-BR")} {item.unit}
          </p>
        </div>

        <Tabs
          value={mode}
          onValueChange={(value) => {
            setMode(value as MovementMode);
            setError("");
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ADD">Entrada</TabsTrigger>
            <TabsTrigger value="REMOVE">Saída</TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade ({item.unit})</Label>

            <Input
              id="quantity"
              required
              type="number"
              min="1"
              step="1"
              placeholder="Informe a quantidade"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError("");
              }}
              disabled={loading}
            />

            {mode === "REMOVE" && (
              <p className="text-xs text-muted-foreground">
                Disponível para saída: {currentQuantity.toLocaleString("pt-BR")}{" "}
                {item.unit}
              </p>
            )}
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={onClose}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading || !validQuantity || insufficientStock}
            >
              {loading
                ? "Salvando..."
                : mode === "ADD"
                  ? "Registrar entrada"
                  : "Registrar saída"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
