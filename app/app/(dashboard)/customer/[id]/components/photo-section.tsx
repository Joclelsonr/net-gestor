"use client";

import Image from "next/image";

import { useState } from "react";
import { toast } from "@/components/ui/toast";

import { Button } from "@/components/ui/button";
import { InputPhoto } from "@/components/input-photo";

import { updateCustomerAddressPhoto } from "../actions";

import type { Address, Customer } from "@/generated/prisma/client";

type PhotoProps = { customer: (Customer & { address: Address[] }) | null };

export function PhotoSection({ customer }: PhotoProps) {
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const address = customer?.address?.[0];

  async function savePhoto() {
    if (!address?.id || !newPhoto) return;

    setLoading(true);

    const result = await updateCustomerAddressPhoto(
      newPhoto,
      address.id,
      customer?.id ?? "",
    );

    if (result.success) {
      toast.add({ type: "success", description: result.message });
      setNewPhoto(null);
    } else {
      toast.add({ type: "error", description: result.message });
    }

    setLoading(false);
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-5">
      <h2 className="font-display text-sm font-semibold tracking-wider text-primary uppercase">
        Foto da residência
      </h2>
      {customer?.address?.map((address, index) => (
        <div key={address.id ?? index}>
          {address.imageKey && !newPhoto && (
            <Image
              width={250}
              height={200}
              unoptimized
              alt="Residência do cliente"
              src={`/api/addresses/${address.id}/photo`}
              className="max-h-64 rounded-md border object-cover"
            />
          )}
        </div>
      ))}
      <InputPhoto file={newPhoto} onChange={setNewPhoto} />
      {newPhoto && (
        <Button
          size="sm"
          onClick={savePhoto}
          className="bg-blue-500 hover:bg-blue-600"
        >
          {loading ? "Salvando..." : "Salvar foto"}
        </Button>
      )}
    </div>
  );
}
