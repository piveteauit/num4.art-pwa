import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as Stripe.StripeConfig["apiVersion"]
});

export async function GET(
  request: Request,
  { params }: { params: { paymentId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const paymentId = params.paymentId;

    // Récupérer le PaymentIntent de Stripe pour vérifier l'authenticité
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

    // Vérifier que ce paiement appartient bien à l'utilisateur actuel
    if (paymentIntent.metadata.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Vous n'êtes pas autorisé à accéder à ce paiement" },
        { status: 403 }
      );
    }

    // Récupérer les détails du paiement depuis notre base de données
    const paymentLog = await prisma.paymentLog.findFirst({
      where: {
        paymentIntentId: paymentId,
        userId: session.user.id
      }
    });

    if (!paymentLog || !paymentLog.songId) {
      return NextResponse.json(
        { error: "Détails du paiement non trouvés" },
        { status: 404 }
      );
    }

    // Récupérer les informations sur le morceau séparément
    const song = await prisma.song.findUnique({
      where: { id: paymentLog.songId },
      include: {
        artists: {
          select: { name: true }
        }
      }
    });

    if (!song) {
      return NextResponse.json(
        { error: "Morceau associé au paiement non trouvé" },
        { status: 404 }
      );
    }

    // Préparer les informations pour le front-end
    const songInfo = {
      id: song.id,
      title: song.title,
      image: song.image || "",
      artistName: song.artists[0]?.name || "Artiste inconnu",
      price: paymentLog.amount
    };

    return NextResponse.json({
      paymentId,
      status: paymentLog.status,
      amount: paymentLog.amount,
      createdAt: paymentLog.createdAt,
      songInfo
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du paiement:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du paiement" },
      { status: 500 }
    );
  }
}
