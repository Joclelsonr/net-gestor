export async function sendTelegramMessage(
  chatId: string,
  message: string,
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token || !chatId) {
    throw new Error("Configure TELEGRAM_BOT_TOKEN e TELEGRAM_CHAT_ID");
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(`Falha no Telegram: HTTP ${response.status}`);
  }

  const result: unknown = await response.json();

  if (
    !result ||
    typeof result !== "object" ||
    !("ok" in result) ||
    result.ok !== true
  ) {
    throw new Error("Telegram não confirmou o envio");
  }
}
