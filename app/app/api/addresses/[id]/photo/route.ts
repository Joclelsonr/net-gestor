import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { storage } from "@/lib/storage";
import { getSession } from "@/utils/get-session";

import { IMAGE_TYPES } from "@/constants/images";

type RouteProps = { params: Promise<{ id: string }> };

// export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const { user } = await getSession();

    if (!user) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;

    const address = await prisma.address.findFirst({
      where: { id },
      select: { imageKey: true },
    });

    if (!address?.imageKey) {
      return NextResponse.json(
        { message: "Imagem não encontrada." },
        { status: 404 },
      );
    }

    const extension = address.imageKey.split(".").pop()?.toLowerCase();
    const contentType = extension ? IMAGE_TYPES[extension] : undefined;

    if (!contentType) {
      return NextResponse.json(
        { message: "Formato de imagem inválido." },
        { status: 415 },
      );
    }

    const file = await storage.download(address.imageKey);
    const bytes = new Uint8Array(await file.arrayBuffer());

    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "private, max-age=60",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[GET ADDRESS PHOTO]", error);
    return NextResponse.json(
      { message: "Não foi possível carregar a imagem." },
      { status: 500 },
    );
  }
}
