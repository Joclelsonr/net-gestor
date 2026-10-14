/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import dynamic from "next/dynamic";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LocateFixed } from "lucide-react";

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
import { empty } from "../schema";
import { InputPhoto } from "./input-photo";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

import type { Form, Key } from "../schema";

const LocationMap = dynamic(
  () => import("./location-map").then((mod) => mod.LocationMap),
  {
    ssr: false,
    loading: () => <div className="h-80 w-full rounded-md border bg-muted" />,
  },
);

export function FormNewClient() {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [photo, setPhoto] = useState<File | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const pf = form.person_type === "PF";
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

  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    console.log("submit", form, coords, photo);
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-8">
      <Section title="Identificação">
        <Field>
          <Label>Tipo</Label>
          <Select
            value={form.person_type}
            onValueChange={(v: any) => set("person_type", v)}
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
          <Label htmlFor="name">{pf ? "Nome completo" : "Razão social"}</Label>
          <Input
            required
            id="name"
            value={form.name}
            placeholder="Nome do cliente"
            autoComplete="off"
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="document">{pf ? "CPF" : "CNPJ"}</Label>
          <Input
            required
            id="document"
            autoComplete="off"
            placeholder={pf ? "000.000.000-00" : "00.000.000/0000-00"}
            value={formatDocument(form.document)}
            onChange={(e) => set("document", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="rg_ie">{pf ? "RG" : "Inscrição estadual"}</Label>
          <Input
            id="rg_ie"
            autoComplete="off"
            value={form.rg_ie}
            onChange={(e) => set("rg_ie", e.target.value)}
          />
        </Field>
        {pf && (
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
                    {form.birth_date ? (
                      format(form.birth_date, "PPP", { locale: ptBR })
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
                  mode="single"
                  captionLayout="dropdown"
                  locale={ptBR}
                  selected={
                    form.birth_date ? new Date(form.birth_date) : undefined
                  }
                  defaultMonth={
                    form.birth_date ? new Date(form.birth_date) : undefined
                  }
                  onSelect={(date) => {
                    set("birth_date", date ? date.toISOString() : "");
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
            placeholder="e-mail@exemplo.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            placeholder="(99) 99999-9999"
            value={formatPhone(form.phone)}
            onChange={(e) => set("phone", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            required
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
            value={form.street}
            placeholder="Rua, Avenida, Travessa..."
            onChange={(e) => set("street", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            value={form.number}
            placeholder="169"
            onChange={(e) => set("number", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            value={form.complement}
            placeholder="Apartamento, Bloco, Casa..."
            onChange={(e) => set("complement", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="district">Bairro</Label>
          <Input
            id="district"
            value={form.district}
            placeholder="Vila, Jardim, Centro..."
            onChange={(e) => set("district", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={form.city}
            placeholder="Tucuruí"
            onChange={(e) => set("city", e.target.value)}
          />
        </Field>
        <Field>
          <Label htmlFor="state">UF</Label>
          <Input
            id="state"
            maxLength={2}
            value={form.state}
            placeholder="PA"
            onChange={(e) => set("state", e.target.value)}
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
            onValueChange={(v: any) => set("status", v)}
          >
            <SelectTrigger className="w-full md:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aguardando">Aguardando</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="suspenso">Suspenso</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
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

      <div className="flex justify-end gap-3">
        <Link href="/clients">
          <Button type="button" variant="outline" size="lg">
            Cancelar
          </Button>
        </Link>
        <Button
          size="lg"
          type="submit"
          disabled={saving}
          className="bg-blue-500 hover:bg-blue-600 "
        >
          {saving ? "Salvando..." : "Salvar cliente"}
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
