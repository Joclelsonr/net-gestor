"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LocateFixed, SaveCheck, X } from "lucide-react";

import {
  formatCep,
  onlyDigits,
  formatPhone,
  formatDocument,
} from "@/lib/br-docs";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { InputPhoto } from "./input-photo";
import { customerSchema } from "../schema";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { statusTraduction } from "@/constants/status-styled";

import { createCustomer } from "../actions";

import type { CustomerType, Key } from "../schema";

const LocationMap = dynamic(
  () => import("./location-map").then((mod) => mod.LocationMap),
  {
    ssr: false,
    loading: () => <div className="h-80 w-full rounded-md border bg-muted" />,
  },
);

export function FormNewClient() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CustomerType>(customerSchema);
  const [photo, setPhoto] = useState<File | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const personType = form.personType === "PF";
  const set = (k: Key, v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function lookupCep(cep: string) {
    const d = onlyDigits(cep);
    if (d.length !== 8) return;

    try {
      const result = await fetch(`https://viacep.com.br/ws/${d}/json/`).then(
        (x) => x.json(),
      );

      if (result.erro) {
        return toast.add({ type: "error", title: "CEP não encontrado" });
      }

      setForm((p) => ({
        ...p,
        street: result.logradouro || p.street,
        district: result.bairro || p.district,
        city: result.localidade || p.city,
        state: result.uf || p.state,
      }));
    } catch {
      return toast.add({ type: "error", title: "Falha ao buscar CEP" });
    }
  }

  function useGps() {
    if (!navigator.geolocation) {
      return toast.add({
        type: "error",
        title: "Geolocalização não suportada",
      });
    }

    navigator.geolocation.getCurrentPosition(
      (p) => setCoords({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () =>
        toast.add({
          type: "error",
          title: "Não foi possível obter sua localização",
        }),
      { enableHighAccuracy: true },
    );
  }

  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const result = await createCustomer(
      {
        ...form,
        lat: String(coords?.lat),
        lng: String(coords?.lng),
      },
      photo ?? undefined,
    );

    if (result.success) {
      toast.add({ type: "success", description: result.message });
      setLoading(false);
      setForm(customerSchema);
      setPhoto(null);
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-8">
      <Section title="Identificação">
        <Field>
          <Label>Tipo</Label>
          <Select
            value={form.personType}
            onValueChange={(v) => set("personType", v ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PF">Pessoa física</SelectItem>
              <SelectItem value="PJ">Pessoa jurídica</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="name">
            {personType ? "Nome completo" : "Razão social"}
          </Label>
          <Input
            required
            id="name"
            autoComplete="off"
            value={form.name}
            placeholder="Nome do cliente"
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="cpf">{personType ? "CPF" : "CNPJ"}</Label>
          <Input
            required
            id="cpf"
            inputMode="numeric"
            autoComplete="off"
            placeholder={personType ? "000.000.000-00" : "00.000.000/0000-00"}
            value={formatDocument(form.cpf)}
            onChange={(e) => set("cpf", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="rg">{personType ? "RG" : "Inscrição estadual"}</Label>
          <Input
            id="rg"
            inputMode="numeric"
            autoComplete="off"
            value={form.rg}
            onChange={(e) => set("rg", e.target.value)}
          />
        </Field>
        {personType && (
          <Field className="mx-auto w-full">
            <Label htmlFor="birth_date">Nascimento</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger
                render={
                  <Button
                    id="date"
                    variant="outline"
                    className="justify-start font-normal"
                  >
                    {form.birthDate ? (
                      format(form.birthDate, "PPP", { locale: ptBR })
                    ) : (
                      <span>dd/mm/aaaa</span>
                    )}
                  </Button>
                }
              />
              <PopoverContent
                align="start"
                className="w-auto overflow-hidden p-0"
              >
                <Calendar
                  required
                  mode="single"
                  captionLayout="dropdown"
                  locale={ptBR}
                  selected={
                    form.birthDate ? new Date(form.birthDate) : undefined
                  }
                  defaultMonth={
                    form.birthDate ? new Date(form.birthDate) : undefined
                  }
                  onSelect={(date) => {
                    set("birthDate", date ? date.toISOString() : "");
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
        )}
      </Section>

      <Section title="Contato">
        <Field>
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="off"
            placeholder="e-mail@exemplo.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            inputMode="numeric"
            autoComplete="off"
            placeholder="(99) 99999-9999"
            value={formatPhone(form.phone)}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            required
            id="whatsapp"
            inputMode="numeric"
            autoComplete="off"
            placeholder="(99) 99999-9999"
            value={formatPhone(form.whatsapp)}
            onChange={(e) => set("whatsapp", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Endereço de instalação">
        <Field>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            inputMode="numeric"
            autoComplete="off"
            placeholder="00000-000"
            value={formatCep(form.cep)}
            onChange={(e) => set("cep", e.target.value)}
            onBlur={(e) => lookupCep(e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="street">Logradouro</Label>
          <Input
            id="street"
            autoComplete="off"
            value={form.street}
            placeholder="Rua, Avenida, Travessa..."
            onChange={(e) => set("street", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            inputMode="numeric"
            autoComplete="off"
            value={form.number}
            placeholder="169"
            onChange={(e) => set("number", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            autoComplete="off"
            value={form.complement}
            placeholder="Apartamento, Bloco, Casa..."
            onChange={(e) => set("complement", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="district">Bairro</Label>
          <Input
            id="district"
            autoComplete="off"
            value={form.district}
            placeholder="Vila, Jardim, Centro..."
            onChange={(e) => set("district", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            autoComplete="off"
            value={form.city}
            placeholder="Tucuruí"
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="state">UF</Label>
          <Input
            id="state"
            autoComplete="off"
            maxLength={2}
            value={form.state}
            placeholder="PA"
            onChange={(e) => set("state", e.target.value.toUpperCase())}
          />
        </Field>

        <div className="space-y-3 md:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Label>Localização no mapa</Label>
              <p className="text-xs text-muted-foreground">
                {coords
                  ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
                  : "Clique no mapa, arraste o marcador ou use o botão."}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={useGps}
              >
                <LocateFixed className="h-4 w-4" /> Salvar localização
              </Button>
            </div>
          </div>

          <LocationMap
            lat={coords?.lat ?? null}
            lng={coords?.lng ?? null}
            onChange={(lat, lng) => setCoords({ lat, lng })}
          />
        </div>
        <div className="space-y-2 md:col-span-3">
          <Label>Foto da residência</Label>
          <InputPhoto file={photo} onChange={setPhoto} />
        </div>
      </Section>

      <Section title="Situação">
        <Field>
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(value) => set("status", value ?? "")}
          >
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="Selecione o status">
                {statusTraduction[form.status]}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WAITING">Aguardando</SelectItem>
              <SelectItem value="ACTIVE">Ativo</SelectItem>
              <SelectItem value="SUSPENDED">Suspenso</SelectItem>
              <SelectItem value="CANCELED">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field className="space-y-2 md:col-span-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
      </Section>

      <div className="flex justify-between md:justify-end gap-3">
        <Link href="/clients">
          <Button type="button" variant="outline" size="lg">
            <X />
            Cancelar
          </Button>
        </Link>
        <Button
          size="lg"
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 "
        >
          {loading ? <Spinner /> : <SaveCheck />}
          {loading ? "Salvando..." : "Salvar cliente"}
        </Button>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-lg border bg-card p-6">
      <legend className="px-2 font-display text-sm font-semibold uppercase tracking-wider text-primary">
        {title}
      </legend>
      <div className="grid gap-4 md:grid-cols-3">{children}</div>
    </fieldset>
  );
}
