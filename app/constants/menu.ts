import { Users, Wrench, Activity, Gauge, Receipt, Package } from "lucide-react";

export const MENU = [
  { id: 1, label: "Clientes", url: "/customer", icon: Users, active: true },
  { id: 2, label: "Planos", url: "/plan", icon: Gauge, active: true },
  {
    id: 3,
    label: "Monitoramento",
    url: "/monitoring",
    icon: Activity,
    active: true,
  },
  {
    id: 4,
    label: "Estoque",
    url: "/stock",
    icon: Package,
    active: true,
  },
  {
    id: 5,
    label: "Financeiro",
    // url: "/finance",
    url: "#",
    icon: Receipt,
    active: false,
  },
  {
    id: 6,
    label: "Suporte",
    // url: "/support",
    url: "#",
    icon: Wrench,
    active: false,
  },
];
