import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function InputSearch({
  search,
  setSearch,
}: {
  search: string;
  setSearch: (value: string) => void;
}) {
  return (
    <div className="relative mt-6">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        className="w-full h-10 pl-9 bg-white"
        placeholder="Buscar por nome, CPF ou CNPJ"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
