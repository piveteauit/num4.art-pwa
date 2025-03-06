import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { s3Config, generatePresignedUrl } from "@/libs/s3";

export const dynamic = "force-dynamic";
export const maxDuration = 10; // Cette opération est légère
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupération des paramètres
    const { prefix, songId, files } = await req.json();

    if (!prefix || !songId || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: "Paramètres invalides" },
        { status: 400 }
      );
    }

    // Génération des URLs pré-signées
    const urls: Record<string, { uploadUrl: string; publicUrl: string }> = {};
    const validTypes = ["audio", "image", "preview"];

    for (const file of files) {
      const { type, contentType, size } = file;

      if (!validTypes.includes(type)) {
        continue;
      }

      // Détermination de l'extension et du chemin du fichier
      const extension = type === "image" ? "webp" : "mp3";
      const key = `${prefix}/${type}_${songId}.${extension}`;

      // Génération de l'URL pré-signée (valide 15 minutes)
      const urlInfo = await generatePresignedUrl({
        Bucket: s3Config.id,
        Key: key,
        ContentType: contentType,
        ACL: "public-read",
        Expires: 900
      });

      urls[type] = urlInfo;
    }

    const response = NextResponse.json({ urls });

    // Ajout des en-têtes CORS à la réponse
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");

    return response;
  } catch (error) {
    console.error("Erreur lors de la génération des URL pré-signées:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération des URL pré-signées" },
      { status: 500 }
    );
  }
}
