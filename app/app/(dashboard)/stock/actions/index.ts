"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { padronizarMac } from "@/lib/inventory-rules";
import { InventoryEventKind } from "@/generated/prisma/client";

import {
  type Customer,
  type Inventory,
  type InventoryStatus,
  type InventoryEvents,
  type InventoryCategory,
} from "@/generated/prisma/client";
import type { InventoryMovementMode, TInventory } from "../schema";

export async function getInventory(): Promise<
  (Inventory & { inventoryMovements: InventoryEvents[] })[]
> {
  const inventory = await prisma.inventory.findMany({
    orderBy: { createdAt: "desc" },
    include: { inventoryMovements: { orderBy: { createdAt: "desc" } } },
  });

  return inventory;
}

export async function getCustomers(): Promise<Customer[]> {
  const customers = await prisma.customer.findMany();

  return customers;
}

export async function upsertInventory(data: TInventory, id?: string) {
  const status = data.status as InventoryStatus;
  const category = data.category as InventoryCategory;

  try {
    if (!Number.isInteger(data.quantity) || data.quantity < 0) {
      return {
        success: false,
        message: "A quantidade deve ser um número inteiro não negativo.",
      };
    }

    if (!Number.isInteger(data.minimumStock) || data.minimumStock < 0) {
      return {
        success: false,
        message: "O estoque mínimo deve ser um número inteiro não negativo.",
      };
    }

    if (status === "ASSIGNED" && !data.customerId) {
      return {
        success: false,
        message: "Selecione um cliente para vincular o equipamento.",
      };
    }

    if (status !== "ASSIGNED" && data.customerId) {
      return {
        success: false,
        message: "Remova o vínculo com o cliente antes de alterar a situação.",
      };
    }

    const normalizedData = {
      ...data,
      mac: data.mac ? padronizarMac(data.mac) : null,
      category,
      status,
      quantity: category === "MATERIAL" ? data.quantity : 1,
      customerId: data.customerId || null,
    };

    await prisma.$transaction(async (tx) => {
      // Cadastro
      if (!id) {
        const inventory = await tx.inventory.create({
          data: {
            ...normalizedData,
            inventoryMovements: {
              create: {
                kind: InventoryEventKind.REGISTER,
                quantityDelta: category === "MATERIAL" ? data.quantity : 1,
                changes: {
                  after: normalizedData,
                },
              },
            },
          },
        });

        return inventory;
      }

      // Busca o estado anterior
      const previous = await tx.inventory.findUnique({ where: { id } });
      if (!previous) {
        throw new Error("Item do estoque não encontrado.");
      }

      // Atualiza o item
      const updated = await tx.inventory.update({
        where: { id },
        data: normalizedData,
      });

      const before = {
        name: previous.name,
        category: previous.category,
        brand: previous.brand,
        model: previous.model,
        mac: previous.mac,
        serial: previous.serial,
        quantity: previous.quantity,
        unit: previous.unit,
        minimumStock: previous.minimumStock,
        location: previous.location,
        status: previous.status,
        customerId: previous.customerId,
        notes: previous.notes,
      };

      const after = {
        name: updated.name,
        category: updated.category,
        brand: updated.brand,
        model: updated.model,
        mac: updated.mac,
        serial: updated.serial,
        quantity: updated.quantity,
        unit: updated.unit,
        minimumStock: updated.minimumStock,
        location: updated.location,
        status: updated.status,
        customerId: updated.customerId,
        notes: updated.notes,
      };

      const changes = Object.keys(after).filter(
        (key) =>
          before[key as keyof typeof before] !==
          after[key as keyof typeof after],
      );

      if (changes.length === 0) return updated;

      let kind: InventoryEventKind = InventoryEventKind.UPDATE;
      let quantityDelta = 0;

      // Mudança de quantidade de material pelo editor:
      // registra como ajuste, não como entrada ou consumo.
      if (
        previous.category === "MATERIAL" &&
        previous.quantity !== updated.quantity
      ) {
        kind = InventoryEventKind.ADJUSTMENT;
        quantityDelta = updated.quantity - previous.quantity;
      }

      // Vínculo, devolução ou transferência de equipamento.
      else if (previous.customerId !== updated.customerId) {
        if (!previous.customerId && updated.customerId) {
          kind = InventoryEventKind.ASSIGN;
        } else if (previous.customerId && !updated.customerId) {
          kind = InventoryEventKind.RETURN;
        } else {
          kind = InventoryEventKind.TRANSFER;
        }
      }

      // Mudanças de status.
      else if (previous.status !== updated.status) {
        if (updated.status === "MAINTENANCE") {
          kind = InventoryEventKind.MAINTENANCE;
        } else if (previous.status === "MAINTENANCE") {
          kind = InventoryEventKind.MAINTENANCE_RETURN;
        } else if (updated.status === "DAMAGED") {
          kind = InventoryEventKind.DAMAGE;
        } else if (updated.status === "LOST") {
          kind = InventoryEventKind.LOSS;
        }
      }

      // Mudança de localização.
      else if (previous.location !== updated.location) {
        kind = InventoryEventKind.TRANSFER;
      }

      await tx.inventoryEvents.create({
        data: {
          inventoryId: updated.id,
          kind,
          quantityDelta,
          changes: {
            fields: changes,
            before,
            after,
          },
        },
      });

      return updated;
    });

    revalidatePath("/stock");

    return {
      success: true,
      message: `Equipamento ${id ? "atualizado" : "criado"} com sucesso!`,
    };
  } catch (error) {
    console.error("[CREATE STOCK]", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível ajustar o estoque.",
    };
  }
}

export async function moveInventory(
  id: string,
  mode: InventoryMovementMode,
  quantity: number,
) {
  try {
    // Valida a quantidade recebida
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        success: false,
        message: "Informe uma quantidade inteira maior que zero.",
      };
    }

    if (!["ADD", "REMOVE"].includes(mode)) {
      return {
        success: false,
        message: "Tipo de movimentação inválido.",
      };
    }

    await prisma.$transaction(async (tx) => {
      const inventory = await tx.inventory.findUnique({
        where: { id },
      });

      if (!inventory) {
        throw new Error("Item não encontrado no estoque.");
      }

      if (inventory.category !== "MATERIAL") {
        throw new Error(
          "Movimentações por quantidade são permitidas apenas para materiais.",
        );
      }

      const quantityDelta = mode === "ADD" ? quantity : -quantity;

      // Atualiza o saldo.
      // Na saída, a condição impede saldo negativo,
      // mesmo em movimentações simultâneas.
      const updated = await tx.inventory.updateMany({
        where: {
          id,
          ...(mode === "REMOVE" ? { quantity: { gte: quantity } } : {}),
        },
        data: {
          quantity: { [mode === "ADD" ? "increment" : "decrement"]: quantity },
        },
      });

      if (updated.count === 0) {
        throw new Error("Estoque insuficiente para realizar essa saída.");
      }

      const current = await tx.inventory.findUniqueOrThrow({
        where: { id },
      });

      // Registra o evento no histórico
      await tx.inventoryEvents.create({
        data: {
          inventoryId: id,
          kind: mode === "ADD" ? "ENTRY" : "CONSUMPTION",
          quantityDelta,
          changes: {
            fields: ["quantity"],
            before: { quantity: inventory.quantity },
            after: { quantity: current.quantity },
          },
        },
      });
    });

    revalidatePath("/stock");

    return {
      success: true,
      message:
        mode === "ADD"
          ? "Entrada registrada com sucesso!"
          : "Saída registrada com sucesso!",
    };
  } catch (error) {
    console.error("[INVENTORY MOVEMENT]", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a movimentação.",
    };
  }
}
