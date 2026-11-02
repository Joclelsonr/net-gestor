import { Suspense } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PanelTab } from "./components/panel-tab";
import { RegisterTab } from "./components/register-tab";
import { IncidentsTab } from "./components/incidents-tab";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  return (
    <div className="mx-auto w-full p-6 md:max-w-6xl md:p-10">
      <div className="flex justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Rede
          </p>
          <h1 className="text-3xl font-semibold">Monitoramento</h1>
        </div>
        <Button size="lg" className=" bg-blue-500 hover:bg-blue-600">
          <RefreshCw /> Verificar agora
        </Button>
      </div>

      <div className="w-full flex justify-center gap-4">
        <Tabs defaultValue="panel" className="w-full mt-6">
          <TabsList className="w-full md:w-100 space-x-3 border">
            <TabsTrigger value="panel">Painel</TabsTrigger>
            <TabsTrigger value="register">Equipamentos</TabsTrigger>
            <TabsTrigger value="incident">Incidentes</TabsTrigger>
          </TabsList>

          <Suspense fallback={"Carregando Dados..."}>
            <PanelTab />
          </Suspense>

          <Suspense fallback={"Carregando Equipamentos..."}>
            <RegisterTab />
          </Suspense>

          <Suspense fallback={"Carregando Incidentes..."}>
            <IncidentsTab />
          </Suspense>
        </Tabs>
      </div>
    </div>
  );
}
