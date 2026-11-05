"use client";

import Image from "next/image";

import { useEffect, useMemo } from "react";
import { Camera, ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function InputPhoto({
  file,
  onChange,
}: {
  file: File | null;
  onChange: (f: File | null) => void;
}) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onChange(f);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm">
          <Label className="cursor-pointer">
            <Camera className="h-4 w-4" /> Tirar foto
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={pick}
            />
          </Label>
        </Button>
        <Button type="button" variant="outline" size="sm">
          <Label className="cursor-pointer">
            <ImagePlus className="h-4 w-4" /> Escolher arquivo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={pick}
            />
          </Label>
        </Button>
      </div>
      {url ? (
        <div className="relative inline-block">
          <Image
            src={url}
            width={150}
            height={150}
            alt="Foto da residência"
            className="max-h-64 rounded-md border object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remover foto"
            className="absolute right-2 top-2 rounded-full bg-background/90 p-1 shadow"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Nenhuma foto adicionada.
        </p>
      )}
    </div>
  );
}
