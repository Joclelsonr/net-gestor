export const customerSchema = {
  personType: "PF",
  name: "",
  cpf: "",
  rg: "",
  birthDate: "",

  email: "",
  phone: "",
  whatsapp: "",

  cep: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  lat: "",
  lng: "",

  status: "",
  notes: "",
};

export type CustomerType = typeof customerSchema;
export type Key = keyof CustomerType;
