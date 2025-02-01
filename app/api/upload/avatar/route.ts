import { s3Config, uploadToS3 } from "@/libs/s3";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import sharp from "sharp";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const runtime = "nodejs";

async function convertToWebP(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer).webp({ quality: 80 }).toBuffer();
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const avatar = formData.get("avatar") as File;
    const prefix = formData.get("prefix") as string;
    const userId = formData.get("userId") as string;

    if (!avatar || !prefix || !userId) {
      return NextResponse.json(
        { error: "L'image et les informations sont requises" },
        { status: 400 }
      );
    }

    // Conversion de l'image en WebP
    const imageBuffer = await convertToWebP(
      Buffer.from(await avatar.arrayBuffer())
    );

    // Upload de l'avatar
    const avatarKey = `${prefix}/profile_picture.webp`;
    const avatarResult = await uploadToS3({
      Bucket: s3Config.id,
      Key: avatarKey,
      Body: imageBuffer,
      ContentType: "image/webp",
      ACL: "public-read"
    });

    if (!avatarResult?.Location) {
      throw new Error("Échec de l'upload sur S3");
    }

    return NextResponse.json({
      avatar: { url: avatarResult.Location }
    });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'avatar:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload de l'avatar" },
      { status: 500 }
    );
  }
}
