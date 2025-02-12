import { prisma } from "@/libs/prisma";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { artistId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const artist = await prisma.artist.findUnique({
      where: { id: params.artistId },
      include: {
        songs: {
          include: {
            artists: true,
            orders: true
          }
        },
        follows: true
      }
    });

    if (!artist) {
      return NextResponse.json(
        { error: "Artiste non trouvé" },
        { status: 404 }
      );
    }

    const stats = {
      totalSales: artist.songs.reduce(
        (acc, song) => acc + song.orders.length,
        0
      ),
      totalEarnings: artist.songs.reduce(
        (acc, song) => acc + song.orders.length * song.price,
        0
      ),
      totalFollowers: artist.follows.length,
      totalSongs: artist.songs.length
    };

    return NextResponse.json({
      songs: artist.songs,
      stats
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}
