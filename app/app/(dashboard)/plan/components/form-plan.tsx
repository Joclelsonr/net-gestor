"use client";

import { useState } from "react";
import { SaveCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { planSchema } from "../schema";
import { createPlan } from "../actions";

import type { TPlan } from "../schema";

export function FormPlan() {
  const [form, setForm] = useState<TPlan>(planSchema);
  const [loading, setLoading] = useState(false);

  async function save(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const result = await createPlan(form);
    if (result.success) {
      toast.add({
        type: "success",
        description: result.message,
      });
      setLoading(false);
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
      setLoading(false);
    }
  }

  const set =
    (k: keyof typeof planSchema) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <form
      onSubmit={save}
      className="mt-6 grid gap-4 rounded-lg border bg-card p-6 md:grid-cols-5"
    >
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          required
          autoComplete="off"
          value={form.name}
          onChange={set("name")}
          placeholder="Fibra 500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="dl">Download (Mbps)</Label>
        <Input
          id="dl"
          type="number"
          min={1}
          required
          value={form.downloadMbps}
          onChange={set("downloadMbps")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ul">Upload (Mbps)</Label>
        <Input
          id="ul"
          type="number"
          min={1}
          required
          value={form.uploadMbps}
          onChange={set("uploadMbps")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Mensalidade (R$)</Label>
        <Input
          id="price"
          inputMode="decimal"
          required
          value={form.price}
          onChange={set("price")}
          placeholder="99,90"
        />
      </div>
      <div className="space-y-2 md:col-span-4">
        <Label htmlFor="desc">Descrição</Label>
        <Input
          id="desc"
          value={form.description}
          onChange={set("description")}
        />
      </div>
      <div className="flex items-end">
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          {loading ? <Spinner /> : <SaveCheck />}
          {loading ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
