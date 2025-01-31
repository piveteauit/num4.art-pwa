import { s3Config, uploadToS3 } from "@/libs/s3";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';
export const maxDuration = 60;
export const runtime = "nodejs"

export async function POST(
  req: NextRequest & { file: any },
  res: NextResponse
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const audio: any = formData.get("audio");
    const image: any = formData.get("image");
    const prefix = formData.get("prefix");

    if (!audio || !image || !prefix) {
      return NextResponse.json(
        {
          error: "Tous les fichiers (audio, image) et le préfixe sont requis"
        },
        { status: 400 }
      );
    }

    const audioKey = `${prefix}/${audio.name}`;
    const imageKey = `${prefix}/${image.name}`;

    const audioResult = await uploadToS3({
      Bucket: s3Config.id,
      Key: audioKey,
      Body: Buffer.from(await audio.arrayBuffer()),
      ACL: "private"
    });

    const imageResult = await uploadToS3({
      Bucket: s3Config.id,
      Key: imageKey,
      Body: Buffer.from(await image.arrayBuffer()),
      ACL: "public-read"
    });

    return NextResponse.json({
      audio: {
        name: audio.name,
        url: audioResult?.Location
      },
      image: {
        name: image.name,
        url: imageResult?.Location
      }
    });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return NextResponse.json(
      { error: "Failed to upload file to S3" },
      { status: 500 }
    );
  }
}
