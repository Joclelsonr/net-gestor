import "server-only";

import { Files } from "files-sdk";
import { neon } from "files-sdk/neon";

const bucket = process.env.NEON_STORAGE_BUCKET;

if (!bucket) {
  throw new Error("NEON_STORAGE_BUCKET não configurado");
}

export const storage = new Files({ adapter: neon({ bucket }) });
