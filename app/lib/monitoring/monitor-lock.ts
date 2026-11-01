import { Client } from "pg";

const LOCK_NAMESPACE = 20261030;
const LOCK_ID = 1;

export async function withMonitorLock<T>(
  callback: () => Promise<T>,
): Promise<{ acquired: boolean; result?: T }> {
  const connectionString = process.env.DATABASE_URL_UNPOOLED;

  if (!connectionString) {
    throw new Error("DATABASE_URL_UNPOOLED não está definida");
  }

  const client = new Client({ connectionString });

  await client.connect();

  let acquired = false;

  try {
    const { rows } = await client.query<{ locked: boolean }>(
      "SELECT pg_try_advisory_lock($1, $2) AS locked",
      [LOCK_NAMESPACE, LOCK_ID],
    );

    acquired = rows[0]?.locked === true;

    if (!acquired) {
      console.log("[MONITOR] Outra execução já está em andamento.");

      return { acquired: false };
    }

    const result = await callback();

    return { acquired: true, result };
  } finally {
    try {
      if (acquired) {
        await client.query("SELECT pg_advisory_unlock($1, $2)", [
          LOCK_NAMESPACE,
          LOCK_ID,
        ]);
      }
    } finally {
      await client.end();
    }
  }
}
