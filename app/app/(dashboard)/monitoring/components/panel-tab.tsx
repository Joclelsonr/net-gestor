import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { formatDuration } from "@/lib/monitor-rules";

import { getDevices } from "../actions";

export async function PanelTab() {
  const devices = await getDevices();

  const online = devices.filter(
    (d) => d.active && d.status === "ONLINE",
  ).length;
  const offline = devices.filter(
    (d) => d.active && d.status === "OFFLINE",
  ).length;
  const openIncidents = devices.filter(
    (d) => d.active && d.status === "OFFLINE" && d.lastError,
  ).length;

  const fmt = (date?: string | null) =>
    date
      ? new Date(date).toLocaleString("pt-BR", {
          timeZone: "America/Sao_Paulo",
        })
      : "—";

  const statusStyle: Record<string, string> = {
    ONLINE: "bg-green-500 text-white",
    OFFLINE: "bg-red-500 text-white",
  };

  return (
    <TabsContent
      value="panel"
      className="w-full md:flex md:flex-wrap space-y-6"
    >
      <div className="w-full grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          ["Equipamentos", devices.length],
          ["Online", online],
          ["Fora do ar", offline],
          ["Incidentes abertos", openIncidents],
        ].map(([l, v]) => (
          <div key={l} className="rounded-lg border bg-card p-5">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {l}
            </p>
            <p className="mt-1 font-display text-3xl font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3">
        {devices
          .filter((device) => device.active)
          .map((device) => (
            <div key={device.id} className="rounded-lg border bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold">
                    {device.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {device.protocol}://{device.host}:{device.port}
                  </p>
                </div>
                <Badge variant="outline" className={statusStyle[device.status]}>
                  {device.status}
                </Badge>
              </div>
              <dl className="mt-4 space-y-1 text-xs text-muted-foreground">
                <div>
                  Latência:{" "}
                  {device.lastLatencyMs != null
                    ? `${device.lastLatencyMs} ms`
                    : "—"}
                </div>
                <div>
                  Última verificação: {fmt(device.lastCheckedAt?.toISOString())}
                </div>
                {device.lastChangeAt && device.lastCheckedAt && (
                  <div>
                    Neste estado há{" "}
                    {formatDuration(
                      new Date(device.lastCheckedAt).getTime() -
                        new Date(device.lastChangeAt).getTime(),
                    )}
                  </div>
                )}
                {device.status === "OFFLINE" && device.lastError && (
                  <div className="text-destructive">{device.lastError}</div>
                )}
              </dl>
            </div>
          ))}
        {devices.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Nenhum equipamento cadastrado. Use a aba Equipamentos.
          </p>
        )}
      </div>
    </TabsContent>
  );
}
