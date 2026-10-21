"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "@/utils/get-session";
import { uploadImage } from "@/lib/google-drive";
import { CustomerStatus } from "@/generated/prisma/enums";

import type { CustomerType } from "../schema";

export async function createCustomer(data: CustomerType, file?: File) {
  const { user } = await getSession();
  if (!user) return redirect("/login");

  try {
    const result = await prisma.$transaction(async (tx) => {
      const createCustomer = await tx.customer.create({
        data: {
          userId: user.id,
          personType: data.personType,
          name: data.name,
          cpf: data.cpf,
          rg: data.rg,
          birthDate: data.birthDate,
          email: data.email,
          phone: data.phone,
          whatsapp: data.whatsapp,
          notes: data.notes,
          status: data.status as CustomerStatus,
        },
      });

      const createAddress = await tx.address.create({
        data: {
          customerId: createCustomer.id,
          cep: data.cep,
          street: data.street,
          number: data.number,
          complement: data.complement,
          district: data.district,
          city: data.city,
          state: data.state,
          lat: data.lat,
          lng: data.lng,
        },
      });

      return { addressId: createAddress.id };
    });

    if (file) {
      const upload = await uploadImage(file, result.addressId);
      await prisma.address.update({
        where: { id: result.addressId },
        data: {
          googleDriveId: upload.id,
          googleDriveUrl: upload.webViewLink,
        },
      });
    }

    return { success: true, message: "Cliente criado com sucesso!" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Algo deu errado, tente novamente" };
  }
}
