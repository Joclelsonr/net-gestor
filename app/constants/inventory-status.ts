export const inventoryStatuses: Record<string, string> = {
  AVAILABLE: "Disponível",
  ASSIGNED: "Em uso",
  RESERVED: "Reservado",
  MAINTENANCE: "Manutenção",
  DAMAGED: "Danificado",
  LOST: "Perdido",
} as const;

export const categories: Record<string, string> = {
  ROUTER: "Roteador",
  EQUIPAMENT: "Equipamento",
  MATERIAL: "Material",
} as const;

export const eventLabels: Record<string, string> = {
  REGISTER: "Cadastro",
  ENTRY: "Entrada no estoque",
  ASSIGN: "Vínculo com cliente",
  RETURN: "Devolução ao estoque",
  TRANSFER: "Transferência",
  MAINTENANCE: "Envio para manutenção",
  MAINTENANCE_RETURN: "Retorno da manutenção",
  DAMAGE: "Equipamento danificado",
  LOSS: "Equipamento perdido",
  CONSUMPTION: "Consumo de material",
  ADJUSTMENT: "Ajuste de estoque",
  UPDATE: "Atualização cadastral",
};

export const fieldLabels: Record<string, string> = {
  name: "Nome",
  category: "Categoria",
  brand: "Marca",
  model: "Modelo",
  mac: "MAC",
  serial: "Número de série",
  quantity: "Quantidade",
  unit: "Unidade",
  minimumStock: "Estoque mínimo",
  location: "Localização",
  status: "Situação",
  customerId: "Vínculo com cliente",
  notes: "Observações",
};
