import { performance } from "node:perf_hooks";

type DeviceProtocol = "HTTP" | "HTTPS";

interface CheckDeviceInput {
  host: string;
  port: number;
  protocol: DeviceProtocol;
  timeoutMs: number;
}

export interface CheckDeviceResult {
  online: boolean;
  latencyMs: number | null;
  error: string | null;
  statusCode: number | null;
}

export async function checkDevice({
  host,
  port,
  protocol,
  timeoutMs,
}: CheckDeviceInput): Promise<CheckDeviceResult> {
  try {
    if (!host || port < 1 || port > 65535 || timeoutMs <= 0) {
      throw new Error("Configuração do equipamento inválida.");
    }

    const url = new URL(`${protocol.toLowerCase()}://placeholder`);

    // Também permite hosts IPv6.
    url.hostname = host;
    url.port = String(port);
    url.pathname = "/";

    const startedAt = performance.now();

    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(timeoutMs),
      redirect: "manual",
      cache: "no-store",
    });

    const latencyMs = Math.round(performance.now() - startedAt);

    // Não precisamos consumir o conteúdo da página.
    await response.body?.cancel().catch(() => {});

    return {
      online: true,
      latencyMs,
      error: null,
      statusCode: response.status,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";

    const isTimeout =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");

    return {
      online: false,
      latencyMs: null,
      error: isTimeout ? "Timeout na conexão" : message,
      statusCode: null,
    };
  }
}
