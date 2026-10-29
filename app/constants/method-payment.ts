export type MethodPayment = {
  id: number;
  name: string;
  value: string;
};

export const methodPayment: MethodPayment[] = [
  {
    id: 1,
    name: "Dinheiro",
    value: "CASH",
  },
  {
    id: 2,
    name: "Cartão de Crédito",
    value: "CREDIT_CARD",
  },
  {
    id: 3,
    name: "Cartão de Débito",
    value: "DEBIT_CARD",
  },
  {
    id: 4,
    name: "Pix",
    value: "PIX",
  },
  {
    id: 5,
    name: "Transferência Bancária",
    value: "BANK_TRANSFER",
  },
  {
    id: 6,
    name: "Boleto Bancário",
    value: "BANK_SLIP",
  },
];
