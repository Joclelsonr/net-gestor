export const empty = {
  person_type: "PF",
  name: "",
  document: "",
  rg_ie: "",
  birth_date: "",

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

  status: "aguardando",
  notes: "",
};

export type Form = typeof empty;
export type Key = keyof Form;
