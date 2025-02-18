import { NextResponse, NextRequest } from "next/server";
import { auth } from "@/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10" as Stripe.StripeConfig["apiVersion"]
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.priceId || !body.songId) {
    return NextResponse.json(
      { error: "PriceId et songId sont requis" },
      { status: 400 }
    );
  }

  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // Récupérer les détails du prix Stripe
    const price = await stripe.prices.retrieve(body.priceId);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: price.unit_amount!, // Montant en centimes
      currency: price.currency,
      metadata: {
        songId: body.songId,
        userId: session.user.id,
        priceId: price.id,
        productId: price.product as string
      },
      automatic_payment_methods: {
        enabled: true
      },
      description: `Achat du morceau - ${price.product}`,
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
