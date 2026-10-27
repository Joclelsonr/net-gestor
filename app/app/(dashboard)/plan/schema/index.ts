export const planSchema = {
  name: "",
  description: "",
  downloadMbps: "300",
  uploadMbps: "150",
  price: "",
};

export type TPlan = typeof planSchema;
