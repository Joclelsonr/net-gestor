"use client";

import Link from "next/link";

import { useState } from "react";
import { Link2, Router, Undo2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { CustomAlertDialog } from "@/components/custom-alert-dialog";

import { linkCustomerEquipment, unlinkCustomerEquipment } from "../actions";

import type { Inventory } from "@/generated/prisma/client";

type CustomerEquipmentProps = {
  inventorys: Inventory[];
  customerId: string;
};

export function CustomerEquipment({
  inventorys,
  customerId,
}: CustomerEquipmentProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(
    null,
  );
  const [mac, setMac] = useState("");

  async function link(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!mac.trim()) return;

    setLoading(true);

    const result = await linkCustomerEquipment(customerId, mac.trim());
    if (result.success) {
      toast.add({
        type: "success",
        description: result.message,
      });
      setMac("");
      setOpen(false);
    } else {
      toast.add({
        type: "error",
        description: result.message,
      });
    }
    setLoading(false);
  }

  // async function unlink(id: string) {
  //   setLoading(true);

  //   if(!isOpenAlert) return

  //   const result = await unlinkCustomerEquipment(customerId, id);
  //   if (result.success) {
  // setIsOpenAlert(false);
  // setSelectedEquipment(null);
  //     toast.add({
  //       type: "success",
  //       description: result.message,
  //     });
  //   } else {
  //     toast.add({
  //       type: "error",
  //       description: result.message,
  //     });
  //   }
  //   setLoading(true);
  // }

  function unlink(id: string) {
    setSelectedEquipment(id);
    setIsOpenAlert(true);
  }

  async function confirmUnlink() {
    if (!selectedEquipment || loading) return;

    setLoading(true);

    try {
      const result = await unlinkCustomerEquipment(
        customerId,
        selectedEquipment,
      );

      toast.add({
        type: result.success ? "success" : "error",
        description: result.message,
      });

      if (result.success) {
        setIsOpenAlert(false);
        setSelectedEquipment(null);
      }
    } catch {
      toast.add({
        type: "error",
        description: "Não foi possível devolver o equipamento.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-8 border-t pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-semibold">
          <Router className="text-primary" />
          Equipamentos do cliente
        </h2>
        <Button
          size="lg"
          onClick={() => setOpen(!open)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Link2 />
          Vincular roteador
        </Button>
      </div>
      {open && (
        <form onSubmit={link} className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <Label htmlFor="mac">MAC do roteador</Label>
            <Input
              id="mac"
              required
              placeholder="AA:BB:CC:DD:EE:FF"
              disabled={loading}
              value={mac}
              onChange={(e) => setMac(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !mac.trim()}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {loading ? "Vinculando..." : "Vincular por MAC"}
          </Button>
          <Link href="/stock">
            <Button variant="ghost">Abrir estoque</Button>
          </Link>
        </form>
      )}

      {inventorys?.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Nenhum roteador vinculado.
        </p>
      )}
      <div className="mt-4 space-y-3">
        {inventorys?.map((item) => (
          <article
            key={item.id}
            className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4"
          >
            <Router className="h-6 w-6 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold wrap-break-word">{item.name}</h3>
              <p className="text-sm text-muted-foreground">
                {[item.brand, item.model].filter(Boolean).join(" · ")}
              </p>
              <p className="font-mono text-xs break-all">{item.mac}</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              disabled={loading}
              onClick={() => unlink(item.id)}
            >
              <Undo2 />
              Devolver
            </Button>
          </article>
        ))}
      </div>

      <CustomAlertDialog
        open={isOpenAlert}
        setIsOpen={setIsOpenAlert}
        description="O equipamento será desvinculado deste cliente e retornará ao estoque como disponível. Deseja continuar?"
        loading={loading}
        onConfirm={confirmUnlink}
      />
    </section>
  );
}
