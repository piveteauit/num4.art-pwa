import { NextResponse } from "next/server";
import { s3Config } from "@/libs/s3";
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  try {
    const url = `${s3Config.publicUrl}/${key}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();

    return new Response(blob, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": blob.size.toString(),
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du fichier:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du fichier" },
      { status: 500 }
    );
  }
}
