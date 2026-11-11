import { inventoryStatuses } from "@/constants/inventory-status";

type Snapshot = Record<string, unknown>;

export function normalizeMac(value: string) {
  const hex = value
    .trim()
    .replace(/[:.\-]/g, "")
    .toUpperCase();
  return /^[0-9A-F]{12}$/.test(hex)
    ? (hex.match(/.{2}/g)?.join(":") ?? "")
    : "";
}

export function padronizarMac(mac: string): string {
  const hexadecimal = mac.replace(/[:-]/g, "");

  if (!/^[\da-fA-F]{12}$/.test(hexadecimal)) {
    throw new Error("Endereço MAC inválido");
  }

  return hexadecimal.toUpperCase().match(/.{2}/g)!.join(":");
}

export function formatValue(field: string, value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "Não informado";
  }

  if (field === "status") {
    return inventoryStatuses[String(value)] ?? String(value);
  }

  if (field === "category") {
    const categories: Record<string, string> = {
      ROUTER: "Roteador",
      EQUIPAMENT: "Equipamento",
      MATERIAL: "Material",
    };

    return categories[String(value)] ?? String(value);
  }

  if (field === "customerId") {
    return value ? "Vinculado a um cliente" : "Sem vínculo";
  }

  if (typeof value === "boolean") {
    return value ? "Sim" : "Não";
  }

  if (field === "quantity" || field === "minimumStock") {
    return Number(value).toLocaleString("pt-BR");
  }

  return String(value);
}

export function getRecord(value: unknown): Snapshot {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Snapshot;
  }

  return {};
}
