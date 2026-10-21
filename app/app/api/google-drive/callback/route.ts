import { NextRequest, NextResponse } from "next/server";
import { createGoogleOAuthClient } from "@/lib/google-drive-auth";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("google_drive_oauth_state")?.value;

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.json(
      { error: "Resposta OAuth inválida. Tente novamente." },
      { status: 400 },
    );
  }

  try {
    const oauth2Client = createGoogleOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);

    const response = NextResponse.json({
      message:
        "Autorização concluída. Configure o refresh_token no ambiente do servidor.",
      refresh_token: tokens.refresh_token ?? null,
      hasRefreshToken: Boolean(tokens.refresh_token),
    });

    response.cookies.delete("google_drive_oauth_state");

    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (error) {
    console.error(
      "Erro na autorização OAuth do Google Drive:",
      error instanceof Error ? error.message : "Erro desconhecido",
    );

    return NextResponse.json(
      { error: "Não foi possível concluir a autorização OAuth." },
      { status: 500 },
    );
  }
}
