"use server";

export async function getClients() {
  return [
    {
      id: "1",
      code: 1,
      name: "João da Silva",
      document: "12345678901",
      phone: "11999999999",
      city: "São Paulo",
      status: "ativo",
    },
    {
      id: "2",
      code: 2,
      name: "Maria Oliveira",
      document: "12345678902",
      phone: "11987654321",
      city: "Rio de Janeiro",
      status: "prospecto",
    },
    {
      id: "3",
      code: 3,
      name: "Carlos Santos",
      document: "12345678903",
      phone: "11912345678",
      city: "Brasília",
      status: "suspenso",
    },
    {
      id: "4",
      code: 4,
      name: "Ana Costa",
      document: "12345678904",
      phone: "11923456789",
      city: "Salvador",
      status: "cancelado",
    },
  ];
}
