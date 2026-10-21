import "server-only";

import { google } from "googleapis";
import { Readable } from "stream";
import { createGoogleOAuthClient } from "@/lib/google-drive-auth";

export async function uploadImage(file: File, fileName: string) {
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error("GOOGLE_DRIVE_FOLDER_ID não configurado");
  }

  const oauth2Client = createGoogleOAuthClient();

  if (!process.env.GOOGLE_DRIVE_REFRESH_TOKEN) {
    throw new Error("GOOGLE_DRIVE_REFRESH_TOKEN não configurado");
  }

  const driveService = google.drive({
    version: "v3",
    auth: oauth2Client,
  });

  const buffer = Buffer.from(await file.arrayBuffer());

  const response = await driveService.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: file.type,
      body: Readable.from(buffer),
    },
    fields: "id, name, mimeType, webViewLink",
  });

  return response.data;
}
