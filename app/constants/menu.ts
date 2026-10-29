import {
  Users,
  Wrench,
  Activity,
  Gauge,
  FileText,
  Receipt,
} from "lucide-react";

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
    label: "Suporte",
    // url: "/support",
    url: "#",
    icon: Wrench,
    active: false,
  },
  {
    id: 6,
    label: "Financeiro",
    // url: "/finance",
    url: "#",
    icon: Receipt,
    active: false,
  },
  {
    id: 5,
    label: "Contratos",
    // url: "/contract",
    url: "#",
    icon: FileText,
    active: false,
  },
];
