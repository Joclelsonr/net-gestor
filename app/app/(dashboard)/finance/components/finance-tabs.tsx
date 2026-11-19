import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type FinanceTab = "overview" | "receivables" | "expenses";

type FinanceTabsProps = {
  value: FinanceTab;
  onChange: (value: FinanceTab) => void;
};

export function FinanceTabs({ value, onChange }: FinanceTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(value) => onChange(value as FinanceTab)}
    >
      <TabsList className="h-auto max-w-full flex-wrap">
        <TabsTrigger value="overview">Visão geral</TabsTrigger>
        <TabsTrigger value="receivables">Contas a receber</TabsTrigger>
        <TabsTrigger value="expenses">Contas a pagar</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
