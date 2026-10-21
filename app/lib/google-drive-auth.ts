import "server-only";

import { google } from "googleapis";

const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const refreshToken = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

if (!clientId || !clientSecret || !redirectUri) {
  throw new Error("Credenciais OAuth do Google Drive não configuradas");
}

export function createGoogleOAuthClient() {
  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri,
  );

  if (refreshToken) {
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });
  }

  return oauth2Client;
}
