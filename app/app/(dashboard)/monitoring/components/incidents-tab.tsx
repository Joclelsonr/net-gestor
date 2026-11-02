import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { formatDuration } from "@/lib/monitor-rules";

import { getIncidents } from "../actions";

export async function IncidentsTab() {
  const incidents = await getIncidents();

  const statusStyle: Record<string, string> = {
    online: "bg-green-500 text-white",
    offline: "bg-red-500 text-white",
  };

  const fmt = (date?: Date | null) =>
    date
      ? date.toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        })
      : "—";

  return (
    <TabsContent value="incident" className="w-full space-y-6">
      <div className="w-full rounded-lg border bg-card">
        <table className="w-full table-fixed text-sm">
          <thead className="border-b text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Equipamento</th>
              <th className="px-4 py-3 text-center">Caiu em</th>
              <th className="px-4 py-3 text-center">Voltou em</th>
              <th className="px-4 py-3 text-center">Duração</th>
              <th className="hidden md:table-cell px-4 py-3 text-center">
                Notificado
              </th>
              <th className="hidden md:table-cell px-4 py-3 text-center">
                Motivo
              </th>
            </tr>
          </thead>

          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-b last:border-0">
                <td className="p-3 font-medium">{incident.device.name}</td>
                <td className="p-3 text-center">{fmt(incident.startedAt)}</td>
                <td className="p-3 text-center">
                  {incident.endedAt ? (
                    fmt(incident.endedAt)
                  ) : (
                    <Badge
                      variant="outline"
                      className={statusStyle[incident.device.status] ?? ""}
                    >
                      em aberto
                    </Badge>
                  )}
                </td>
                <td className="p-3 text-center">
                  {incident.endedAt
                    ? formatDuration(
                        incident.endedAt.getTime() -
                          new Date(incident.startedAt).getTime(),
                      )
                    : "—"}
                </td>
                <td className="hidden self-center text-center md:table-cell">
                  {incident.notifiedUp ? "Sim" : "Não"}
                </td>
                <td className="hidden p-3 text-center text-muted-foreground md:table-cell">
                  {incident.cause ?? "—"}
                </td>
              </tr>
            ))}

            {incidents.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-muted-foreground"
                >
                  Nenhum incidente registrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TabsContent>
  );
}
