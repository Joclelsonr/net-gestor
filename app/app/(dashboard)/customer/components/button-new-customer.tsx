"use client";

import Link from "next/link";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ButtonNewCustomer() {
  return (
    <Link href="/customer/new">
      <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
        <div className="flex items-center gap-2">
          <Plus /> Novo cliente
        </div>
      </Button>
    </Link>
  );
}
