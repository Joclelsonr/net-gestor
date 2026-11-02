import { Activity, Trash2 } from "lucide-react";

import { FormDevice } from "./form-device";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FormTelegram } from "./form-telegram";
import { TabsContent } from "@/components/ui/tabs";
import { statusStyle } from "@/constants/status-styled";

import { getDevices } from "../actions";

export async function RegisterTab() {
  const devices = await getDevices();

  return (
    <TabsContent value="register" className="flex flex-wrap space-y-6">
      <FormDevice />

      <div className="w-full rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead className="w-full border-b text-left text-xs uppercase bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 md:table-cell">Nome</th>
              <th className="px-4 py-3 md:table-cell">Endereço</th>
              <th className="px-4 py-3 md:table-cell">Local</th>
              <th className="hidden px-4 py-3 md:table-cell text-center">
                Status
              </th>
              <th className="hidden px-4 py-3 md:table-cell text-center">
                Monitorar
              </th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr key={device.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{device.name}</td>
                <td className="p-3 text-muted-foreground">
                  {device.protocol.toLowerCase()}://{device.host}:{device.port}
                </td>
                <td className="p-3 text-muted-foreground">
                  {device.location ?? "—"}
                </td>
                <td className="hidden p-3">
                  <Badge
                    // variant="outline"
                    className={statusStyle[device.status]}
                  >
                    {device.status}
                  </Badge>
                </td>
                <td className="hidden text-center md:table-cell p-3">
                  <input type="checkbox" checked={device.active} />
                </td>
                <td className="hidden md:table-cell p-3 text-center whitespace-nowrap">
                  <Button size="sm" variant="ghost">
                    <Activity className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FormTelegram />
    </TabsContent>
  );
}
