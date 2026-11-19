"use client";

import { useState } from "react";
import { brl } from "@/lib/billing";
import { toast } from "@/components/ui/toast";
import { expenseCategories } from "@/constants/finance-status";

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FinanceSelect } from "./finance-select";
import { CustomCalendar } from "@/components/custom-calendar";

import { createExpenses } from "../actions";

import type { Customer, Expenses, Payments } from "@/generated/prisma/client";

export type FinanceDialogState =
  | { kind: "charge" | "expense" }
  | { kind: "receive"; row: Payments }
  | { kind: "pay"; row: Expenses };

export function FinanceEntryDialog({
  state,
  customers,
  isLoading,
  // userId,
  onClose,
  onLoading,
}: {
  state: FinanceDialogState;
  customers: Customer[];
  isLoading: boolean;
  userId?: string;
  onClose: () => void;
  onLoading: (params: boolean) => void;
}) {
  const settlement = state.kind === "receive" || state.kind === "pay";

  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("PIX");
  const [formCustomer, setFormCustomer] = useState("");

  const [form, setForm] = useState({
    description: state.kind === "charge" ? "Mensalidade" : "",
    category: "OTHERS",
    amount: "",
    dueDate: "",
  });

  const title = {
    charge: "Nova cobrança",
    expense: "Nova despesa",
    receive: "Registrar recebimento",
    pay: "Registrar pagamento da despesa",
  }[state.kind];

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    onLoading(true);

    const result = await createExpenses({ ...form });
    if (result.success) {
      toast.add({ type: "success", description: result.message });
      onClose();
    } else {
      toast.add({ type: "error", description: result.message });
    }
    onLoading(false);
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !isLoading) onClose();
      }}
    >
      <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {settlement && "row" in state
              ? `${state.row.description} · ${brl(state.row.amount)}`
              : state.kind === "charge"
                ? "Conta a receber do cliente"
                : "Conta a pagar do provedor"}
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={submit}>
          {state.kind === "charge" && (
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input
                aria-label="Buscar cliente da cobrança"
                placeholder="Buscar por nome ou código"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <FinanceSelect
                label="Selecionar cliente"
                value={formCustomer}
                onChange={setFormCustomer}
                options={customers
                  .filter((c) =>
                    `${c.name}`.toLowerCase().includes(search.toLowerCase()),
                  )
                  .map((c) => ({
                    value: c.id,
                    label: `${c.name}`,
                  }))}
              />
            </div>
          )}
          {!settlement && (
            <>
              <div className="space-y-2">
                <Label htmlFor="finance-description">Descrição</Label>
                <Input
                  id="finance-description"
                  required
                  maxLength={200}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
              {state.kind === "expense" && (
                <div className="space-y-2">
                  <Label>Categoria</Label>
                  <FinanceSelect
                    label="Categoria da despesa"
                    value={form.category}
                    onChange={(value) => setForm({ ...form, category: value })}
                    options={Object.entries(expenseCategories).map(
                      ([value, label]) => ({ value, label }),
                    )}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="finance-amount">Valor (R$)</Label>
                <Input
                  id="finance-amount"
                  inputMode="decimal"
                  required
                  placeholder="0,00"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                />
              </div>
            </>
          )}
          <div className="space-y-2">
            <CustomCalendar
              id="finance-date"
              label={settlement ? "Data do pagamento" : "Vencimento"}
              value={form.dueDate}
              placeholder="dd/mm/aaaa"
              onChange={(date) => setForm({ ...form, dueDate: date })}
            />
          </div>
          {settlement && (
            <div className="space-y-2">
              <Label>Forma de pagamento</Label>
              <FinanceSelect
                label="Forma de pagamento"
                value={method}
                onChange={setMethod}
                options={Object.entries(expenseCategories).map(
                  ([value, label]) => ({ value, label }),
                )}
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              size="lg"
              type="button"
              variant="ghost"
              disabled={isLoading}
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {isLoading
                ? "Salvando..."
                : settlement
                  ? "Confirmar pagamento"
                  : "Salvar lançamento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
