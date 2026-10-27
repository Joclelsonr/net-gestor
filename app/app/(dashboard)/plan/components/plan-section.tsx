"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

import { FormPlan } from "./form-plan";
import { Button } from "@/components/ui/button";

export function PlanSection() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Catálogo
          </p>

          <h1 className="text-3xl font-semibold">Planos</h1>
        </div>

        <Button
          size="lg"
          onClick={() => setOpen((current) => !current)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {open ? <X /> : <Plus />}
          {open ? "Cancelar" : "Novo plano"}
        </Button>
      </div>

      {open && <FormPlan />}
    </>
  );
}
