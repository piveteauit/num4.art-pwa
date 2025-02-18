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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Récupérer l'utilisateur
      const user = await prisma.user.findUnique({
        where: { id: session.client_reference_id! },
        include: { Profile: true }
      });

      if (!user?.Profile) {
        throw new Error("Profil utilisateur non trouvé");
      }

      // Récupérer le produit pour avoir le song_id
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      const priceId = lineItems.data[0].price?.id;
      const price = await stripe.prices.retrieve(priceId!);
      const product = await stripe.products.retrieve(price.product as string);

      // Le song_id est dans les metadata du produit
      const songId = product.metadata.song_id || product.metadata.songId;

      if (!songId) {
        throw new Error("ID du morceau non trouvé dans les metadata");
      }

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
