"use client";

import { useState } from "react";
import { brl } from "@/lib/billing";
import { paymentState } from "@/lib/payment-rules";
import { methodPayment } from "@/constants/method-payment";
import { Plus, Check, Ban, Wallet, Save, X } from "lucide-react";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { createPayment, updatePayment } from "../actions";

import type { Payments, PaymentStatus } from "@/generated/prisma/client";

type CustomerPaymentsProps = {
  payments: Payments[];
  customerId: string;
};

export function CustomerPayments({
  payments,
  customerId,
}: CustomerPaymentsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paidDate, setPaidDate] = useState(new Date());
  const [settling, setSettling] = useState<string | null>(null);
  const [form, setForm] = useState({
    description: "Mensalidade",
    amount: "",
    dueDate: new Date(),
    paymentMethod: "",
  });

  const today = new Date();
  const rows = payments ?? [];
  const pending = rows.filter((rows) => rows.status === "WAITING");
  const totals = [
    ["Em aberto", pending.reduce((sum, rows) => sum + Number(rows.amount), 0)],
    [
      "Em atraso",
      pending
        .filter((rows) => rows.dueDate < today)
        .reduce((sum, rows) => sum + Number(rows.amount), 0),
    ],
    [
      "Recebido",
      rows
        .filter((rows) => rows.status === "PAID")
        .reduce((sum, rows) => sum + Number(rows.amount), 0),
    ],
  ] as const;

  async function addPayment(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const result = await createPayment(
      customerId,
      form.description,
      form.amount,
      form.dueDate,
    );
    if (result.success) {
      toast.add({
        type: "success",
        description: result.message,
      });
      setForm({
        amount: "",
        dueDate: new Date(),
        description: "",
        paymentMethod: "",
      });
      setOpen(false);
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
    setLoading(false);
  }

  async function update(
    paymentId: string,
    status: PaymentStatus,
    paidDate?: Date,
    paymentMethod?: string,
  ) {
    setLoading(true);

    const result = await updatePayment(
      paymentId,
      status,
      paidDate,
      paymentMethod,
    );
    if (result.success) {
      toast.add({
        type: "success",
        description: result.message,
      });
      setSettling(null);
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
    setLoading(false);
  }

  return (
    <section className="mt-8 border-t pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Wallet className="h-5 w-5 text-primary" /> Pagamentos do cliente
        </h2>
        <Button
          size="lg"
          onClick={() => setOpen(!open)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {open ? (
            <>
              <X /> Fechar
            </>
          ) : (
            <>
              <Plus /> Nova cobrança{" "}
            </>
          )}
        </Button>
      </div>
      <dl className="mt-5 grid grid-cols-3 gap-3">
        {totals.map(([label, total]) => (
          <div key={label}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="wrap-break-word text-lg font-semibold">
              {brl(total)}
            </dd>
          </div>
        ))}
      </dl>
      {open && (
        <form
          onSubmit={addPayment}
          className="mt-5 grid items-end gap-4 sm:grid-cols-3"
        >
          <div className="space-y-2">
            <Label htmlFor="payment-description">Descrição</Label>
            <Input
              required
              id="payment-description"
              className="bg-white"
              maxLength={200}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Valor (R$)</Label>
            <Input
              required
              className="bg-white"
              id="payment-amount"
              inputMode="decimal"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-due">Vencimento</Label>
            <Input
              required
              type="date"
              id="payment-due"
              className="bg-white"
              value={form.dueDate.toISOString().slice(0, 10)}
              onChange={(e) =>
                setForm({ ...form, dueDate: new Date(e.target.value) })
              }
            />
          </div>
          <Button
            size="lg"
            type="submit"
            disabled={loading}
            className="sm:col-start-3 bg-blue-500 hover:bg-blue-600"
          >
            {loading ? <Spinner /> : <Save />}
            {loading ? "Salvando..." : "Registrar cobrança"}
          </Button>
        </form>
      )}
      {!rows.length && (
        <p className="mt-5 text-sm text-muted-foreground">
          Nenhuma cobrança registrada.
        </p>
      )}
      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="wrap-break-word font-semibold">
                  {row.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  Vencimento:{" "}
                  {new Date(row.dueDate).toLocaleDateString("pt-BR")}
                  {row.paidDate
                    ? ` · Pago em ${new Date(row.paidDate).toLocaleDateString("pt-BR")} · ${methodPayment.find((method) => method.value === row.paymentMethod)?.name ?? ""}`
                    : ""}
                </p>
              </div>
              <div>
                <p className="font-semibold">{brl(row.amount)}</p>
                <p
                  className={
                    paymentState(row, today) === "Atrasado"
                      ? "text-sm text-destructive"
                      : "text-sm text-muted-foreground"
                  }
                >
                  {paymentState(row, today)}
                </p>
              </div>
              {row.status === "WAITING" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={loading}
                    onClick={() => {
                      setSettling(row.id);
                      setPaidDate(new Date(today));
                    }}
                  >
                    <Check className="h-4 w-4" /> Registrar pagamento
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    title="Cancelar cobrança"
                    aria-label="Cancelar cobrança"
                    disabled={loading}
                    onClick={() => update(row.id, "CANCELED")}
                  >
                    <Ban className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {settling === row.id && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  update(row.id, "PAID", paidDate, form.paymentMethod);
                }}
                className="mt-4  grid items-end gap-3 md:flex md:items-center md:justify-between sm:grid-cols-3"
              >
                <div className="space-y-2">
                  <Label htmlFor="paid-date">Data do pagamento</Label>
                  <Input
                    required
                    type="date"
                    id="paid-date"
                    max={today.toISOString().slice(0, 10)}
                    value={paidDate.toISOString().slice(0, 10)}
                    onChange={(e) => setPaidDate(new Date(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Forma de pagamento</Label>
                  <Select
                    value={form.paymentMethod}
                    onValueChange={(value) =>
                      setForm({ ...form, paymentMethod: value ?? "" })
                    }
                  >
                    <SelectTrigger className="w-full md:w-72">
                      <SelectValue>
                        {methodPayment.find(
                          (method) => method.value === form.paymentMethod,
                        )?.name ?? ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {methodPayment.map((method) => (
                        <SelectItem key={method.id} value={method.value}>
                          {method.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className=" bg-blue-500 hover:bg-blue-600"
                  >
                    Confirmar pagamento
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSettling(null)}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
