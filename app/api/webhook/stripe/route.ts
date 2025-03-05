import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { buySong } from "@/libs/server/song.action";
import { prisma } from "@/libs/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as Stripe.StripeConfig["apiVersion"]
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Erreur de signature webhook:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  // Traitement des paiements réussis
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;

    try {
      // Récupérer les métadonnées du paiement
      const { songId, userId } = paymentIntent.metadata;

      if (!songId || !userId) {
        throw new Error("Métadonnées de paiement incomplètes");
      }

      // Récupérer le profil de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { Profile: true }
      });

      if (!user?.Profile?.length) {
        throw new Error("Profil utilisateur non trouvé");
      }

      // Enregistrer l'achat du morceau
      await buySong({
        songId: songId,
        profileId: user.Profile[0].id
      });

      return NextResponse.json({ received: true });
    } catch (error) {
      console.error("Erreur détaillée:", error);
      return NextResponse.json(
        { error: "Erreur lors du traitement" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
