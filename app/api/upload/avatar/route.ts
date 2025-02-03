import { s3Config, uploadToS3, deleteFromS3 } from "@/libs/s3";
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
    const previousAvatar = formData.get("previousAvatar") as string;

    if (!avatar || !prefix || !userId) {
      return NextResponse.json(
        { error: "L'image et les informations sont requises" },
        { status: 400 }
      );
    }
    if (previousAvatar) {
      const url = new URL(previousAvatar);
      const previousKey = url.pathname.substring(1); // Enlève le premier '/' du pathname

      try {
        await deleteFromS3({
          Bucket: s3Config.id,
          Key: previousKey
        });
        console.log("Ancien avatar supprimé avec succès");
      } catch (deleteError) {
        console.error(
          "Erreur lors de la suppression de l'ancien avatar:",
          deleteError
        );
        // On continue le processus même si la suppression échoue
      }
    }

    // Conversion de l'image en WebP
    const imageBuffer = await convertToWebP(
      Buffer.from(await avatar.arrayBuffer())
    );

    // Upload de l'avatar
    const avatarKey = `${prefix}/profile_picture${Date.now()}.webp`;
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
