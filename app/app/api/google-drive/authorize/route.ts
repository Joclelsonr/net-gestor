import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { createGoogleOAuthClient } from "@/lib/google-drive-auth";

export async function GET() {
  const oauth2Client = createGoogleOAuthClient();
  const state = randomBytes(32).toString("hex");

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/drive"],
    state,
  });

  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set("google_drive_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/google-drive/callback",
    maxAge: 600,
  });

  return response;
}
