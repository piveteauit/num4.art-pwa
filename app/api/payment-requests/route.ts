import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const session = await auth();
    if (!session?.user?.profile?.artistId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const requests = await prisma.paymentRequest.findMany({
      where: {
        bankAccount: {
          artistId: session.user.profile.artistId
        }
      },
      include: {
        bankAccount: true
      },
      orderBy: {
        requestDate: "desc"
      }
    });

    return NextResponse.json(requests);
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

    const { amount } = await request.json();

    const bankAccount = await prisma.bankAccount.findUnique({
      where: { artistId: session.user.profile.artistId }
    });

    if (!bankAccount) {
      return NextResponse.json(
        { error: "Compte bancaire non trouvé" },
        { status: 404 }
      );
    }

    if (bankAccount.availableBalance < amount) {
      return NextResponse.json({ error: "Solde insuffisant" }, { status: 400 });
    }

    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        amount,
        bankAccountId: bankAccount.id
      }
    });

    return NextResponse.json(paymentRequest);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
