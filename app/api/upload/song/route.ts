import { s3Config, uploadToS3 } from "@/libs/s3";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import sharp from "sharp";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as Stripe.StripeConfig["apiVersion"]
});

export const dynamic = "force-dynamic";
export const maxDuration = 60;
export const runtime = "nodejs";

type UploadedFile = {
  name: string;
  type: string;
  songId: string;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

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
    const audio = formData.get("audio") as unknown as UploadedFile;
    const image = formData.get("image") as unknown as UploadedFile;
    const preview = formData.get("preview") as unknown as UploadedFile;
    const prefix = formData.get("prefix") as string;
    const songId = formData.get("songId") as string;
    const price = formData.get("price") as string;
    const songName = formData.get("songName") as string;
    if (!audio || !image || !preview || !prefix || !price || !songName) {
      return NextResponse.json(
        { error: "Tous les fichiers, le préfixe et le prix sont requis" },
        { status: 400 }
      );
    }

    // Pour l'audio, on l'envoie tel quel pour l'instant
    const audioBuffer = Buffer.from(await audio.arrayBuffer());
    // Conversion de l'image en WebP
    const imageBuffer = await convertToWebP(
      Buffer.from(await image.arrayBuffer())
    );

    // Upload audio
    const audioKey = `${prefix}/audio_${songId}.mp3`;
    const audioResult = await uploadToS3({
      Bucket: s3Config.id,
      Key: audioKey,
      Body: audioBuffer,
      ContentType: audio.type,
      ACL: "public-read"
    });

    // Upload preview
    const previewKey = `${prefix}/preview_${songId}.mp3`;
    const previewResult = await uploadToS3({
      Bucket: s3Config.id,
      Key: previewKey,
      Body: Buffer.from(await preview.arrayBuffer()),
      ContentType: "audio/mpeg",
      ACL: "public-read"
    });

    // Upload image
    const imageKey = `${prefix}/cover_${songId}.webp`;
    const imageResult = await uploadToS3({
      Bucket: s3Config.id,
      Key: imageKey,
      Body: imageBuffer,
      ContentType: "image/webp",
      ACL: "public-read"
    });

    if (
      !audioResult?.Location ||
      !previewResult?.Location ||
      !imageResult?.Location
    ) {
      throw new Error("Échec de l'upload sur S3");
    }

    const artistName = session.user.profile?.artist?.name;
    // Créer un produit et un prix Stripe
    const product = await stripe.products.create({
      name: `${songName} - ${artistName}`,
      type: "service",
      images: [imageResult.Location],
      metadata: {
        song_id: songId,
        song_name: songName,
        artist_name: artistName
      }
    });

    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(parseFloat(price) * 100), // Convertir en centimes
      currency: "eur"
    });

    return NextResponse.json({
      audio: { url: audioResult.Location },
      preview: { url: previewResult.Location },
      image: { url: imageResult.Location },
      priceId: stripePrice.id,
      productId: product.id
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'upload des fichiers" },
      { status: 500 }
    );
  }
}
