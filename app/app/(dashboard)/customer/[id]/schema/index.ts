export const subscriptionSchema = {
  customerId: "",
  planId: "",
  price: "",
  dueDate: 10,
  StartDate: new Date().toISOString().slice(0, 10),
  loyalty_months: '',
};

export type TSubscription = typeof subscriptionSchema;
