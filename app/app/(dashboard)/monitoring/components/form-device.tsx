"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

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
import { registerSchema } from "../schema";

import { createDevice } from "../actions";

export function FormDevice() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(registerSchema);

  async function saveDevice(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const result = await createDevice({ ...form });
    if (result.success) {
      toast.add({
        type: "success",
        description: result.message,
      });
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={saveDevice}
      className="w-full grid gap-4 rounded-lg border bg-card p-6 md:grid-cols-6 "
    >
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          required
          value={form.name}
          placeholder="RB Torre Centro"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="host">IP ou domínio</Label>
        <Input
          id="host"
          required
          value={form.host}
          placeholder="200.100.50.1"
          onChange={(e) => setForm({ ...form, host: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="protocol">Protocolo</Label>
        <Select
          id="protocol"
          value={form.protocol}
          onValueChange={(value) => setForm({ ...form, protocol: value ?? "" })}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Http">{form.protocol}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="HTTP">Http</SelectItem>
            <SelectItem value="HTTPS">Https</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="port">Porta</Label>
        <Input
          required
          id="port"
          type="number"
          min={1}
          max={65535}
          value={form.port}
          onChange={(e) => setForm({ ...form, port: e.target.value })}
        />
      </div>
      <div className="space-y-2 md:col-span-4">
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          value={form.location}
          placeholder="Torre bairro X"
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>
      <div className="flex items-end md:col-span-2">
        <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
          {loading ? <Spinner /> : <Plus />}
          {loading ? "Cadastrando..." : "Cadastrar RB"}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground md:col-span-6">
        A verificação acessa o endereço pela internet (ex.: porta do WebFig/API
        REST). O equipamento precisa estar acessível por IP público. Fica{" "}
        {"fora do ar"} após 2 falhas seguidas.
      </p>
    </form>
  );
}
