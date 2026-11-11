import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type InventorySelectProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
};

export function InventorySelect({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: InventorySelectProps) {
  return (
    <div className="min-w-0">
      <Label className="mb-1">{label}</Label>
      <Select
        value={value}
        disabled={disabled}
        onValueChange={(nextValue) => {
          if (nextValue !== null) onChange(nextValue);
        }}
      >
        <SelectTrigger aria-label={label} className="w-full">
          <SelectValue placeholder={`Selecione a ${label}`}>
            {options.find((o) => o.value === value)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const inventoryEntries = (values: Record<string, string>) =>
  Object.entries(values).map(([value, label]) => ({ value, label }));
