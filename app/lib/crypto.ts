import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getEncryptionKey(): Buffer {
  const key = process.env.PPPOE_ENCRYPTION_KEY;

  if (!key) {
    throw new Error("PPPOE_ENCRYPTION_KEY não configurada");
  }

  const buffer = Buffer.from(key, "hex");

  if (buffer.length !== KEY_LENGTH) {
    throw new Error("A chave deve possuir 32 bytes (64 caracteres hex)");
  }

  return buffer;
}

export function encryptPassword(password: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(password, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
}

export function decryptPassword(encryptedPassword: string): string {
  const [ivHex, authTagHex, encryptedHex] = encryptedPassword.split(":");

  if (!ivHex || !authTagHex || encryptedHex === undefined) {
    throw new Error("Formato de senha criptografada inválido");
  }

  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");

  if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error("Dados criptografados inválidos");
  }

  const decipher = createDecipheriv(ALGORITHM, getEncryptionKey(), iv);

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
