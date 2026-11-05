"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LocateFixed, SaveCheck, X } from "lucide-react";
import { statusTraduction } from "@/constants/status-styled";
import { formatCep, formatPhone, onlyDigits } from "@/lib/br-docs";

import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { LocationMap } from "@/components/location-map";
import { CustomCalendar } from "@/components/custom-calendar";

import { updateCustomer } from "../actions";

import type { CustomerType } from "../../../new/schema";
import type { Address, Customer } from "@/generated/prisma/client";

type EditFormProps = {
  customer: (Customer & { address: Address[] }) | null;
};

export function EditForm({ customer }: EditFormProps) {
  const route = useRouter();
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [form, setForm] = useState<CustomerType>({
    personType: customer?.personType ?? "PF",
    name: customer?.name ?? "",
    cpf: customer?.cpf ?? "",
    rg: customer?.rg ?? "",
    birthDate: customer?.birthDate
      ? customer.birthDate.toISOString().split("T")[0]
      : "",
    email: customer?.email ?? "",
    phone: customer?.phone ?? "",
    whatsapp: customer?.whatsapp ?? "",
    cep: customer?.address[0]?.cep ?? "",
    street: customer?.address[0]?.street ?? "",
    number: customer?.address[0]?.number ?? "",
    complement: customer?.address[0]?.complement ?? "",
    district: customer?.address[0]?.district ?? "",
    city: customer?.address[0]?.city ?? "",
    state: customer?.address[0]?.state ?? "",
    lat: customer?.address[0]?.lat ?? "",
    lng: customer?.address[0]?.lng ?? "",
    status: customer?.status ?? "WAITING",
    notes: customer?.notes ?? "",
  });

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

  async function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const result = await updateCustomer(customer?.id ?? "", {
      ...form,
      lat:
        coords?.lat != null
          ? String(coords.lat)
          : String(customer?.address[0]?.lat ?? ""),
      lng:
        coords?.lng != null
          ? String(coords.lng)
          : String(customer?.address[0]?.lng ?? ""),
    });

    if (result.success) {
      toast.add({ type: "success", description: result.message });
      setLoading(false);
      route.push(`/customer/${customer?.id}`);
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-8">
      <Section title="Identificação">
        <Field className="md:col-span-1">
          <Label>Tipo</Label>
          <Input
            value={form.personType ? "Pessoa Física" : "Pessoa Jurídica"}
            readOnly
          />
        </Field>
        <Field className="md:col-span-2">
          <Label htmlFor="name">
            {form.personType ? "Nome completo" : "Razão social"}
          </Label>
          <Input
            required
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field>
          <Label>{form.personType ? "CPF" : "CNPJ"}</Label>
          <Input required value={form.cpf} readOnly />
          <p className="text-xs text-muted-foreground">
            O {form.personType ? "CPF" : "CNPJ"} não pode ser alterado.
          </p>
        </Field>
        <Field>
          <Label htmlFor="rg">
            {form.personType ? "RG" : "Inscrição estadual"}
          </Label>
          <Input
            id="rg"
            inputMode="numeric"
            autoComplete="off"
            value={form.rg}
            onChange={(e) => setForm({ ...form, rg: e.target.value })}
          />
        </Field>
        {form.personType && (
          <Field className="mx-auto w-full">
            <CustomCalendar
              id="birthDate"
              label="Nascimento"
              value={form.birthDate}
              placeholder="dd/mm/aaaa"
              onChange={(date) => setForm({ ...form, birthDate: date })}
            />
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
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        <Field>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            inputMode="numeric"
            autoComplete="off"
            value={formatPhone(form.phone)}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </Field>
        <Field>
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            required
            id="whatsapp"
            inputMode="numeric"
            autoComplete="off"
            value={formatPhone(form.whatsapp)}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
          />
        </Field>
      </Section>

      <Section title="Endereço">
        <Field>
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            inputMode="numeric"
            autoComplete="off"
            placeholder="00000-000"
            value={formatCep(form.cep)}
            onChange={(e) => setForm({ ...form, cep: e.target.value })}
            onBlur={(e) => lookupCep(e.target.value)}
          />
        </Field>
        <Field className="md:col-span-2">
          <Label htmlFor="street">Logradouro</Label>
          <Input
            id="street"
            autoComplete="off"
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
          />
        </Field>
        <Field>
          <Label htmlFor="number">Número</Label>
          <Input
            id="number"
            inputMode="numeric"
            autoComplete="off"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
        </Field>
        <Field>
          <Label htmlFor="complement">Complemento</Label>
          <Input
            id="complement"
            autoComplete="off"
            value={form.complement}
            onChange={(e) => setForm({ ...form, complement: e.target.value })}
          />
        </Field>
        <Field>
          <Label htmlFor="district">Bairro</Label>
          <Input
            id="district"
            autoComplete="off"
            value={form.district}
            onChange={(e) => setForm({ ...form, district: e.target.value })}
          />
        </Field>
        <Field className="md:col-span-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            autoComplete="off"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
        </Field>
        <Field>
          <Label htmlFor="state">UF</Label>
          <Input
            id="state"
            maxLength={2}
            autoComplete="off"
            value={form.state}
            onChange={(e) =>
              setForm({ ...form, state: e.target.value.toUpperCase() })
            }
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
                <LocateFixed /> Salvar localização
              </Button>
            </div>
          </div>

          <LocationMap
            lat={coords?.lat ?? null}
            lng={coords?.lng ?? null}
            onChange={(lat, lng) => setCoords({ lat, lng })}
          />
        </div>
      </Section>

      <Section title="Situação">
        <Field>
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(value) => setForm({ ...form, status: value ?? "" })}
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
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
        </Field>
      </Section>

      <div className="flex justify-between gap-3 md:justify-end">
        <Link
          href={`/customer/${customer?.id}`}
          className="flex-1 md:flex-none"
        >
          <Button type="button" variant="outline" size="lg">
            <X />
            Cancelar
          </Button>
        </Link>
        <Button
          size="lg"
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {loading ? <Spinner /> : <SaveCheck />}
          {loading ? "Salvando..." : "Editar cliente"}
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
      <legend className="font-display px-2 text-sm font-semibold tracking-wider text-primary uppercase">
        {title}
      </legend>
      <div className="grid gap-4 md:grid-cols-3">{children}</div>
    </fieldset>
  );
}
