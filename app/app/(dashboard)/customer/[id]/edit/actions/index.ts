"use server";

import { prisma } from "@/lib/prisma";

import type {
  Address,
  Customer,
  CustomerStatus,
} from "@/generated/prisma/client";
import type { CustomerType } from "../../../new/schema";

export async function getCustomerById(
  id: string,
): Promise<(Customer & { address: Address[] }) | null> {
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { address: true },
  });

  return customer;
}

export async function updateCustomer(id: string, data: CustomerType) {
  try {
    await prisma.customer.update({
      where: { id },
      data: {
        personType: data.personType,
        name: data.name,
        cpf: data.cpf,
        rg: data.rg,
        birthDate: new Date(data.birthDate),
        email: data.email,
        phone: data.phone,
        whatsapp: data.whatsapp,
        status: data.status as CustomerStatus,
        notes: data.notes,
        address: {
          updateMany: {
            where: { customerId: id },
            data: {
              street: data.street,
              number: data.number,
              complement: data.complement,
              district: data.district,
              city: data.city,
              state: data.state,
              cep: data.cep,
              ...(data.lat !== undefined &&
                data.lat !== null && {
                  lat: data.lat,
                }),
              ...(data.lng !== undefined &&
                data.lng !== null && {
                  lng: data.lng,
                }),
            },
          },
        },
      },
    });

    return { success: true, message: "Cliente atualizado com sucesso!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
  }
}
