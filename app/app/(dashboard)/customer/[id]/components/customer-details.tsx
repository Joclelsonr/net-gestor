import Link from "next/link";

import { brl } from "@/lib/billing";
import { ArrowLeft } from "lucide-react";

import { FormPlan } from "./form-plan";
import { Badge } from "@/components/ui/badge";
import { PhotoSection } from "./photo-section";
import { PppoeSection } from "./pppoe-section";
import { ContactSection } from "./contact-section";

import { statusStyle, statusTraduction } from "@/constants/status-styled";

import { getCustomerById, getPlans, getPppooe } from "../actions";

type CustomerDetailsProps = { params: Promise<{ id: string }> };

export async function CustomerDetails({ params }: CustomerDetailsProps) {
  const { id } = await params;

  const [customer, pppoe, plans] = await Promise.all([
    getCustomerById(id),
    getPppooe(id),
    getPlans(),
  ]);

  return (
    <div>
      <Link
        href="/customer"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Clientes
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold">{customer?.name}</h1>
        <Badge variant="outline" className={statusStyle[customer?.status]}>
          {statusTraduction[customer?.status]}
        </Badge>
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        ID: {customer?.id}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* Contato */}
        <ContactSection customer={customer} />
        {/* Foto */}
        <PhotoSection customer={customer} />
      </div>

      <PppoeSection pppoe={pppoe} customerId={customer?.id} />

      <FormPlan plans={plans} customerId={customer?.id} />

      <div className="mt-4 space-y-3">
        {customer?.subscriptions && !customer?.subscriptions.length && (
          <p className="text-sm text-muted-foreground">
            Nenhum plano vinculado.
          </p>
        )}
        {customer?.subscriptions?.map((subscription) => {
          const planActive = plans.find(
            (plan) => plan.id === subscription.planId,
          );

          return (
            <div
              key={subscription.id}
              className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4"
            >
              <div className="min-w-48 flex-1">
                <p className="font-semibold">
                  {planActive?.name}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    · {planActive?.downloadMbps}/{planActive?.uploadMbps} Mbps
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Desde{" "}
                  {new Date(subscription.createdAt).toLocaleDateString(
                    "pt-BR",
                    {
                      timeZone: "America/Sao_Paulo",
                    },
                  )}{" "}
                  · Vence todo dia {new Date(subscription.dueDate).getDate()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-primary">
                  {brl(Number(subscription.price))}
                </p>
                {subscription.status === "ACTIVE" && (
                  <p className="text-xs text-muted-foreground">
                    Próx. venc.:{" "}
                    {new Date(subscription.dueDate).toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
