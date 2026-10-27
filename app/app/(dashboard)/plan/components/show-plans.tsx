import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

import { getPlans } from "../actions";

export async function ShowPlans() {
  const plans = await getPlans();

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {!plans?.length && (
        <p className="text-muted-foreground">Nenhum plano cadastrado.</p>
      )}
      {plans?.map((plan) => (
        <div key={plan.id} className={`rounded-lg border bg-card p-5`}>
          <div className="flex items-start justify-between gap-2">
            <h2 className="font-display text-lg font-semibold">{plan.name}</h2>
            <Badge>{plan.active ? "Ativo" : "Inativo"}</Badge>
          </div>
          <p className="mt-3 font-display text-4xl font-bold">
            {plan.downloadMbps}
            <span className="text-base font-medium text-muted-foreground">
              {" "}
              Mbps
            </span>
          </p>
          <p className="mt-1 flex gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ArrowDown className="h-3 w-3" />
              {plan.downloadMbps}
            </span>
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              {plan.uploadMbps}
            </span>
          </p>
          {
            <p className="mt-2 text-sm text-muted-foreground">
              {plan.description}
            </p>
          }
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-semibold text-primary">
              {plan.price}
              <span className="text-xs text-muted-foreground">/mês</span>
            </span>
            <Button variant="ghost" size="sm">
              {plan.active ? "Desativar" : "Ativar"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
