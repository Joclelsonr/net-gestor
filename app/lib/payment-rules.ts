import { PaymentStatus } from "@/generated/prisma/enums";

export function paymentState(
  payment: { status: string; dueDate: Date },
  today: Date,
) {
  if (payment.status === PaymentStatus.PAID) return "Pago";
  if (payment.status === PaymentStatus.ONTIME) return "Em dia";
  if (payment.status === PaymentStatus.CANCELED) return "Cancelado";
  return payment.dueDate < today ? "Atrasado" : "Pendente";
}

// 11/11/2026, 23:45
export const today = new Date().toLocaleDateString("pt-BR", {
  timeZone: "America/Sao_Paulo",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});