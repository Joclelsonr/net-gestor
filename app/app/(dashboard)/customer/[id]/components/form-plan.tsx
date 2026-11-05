"use client";

import Link from "next/link";

import { useState } from "react";
import { brl } from "@/lib/billing";
import { SaveCheck, Plus, X, Gauge } from "lucide-react";

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
import { subscriptionSchema } from "../schema";

import { addPlan } from "../actions";

import type { TSubscription } from "../schema";
import type { Plans } from "@/generated/prisma/client";

type FormPlanProps = { plans: Plans[]; customerId: string };

export function FormPlan({ plans, customerId }: FormPlanProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<TSubscription>(subscriptionSchema);

  async function addSubscription(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const result = await addPlan({ ...form, customerId });
    if (result.success) {
      toast.add({
        type: "success",
        description: result.message,
      });
      setForm(subscriptionSchema);
      setOpen(false);
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
    setLoading(false);
  }

  return (
    <>
      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <h2 className="flex gap-2 font-semibold md:text-xl">
          <Gauge />
          Planos contratados
        </h2>
        <Button
          size="lg"
          onClick={() => setOpen((o) => !o)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {open ? <X /> : <Plus />}
          {open ? "Cancelar" : "Vincular plano"}
        </Button>
      </div>

      {open && (
        <form
          onSubmit={addSubscription}
          className="mt-4 grid gap-4 rounded-lg border bg-card p-5 md:grid-cols-5"
        >
          <div className="space-y-2 md:col-span-2">
            <Label>Plano</Label>
            <Select
              value={form.planId}
              onValueChange={(value) => {
                setForm({ ...form, planId: value ?? "" });
              }}
            >
              <SelectTrigger className="w-full md:w-72">
                <SelectValue placeholder="Selecione o plano">
                  {plans.find((plan) => plan.id === form.planId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {plans
                  .filter((plan) => plan.active)
                  .map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} — {plan.downloadMbps} Mbps — {brl(plan.price)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {plans.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Cadastre um plano em{" "}
                <Link href="/plan" className="underline">
                  Planos
                </Link>
                .
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Mensalidade (R$)</Label>
            <Input
              id="price"
              required
              inputMode="decimal"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Dia de vencimento</Label>
            <Select
              value={form.dueDate}
              onValueChange={(v) => setForm({ ...form, dueDate: v ?? 10 })}
            >
              <SelectTrigger className="w-full md:w-50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 20, 25, 30].map((day) => (
                  <SelectItem key={day} value={String(day)}>
                    Dia {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start">Início</Label>
            <Input
              id="start"
              type="date"
              required
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Fidelidade</Label>
            <Select
              value={form.loyalty_months}
              onValueChange={(v) =>
                setForm({ ...form, loyalty_months: v ?? "" })
              }
            >
              <SelectTrigger className="w-full md:w-72">
                <SelectValue placeholder="Selecione a fidelidade" />
              </SelectTrigger>
              <SelectContent>
                {[0, 6, 12, 24].map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {m ? `${m} meses` : "Sem fidelidade"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end md:col-span-4 md:justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {loading ? <Spinner /> : <SaveCheck />}
              {loading ? "Salvando..." : "Vincular"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
