"use client";

import Link from "next/link";

import { Suspense, useState } from "react";

import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, LocateFixed, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatCep,
  formatDocument,
  formatPhone,
  onlyDigits,
} from "@/lib/br-docs";
import { LocationMap } from "./components/location-map";

const empty = {
  person_type: "PF",
  name: "",
  document: "",
  rg_ie: "",
  birth_date: "",
  email: "",
  phone: "",
  whatsapp: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  status: "prospecto",
  notes: "",
};
type Form = typeof empty;
type Key = keyof Form;

export default function Page() {
  const [f, setF] = useState<Form>(empty);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const pf = f.person_type === "PF";
  const set = (k: Key, v: string) => setF((p) => ({ ...p, [k]: v }));
  const field = (
    k: Key,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
    span = "",
  ) => (
    <div className={`space-y-2 ${span}`}>
      <Label htmlFor={k}>{label}</Label>
      <Input
        id={k}
        value={f[k]}
        onChange={(e) => set(k, e.target.value)}
        {...props}
      />
    </div>
  );

  async function geocode(q: string): Promise<boolean> {
    const r = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(q)}`,
    ).then((x) => x.json());
    if (!r?.[0]) return false;
    setCoords({ lat: Number(r[0].lat), lng: Number(r[0].lon) });
    return true;
  }

  async function locateAddress(): Promise<void> {
    if (!f.city)
      return void toast.add({
        type: "error",
        title: "Informe a cidade e o estado",
      });
    setLocating(true);
    try {
      const full = [
        f.street && `${f.street} ${f.number}`.trim(),
        f.district,
        f.city,
        f.state,
      ]
        .filter(Boolean)
        .join(", ");
      const ok =
        (await geocode(full)) ||
        (await geocode(
          [f.street, f.city, f.state].filter(Boolean).join(", "),
        )) ||
        (await geocode(`${f.city}, ${f.state}`));
      if (!ok)
        toast.add({
          type: "error",
          title: "Não foi possível localizar o endereço",
        });
      else
        toast.add({
          type: "success",
          title: "Localização encontrada — ajuste o marcador se necessário",
        });
    } catch {
      toast.add({
        type: "error",
        title: "Falha ao buscar endereço",
      });
    } finally {
      setLocating(false);
    }
  }

  async function lookupCep(cep: string): Promise<void> {
    const d = onlyDigits(cep);
    if (d.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${d}/json/`).then((x) =>
        x.json(),
      );
      if (res.erro)
        return toast.add({ type: "error", title: "CEP não encontrado" });
      setF((p) => ({
        ...p,
        street: res.logradouro || p.street,
        district: res.bairro || p.district,
        city: res.localidade || p.city,
        state: res.uf || p.state,
      }));
      if (!coords) {
        await geocode(
          [res.logradouro, res.localidade, res.uf].filter(Boolean).join(", "),
        ).catch(() => false);
      }
    } catch {
      /* ignora falha de rede */
    }
  }

  function useGps() {
    if (!navigator.geolocation)
      return toast.add({
        type: "error",
        title: "Geolocalização não suportada",
      });
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

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    console.log("submit", f, coords);
  }

  return (
    <div className="mx-auto w-full p-6 md:p-10">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Clientes
      </Link>
      <h1 className="mt-2 text-3xl font-semibold">Novo cliente</h1>

      <form onSubmit={submit} className="mt-8 space-y-8">
        <Section title="Identificação">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={f.person_type}
              onValueChange={(v: string) => set("person_type", v)}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PF">Pessoa física</SelectItem>
                <SelectItem value="PJ">Pessoa jurídica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {field(
            "name",
            pf ? "Nome completo" : "Razão social",
            { required: true, autoComplete: "off" },
            "md:col-span-2",
          )}
          <div className="space-y-2">
            <Label htmlFor="document">{pf ? "CPF" : "CNPJ"}</Label>
            <Input
              id="document"
              required
              autoComplete="off"
              value={formatDocument(f.document)}
              onChange={(e) => set("document", e.target.value)}
            />
          </div>
          {field("rg_ie", pf ? "RG" : "Inscrição estadual")}
          {pf && field("birth_date", "Nascimento", { type: "date" })}
        </Section>

        <Section title="Contato">
          {field("email", "E-mail", { type: "email" })}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              value={formatPhone(f.phone)}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={formatPhone(f.whatsapp)}
              onChange={(e) => set("whatsapp", e.target.value)}
            />
          </div>
        </Section>

        <Section title="Endereço de instalação">
          <div className="space-y-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={formatCep(f.cep)}
              onChange={(e) => set("cep", e.target.value)}
              onBlur={(e) => lookupCep(e.target.value)}
            />
          </div>

          {field("street", "Logradouro", {}, "md:col-span-2")}
          {field("number", "Número")}
          {field("complement", "Complemento")}
          {field("district", "Bairro")}
          {field("city", "Cidade", {}, "md:col-span-2")}
          {field("state", "UF", { maxLength: 2 })}

          <div className="space-y-3 md:col-span-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Label>Localização no mapa</Label>
                <p className="text-xs text-muted-foreground">
                  {coords
                    ? `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
                    : "Clique no mapa, arraste o marcador ou use os botões."}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={locateAddress}
                  disabled={locating}
                >
                  <MapPin className="h-4 w-4" />{" "}
                  {locating ? "Buscando..." : "Localizar endereço"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={useGps}
                >
                  <LocateFixed className="h-4 w-4" /> Minha localização
                </Button>
              </div>
            </div>
            {/* <ClientOnly fallback={<div className="h-80 rounded-md border bg-muted" />}> */}
            <Suspense
              fallback={<div className="h-80 rounded-md border bg-muted" />}
            >
              <LocationMap
                lat={coords?.lat ?? null}
                lng={coords?.lng ?? null}
                onChange={(lat, lng) => setCoords({ lat, lng })}
              />
            </Suspense>
            {/* </ClientOnly> */}
          </div>
        </Section>

        <Section title="Situação">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={f.status}
              onValueChange={(v: string) => set("status", v)}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prospecto">Prospecto</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="suspenso">Suspenso</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={f.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
        </Section>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild>
            <Link href="/clients">Cancelar</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Salvando..." : "Salvar cliente"}
          </Button>
        </div>
      </form>
    </div>
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
