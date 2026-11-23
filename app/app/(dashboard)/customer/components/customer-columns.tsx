"use client";

import { formatDate } from "@/lib/br-docs";
import { createColumnHelper } from "@tanstack/react-table";
import { statusStyle, statusTraduction } from "@/constants/status-styled";

import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type { Customer } from "@/generated/prisma/client";
import type { DataTableFeatures } from "./customer-datatable-features";

const columnHelper = createColumnHelper<DataTableFeatures, Customer>();

export const customerColumns = columnHelper.columns([
  columnHelper.accessor("id", {
    header: "",
    cell: () => {
      return <div></div>;
    },
  }),
  columnHelper.accessor("name", {
    // header: "Nome",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  }),
  columnHelper.accessor("cpf", {
    header: "CPF/CNPJ",
  }),
  columnHelper.accessor("whatsapp", {
    header: "Whatsapp",
  }),
  columnHelper.accessor("personType", {
    header: "Tipo",
  }),
  columnHelper.accessor("createdAt", {
    header: "Desde",

    cell: ({ row }) => {
      const format = formatDate(row.original.createdAt);
      return format;
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className={statusStyle[row.original.status]}>
          {statusTraduction[row.original.status]}
        </Badge>
      );
    },
  }),
]);
