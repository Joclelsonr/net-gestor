"use client";

import Link from "next/link";
import Image from "next/image";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { InputPhoto } from "../../new/components/input-photo";

import type { Address, Customer } from "@/generated/prisma/client";

type PhotoProps = { customer: Customer & { address: Address[] } };

export function PhotoSection({ customer }: PhotoProps) {
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  async function savePhoto() {
    //     if (!newPhoto) return;
    //     const path = `${id}/${Date.now()}.${newPhoto.name.split(".").pop() || "jpg"}`;
    //     const up = await supabase.storage
    //       .from("residence-photos")
    //       .upload(path, newPhoto, { contentType: newPhoto.type });
    //     if (up.error) return void toast.error("Erro ao enviar a foto");
    //     const { error } = await supabase
    //       .from("customers")
    //       .update({ residence_photo_path: path })
    //       .eq("id", id);
    //     if (error) return void toast.error("Erro ao salvar a foto");
    //     setNewPhoto(null);
    //     toast.success("Foto atualizada");
    //     qc.invalidateQueries({ queryKey: ["customer", id] });
  }

  return (
    <div className="space-y-3 rounded-lg border bg-card p-5">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-primary">
        Foto da residência
      </h2>
      {customer?.address?.map((address, index) => (
        <div key={address.id ?? index}>
          {address.googleDriveUrl && !newPhoto && (
            <Image
              width={150}
              height={150}
              src={address.googleDriveUrl}
              alt="Residência do cliente"
              className="max-h-64 rounded-md border object-cover"
            />
          )}
          <p className="text-muted-foreground text-sm ">
            Não consegue ver a imagem?{" "}
            <Link href={address?.googleDriveUrl ?? ''} target="_blank">
              {" "}
              <span className="underline">acesse aqui</span>
            </Link>
          </p>
        </div>
      ))}
      <InputPhoto file={newPhoto} onChange={setNewPhoto} />
      {newPhoto && (
        <Button
          size="sm"
          onClick={savePhoto}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Salvar foto
        </Button>
      )}
    </div>
  );
}
