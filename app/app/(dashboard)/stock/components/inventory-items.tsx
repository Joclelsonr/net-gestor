import type { Inventory } from "@/generated/prisma/client";

type InventoryItemsProps = {
  inventorys: Inventory[];
};

export function InventoryItems({ inventorys }: InventoryItemsProps) {
  return <div></div>;
}
