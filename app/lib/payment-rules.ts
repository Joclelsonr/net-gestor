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
