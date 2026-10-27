export const brl = (v: number | string) =>
  Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Data de fim da fidelidade, ou null se sem fidelidade. */
export function loyaltyEnd(startISO: string, months: number): Date | null {
  if (!months) return null;
  const [y = 0, m = 1, d = 1] = startISO.split("-").map(Number);
  return new Date(y, m - 1 + months, d);
}

/** Próxima data de vencimento (dia 1–28) a partir de uma data de referência. */
export function nextDueDate(dueDay: number, from: Date = new Date()): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), dueDay);
  const today = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  if (d < today) d.setMonth(d.getMonth() + 1);
  return d;
}
