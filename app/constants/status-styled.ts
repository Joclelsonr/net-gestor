export const statusStyle: Record<string, string> = {
  ACTIVE: "bg-success/15 text-success border-success/30",
  WAITING: "bg-secondary text-secondary-foreground",
  SUSPENDED: "bg-warning/20 text-foreground border-warning/40",
  CANCELED: "bg-destructive/10 text-destructive border-destructive/30",
};

export const statusTraduction: Record<string, string> = {
  ACTIVE: "ATIVO",
  WAITING: "AGUARDANDO",
  SUSPENDED: "SUSPENSO",
  CANCELED: "CANCELADO",
};
