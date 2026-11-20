import "server-only";

import { storage } from "@/lib/storage";
import { randomUUID } from "node:crypto";

import { TYPES_IMAGE } from "@/constants/images";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImage(file: File, addressId: string) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato de imagem não permitido");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("A imagem deve ter no máximo 5 MB");
  }

  const extension = TYPES_IMAGE[file.type];
  if (!extension) {
    throw new Error("Extensão de imagem inválida");
  }

  const key = `addresses/${addressId}/${randomUUID()}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  await storage.upload(key, buffer, {
    contentType: file.type,
  });

  return {
    key,
    fileName: `${randomUUID()}.${extension}`,
    contentType: file.type,
    size: file.size,
  };
}
