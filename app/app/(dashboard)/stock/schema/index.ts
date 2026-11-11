export const inventorySchema = {
  name: "",
  category: "",
  brand: "",
  model: "",
  mac: "",
  serial: "",
  quantity: 1,
  unit: "",
  minimumStock: 1,
  location: "",
  status: "",
  customerId: "",
  notes: "",
};

export type TInventory = typeof inventorySchema;

export type InventoryMovementMode = "ADD" | "REMOVE";
