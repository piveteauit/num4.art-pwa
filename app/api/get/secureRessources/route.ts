import { GetObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { s3Client } from "@/libs/s3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Key is required" }, { status: 400 });
  }

  try {
    const command = new GetObjectCommand({
      Bucket: "numero",
      Key: key
    });

    const response = await s3Client.send(command);
    const headers = new Headers();

    headers.set("Content-Type", "image/png");
    headers.set("Cache-Control", "public, max-age=31536000");

    return new Response(response.Body?.transformToWebStream(), {
      headers,
      status: 200
    });
  } catch (error) {
    console.error("Erreur détaillée S3:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors de la récupération de l'image" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
