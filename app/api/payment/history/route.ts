import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    // Récupérer les logs de paiement de l'utilisateur
    const paymentLogs = await prisma.paymentLog.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Enrichir les données avec les informations de chanson et d'artiste
    const enrichedLogs = await Promise.all(
      paymentLogs.map(async (log) => {
        // Si pas de songId, retourner le log tel quel
        if (!log.songId) {
          return {
            ...log,
            song: null
          };
        }

        // Récupérer les informations de la chanson
        const song = await prisma.song.findUnique({
          where: { id: log.songId },
          include: {
            artists: {
              select: { name: true }
            }
          }
        });

        if (!song) {
          return {
            ...log,
            song: null
          };
        }

        // Retourner le log enrichi avec les infos de la chanson
        return {
          ...log,
          song: {
            id: song.id,
            title: song.title,
            image: song.image,
            artists: song.artists.map((artist) => ({ name: artist.name }))
          }
        };
      })
    );

    return NextResponse.json({ paymentLogs: enrichedLogs });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique" },
      { status: 500 }
    );
  }
}
