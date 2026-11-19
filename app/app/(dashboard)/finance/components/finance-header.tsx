import { Download, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { FinanceDialogState } from "./finance-entry-dialog";

type FinanceHeaderProps = {
  setDialog: (state: FinanceDialogState | null) => void;
};

export function FinanceHeader({ setDialog }: FinanceHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-medium tracking-widest text-primary uppercase">
          Gestão do provedor
        </p>
        <h1 className="mt-1 text-3xl font-semibold">Financeiro</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="lg" variant="outline" disabled>
          <Download />
          Exportar CSV
        </Button>

        <Button
          size="lg"
          variant="outline"

          onClick={() => setDialog({ kind: "expense" })}
        >
          <Plus />
          Nova despesa
        </Button>

        <Button
          size="lg"
          disabled
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => setDialog({ kind: "charge" })}
        >
          <Plus />
          Nova cobrança
        </Button>
      </div>
    </header>
  );
}
