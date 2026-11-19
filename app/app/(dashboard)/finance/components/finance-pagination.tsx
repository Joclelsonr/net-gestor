import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type FinancePaginationProps = {
  currentPage: number;
  pages: number;
  onPageChange: (page: number) => void;
};

export function FinancePagination({
  currentPage,
  pages,
  onPageChange,
}: FinancePaginationProps) {
  return (
    <div className="mt-5 flex items-center justify-between border-t pt-4">
      <p className="text-xs text-muted-foreground">
        Página {currentPage} de {pages}
      </p>

      <div className="flex gap-2">
        <Button
          size="icon"
          variant="outline"
          aria-label="Página anterior"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft />
        </Button>

        <Button
          size="icon"
          variant="outline"
          aria-label="Próxima página"
          disabled={currentPage >= pages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
