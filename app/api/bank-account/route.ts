import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.profile?.artistId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const artist = await prisma.artist.findUnique({
      where: { id: session.user.profile.artistId },
      include: { bankAccount: true }
    });

    if (!artist) {
      return NextResponse.json(
        { error: "Profil artiste non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ bankAccount: artist.bankAccount });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.profile?.artistId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await request.json();

    const bankAccount = await prisma.bankAccount.upsert({
      where: { artistId: session.user.profile.artistId },
      update: data,
      create: {
        ...data,
        artistId: session.user.profile.artistId
      }
    });

    return NextResponse.json({ bankAccount });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
