import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FinancePeriodFilterProps = {
  start: Date;
  end: Date;
  onStartChange: (date: Date) => void;
  onEndChange: (date: Date) => void;
  onPeriodChange: (period: "month" | "last" | "year") => void;
};

export function FinancePeriodFilter({
  start,
  end,
  onStartChange,
  onEndChange,
  onPeriodChange,
}: FinancePeriodFilterProps) {
  function dateToInput(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function inputToDate(value: string) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return (
    <div className="my-6 flex flex-wrap items-end justify-between gap-4 border-y py-4">
      <div className="flex min-w-0 flex-wrap items-end gap-3">
        <div className="space-y-1">
          <Label
            htmlFor="period-start"
            className="text-xs text-muted-foreground"
          >
            De
          </Label>

          <Input
            id="period-start"
            type="date"
            className="w-40"
            value={dateToInput(start)}
            max={dateToInput(end)}
            onChange={(event) => {
              if (event.target.value) {
                onStartChange(inputToDate(event.target.value));
              }
            }}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="period-end" className="text-xs text-muted-foreground">
            Até
          </Label>

          <Input
            id="period-end"
            type="date"
            className="w-40"
            value={dateToInput(end)}
            min={dateToInput(start)}
            onChange={(event) => {
              if (event.target.value) {
                onEndChange(inputToDate(event.target.value));
              }
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        <Button variant="ghost" onClick={() => onPeriodChange("month")}>
          Este mês
        </Button>

        <Button variant="ghost" onClick={() => onPeriodChange("last")}>
          Mês passado
        </Button>

        <Button variant="ghost" onClick={() => onPeriodChange("year")}>
          Este ano
        </Button>
      </div>
    </div>
  );
}
