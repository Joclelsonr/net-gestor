import { Users, Wrench, Activity, Gauge, Receipt, Package } from "lucide-react";

export const MENU = [
  {
    id: 1,
    label: "Financeiro",
    url: "/finance",
    icon: Receipt,
    active: true,
  },
  {
    id: 2,
    label: "Clientes",
    url: "/customer",
    icon: Users,
    active: true,
  },
  { id: 3, label: "Planos", url: "/plan", icon: Gauge, active: true },
  {
    id: 4,
    label: "Monitoramento",
    url: "/monitoring",
    icon: Activity,
    active: true,
  },
  {
    id: 5,
    label: "Estoque",
    url: "/stock",
    icon: Package,
    active: true,
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
