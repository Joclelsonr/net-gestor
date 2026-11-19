export const expenseCategories: Record<string, string> = {
  LINK: "Link de internet",
  ENERGY: "Energia",
  TEAM: "Equipe",
  EQUIPAMENT: "Equipamentos",
  INFRASTRUCTURE: "Infraestrutura",
  TAXES: "Impostos",
  OTHERS: "Outros",
} as const;

export const paymentMethods: Record<string, string> = {
  PIX: "PIX",
  BANK_SLIP: "Boleto",
  CASH: "Dinheiro",
  CREDIT_CARD: "Cartão de Crédito",
  DEBIT_CARD: "Cartão de Débito",
  BANK_TRANSFER: "Transferência Bancaria",
} as const;
