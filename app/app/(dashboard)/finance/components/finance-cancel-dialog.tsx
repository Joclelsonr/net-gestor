import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type FinanceCancelData = {
  id: string;
  expense: boolean;
  description: string;
};
type FinanceCancelDialogProps = { loading?: boolean };

export function FinanceCancelDialog({ loading }: FinanceCancelDialogProps) {
  const [cancel, setCancel] = useState<FinanceCancelData | null>(null);

  function onConfirm() {}

  return (
    <AlertDialog
      open={Boolean(cancel)}
      onOpenChange={(open) => {
        if (!open && !loading) setCancel(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar lançamento?</AlertDialogTitle>

          <AlertDialogDescription>
            {cancel?.description}. O lançamento permanecerá no histórico como
            cancelado.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Voltar</AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();
              if (!cancel) return;
              onConfirm();
            }}
          >
            {loading ? "Cancelando..." : "Confirmar cancelamento"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
