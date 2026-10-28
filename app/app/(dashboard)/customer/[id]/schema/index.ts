export const subscriptionSchema = {
  customerId: "",
  planId: "",
  price: "",
  dueDate: 10,
  startDate: new Date().toLocaleDateString(),
  loyalty_months: "",
};

export type TSubscription = typeof subscriptionSchema;
