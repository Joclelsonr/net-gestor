import Link from "next/link";

import { brl } from "@/lib/billing";
import { formatDate } from "@/lib/br-docs";
import { ArrowLeft, Pencil } from "lucide-react";

import { FormPlan } from "./form-plan";
import { Badge } from "@/components/ui/badge";
import { PhotoSection } from "./photo-section";
import { PppoeSection } from "./pppoe-section";
import { Button } from "@/components/ui/button";
import { ContactSection } from "./contact-section";
import { CustomerPayments } from "./customer-payments";
import { CustomerEquipment } from "./customer-equipament";

import { statusStyle, statusTraduction } from "@/constants/status-styled";

import {
  getPlans,
  getPppooe,
  getPayments,
  getCustomerById,
  getInventoryCustomerById,
} from "../actions";

type CustomerDetailsProps = { params: Promise<{ id: string }> };

export async function CustomerDetails({ params }: CustomerDetailsProps) {
  const { id } = await params;

  const [customer, pppoe, plans, payments, inventorys] = await Promise.all([
    getCustomerById(id),
    getPppooe(id),
    getPlans(),
    getPayments(id),
    getInventoryCustomerById(id),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/customer"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft /> Clientes
        </Link>
        <Link href={`/customer/${customer?.id}/edit`}>
          <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
            <div className="ml-auto flex items-center gap-2">
              <Pencil /> Editar
            </div>
          </Button>
        </Link>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold md:text-3xl">{customer?.name}</h1>
        <Badge
          variant="outline"
          className={statusStyle[customer?.status ?? "WAITING"]}
        >
          {statusTraduction[customer?.status ?? "WAITING"]}
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

      <PppoeSection pppoe={pppoe} customerId={customer?.id ?? ""} />

      <CustomerEquipment
        inventorys={inventorys}
        customerId={customer?.id ?? ""}
      />

      <CustomerPayments payments={payments} customerId={customer?.id ?? ""} />

      <FormPlan plans={plans} customerId={customer?.id ?? ""} />

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
                  Desde {formatDate(subscription.startDate)} · Vence todo dia{" "}
                  {new Date(subscription.dueDate).getDate()}
                </p>
              </div>
              <div className="md:text-right">
                <p className="font-semibold text-primary">
                  {brl(Number(subscription.price))}
                </p>
                {subscription.status === "ACTIVE" && (
                  <p className="text-xs text-muted-foreground">
                    Próx. venc.: {formatDate(subscription.dueDate)}
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
