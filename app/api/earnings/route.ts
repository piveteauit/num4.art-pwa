import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

// Forcer le mode dynamique pour cette route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.profile?.artistId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const artist = await prisma.artist.findUnique({
      where: {
        id: session.user.profile.artistId
      },
      include: {
        bankAccount: {
          include: {
            paymentRequests: {
              orderBy: {
                requestDate: "desc"
              }
            }
          }
        },
        profile: {
          select: {
            user: {
              select: {
                email: true
              }
            }
          }
        }
      }
    });

    if (!artist) {
      return NextResponse.json(
        { error: "Artiste non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      availableBalance: artist.bankAccount?.availableBalance ?? 0,
      bankInfo: artist.bankAccount
        ? {
            name: artist.bankAccount.name,
            iban: artist.bankAccount.iban,
            bic: artist.bankAccount.bic,
            email: artist.profile[0].user.email,
            artistName: artist.name,
            availableBalance: artist.bankAccount.availableBalance
          }
        : null,
      pendingRequests:
        artist.bankAccount?.paymentRequests.filter(
          (request) => request.status === "PENDING"
        ) ?? []
    });
  } catch (error) {
    console.error("Erreur dans /api/earnings:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
