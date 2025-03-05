import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";
import { prisma } from "@/libs/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as Stripe.StripeConfig["apiVersion"]
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.songId) {
    return NextResponse.json({ error: "songId est requis" }, { status: 400 });
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer les détails de la chanson
    const song = await prisma.song.findUnique({
      where: { id: body.songId },
      include: { artists: true }
    });

    if (!song) {
      return NextResponse.json(
        { error: "Morceau non trouvé" },
        { status: 404 }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(song.price * 100), // Convertir en centimes
      currency: "eur",
      metadata: {
        songId: song.id,
        userId: session.user.id,
        songTitle: song.title,
        artistName: song.artists[0]?.name || "Artiste inconnu"
      },
      automatic_payment_methods: {
        enabled: true
      },
      description: `Achat du morceau - ${song.title} par ${song.artists[0]?.name || "Artiste inconnu"}`,
      statement_descriptor_suffix: "SOUNDFLEX"
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement" },
      { status: 500 }
    );
  }
}
