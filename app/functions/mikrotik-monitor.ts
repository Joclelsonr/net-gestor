import { withMonitorLock } from "@/lib/monitoring/monitor-lock";
import { monitorDevices } from "../lib/monitoring/monitor-devices";

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const invocationId = request.headers.get("x-neon-trigger-invocation-id");

  if (!invocationId) {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    console.log("[MONITOR] Iniciando execução:", invocationId);

    const execution = await withMonitorLock(monitorDevices);

    if (!execution.acquired) {
      return Response.json({
        success: true,
        skipped: true,
        reason: "Monitoramento já está em execução",
      });
    }

    console.log("[MONITOR] Execução concluída:", invocationId);

    return Response.json({
      success: true,
      invocationId,
    });
  } catch (error) {
    console.error("[MONITOR] Erro na execução:", error);

    return Response.json(
      {
        success: false,
        error: "Falha ao executar monitoramento",
      },
      { status: 500 },
    );
  }
}
