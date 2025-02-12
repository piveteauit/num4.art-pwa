import { prisma } from "@/libs/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { updateSongBdd } from "@/libs/server/song.action";
import { deleteFromS3, s3Config, uploadToS3 } from "@/libs/s3";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { songId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const dataStr = formData.get("data") as string;
    const data = JSON.parse(dataStr);

    let updatedData = { ...data };

    // Si des fichiers sont présents, les uploader
    if (formData.has("audio")) {
      const audio = formData.get("audio") as File;
      const audioBuffer = Buffer.from(await audio.arrayBuffer());
      const audioKey = `songs/${params.songId}/audio.mp3`;

      const audioResult = await uploadToS3({
        Bucket: s3Config.id,
        Key: audioKey,
        Body: audioBuffer,
        ContentType: audio.type,
        ACL: "public-read"
      });

      updatedData.audio = audioResult.Location;
    }

    if (formData.has("preview")) {
      const preview = formData.get("preview") as File;
      const previewBuffer = Buffer.from(await preview.arrayBuffer());
      const previewKey = `songs/${params.songId}/preview.mp3`;

      const previewResult = await uploadToS3({
        Bucket: s3Config.id,
        Key: previewKey,
        Body: previewBuffer,
        ContentType: preview.type,
        ACL: "public-read"
      });

      updatedData.preview = previewResult.Location;
    }

    if (formData.has("image")) {
      const image = formData.get("image") as File;
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const imageKey = `songs/${params.songId}/image.webp`;

      const imageResult = await uploadToS3({
        Bucket: s3Config.id,
        Key: imageKey,
        Body: imageBuffer,
        ContentType: "image/webp",
        ACL: "public-read"
      });

      updatedData.image = imageResult.Location;
    }

    const updatedSong = await updateSongBdd({
      songId: params.songId,
      data: updatedData
    });

    return NextResponse.json({ song: updatedSong });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { songId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Vérifier que l'utilisateur est bien l'artiste du titre
    const userProfile = await prisma.profile.findFirst({
      where: {
        userId: session.user.id,
        artistMode: true,
        artist: {
          songs: {
            some: { id: params.songId }
          }
        }
      }
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Non autorisé à supprimer ce titre" },
        { status: 403 }
      );
    }

    // Supprimer d'abord les commandes associées
    const deletedOrders = await prisma.order.deleteMany({
      where: { songId: params.songId }
    });

    // Puis supprimer le titre
    const deletedSong = await prisma.song.delete({
      where: { id: params.songId }
    });

    if (!deletedSong) {
      return NextResponse.json(
        { error: `Erreur lors de la suppression ${params.songId}` },
        { status: 500 }
      );
    }

    const urlCover = new URL(deletedSong.image);
    const previousKeyCover = urlCover.pathname.substring(1);
    const urlPreview = new URL(deletedSong.preview);
    const previousKeyPreview = urlPreview.pathname.substring(1);
    const urlAudio = new URL(deletedSong.audio);
    const previousKeyAudio = urlAudio.pathname.substring(1);

    try {
      await deleteFromS3({
        Bucket: s3Config.id,
        Key: previousKeyCover
      });
      await deleteFromS3({
        Bucket: s3Config.id,
        Key: previousKeyPreview
      });
      await deleteFromS3({
        Bucket: s3Config.id,
        Key: previousKeyAudio
      });
      console.log("Image, preview et audio supprimés avec succès");
    } catch (deleteError) {
      console.error("Erreur lors de la suppression de l'image:", deleteError);
      // On continue le processus même si la suppression échoue
    }

    return NextResponse.json({
      success: true,
      deletedOrders,
      deletedSong
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { songId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const song = await prisma.song.findUnique({
      where: { id: params.songId },
      include: {
        artists: true,
        genres: true,
        albums: true,
        orders: true
      }
    });

    if (!song) {
      return NextResponse.json({ error: "Titre non trouvé" }, { status: 404 });
    }

    // Vérifier que l'utilisateur est bien l'artiste du titre
    const userProfile = await prisma.profile.findFirst({
      where: {
        userId: session.user.id,
        artistMode: true,
        artist: {
          songs: {
            some: { id: params.songId }
          }
        }
      }
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Non autorisé à accéder à ce titre" },
        { status: 403 }
      );
    }

    return NextResponse.json({ song });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}
