import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { buySong } from "@/libs/server/song.action";
import { prisma } from "@/libs/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia" as Stripe.StripeConfig["apiVersion"]
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

  // Traiter l'événement en fonction de son type
  switch (event.type) {
    case "payment_intent.succeeded":
      return await handlePaymentIntentSucceeded(event);
    case "payment_intent.payment_failed":
      return await handlePaymentIntentFailed(event);
    case "payment_intent.requires_action":
      return await handlePaymentIntentRequiresAction(event);
    case "payment_intent.canceled":
      return await handlePaymentIntentCanceled(event);
    case "charge.refunded":
      return await handleChargeRefunded(event);
    case "charge.dispute.created":
      return await handleChargeDisputeCreated(event);
    default:
      console.log(`Événement non géré: ${event.type}`);
      return NextResponse.json({ received: true });
  }
}

// Traitement des paiements réussis
async function handlePaymentIntentSucceeded(event: Stripe.Event) {
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

    // Enregistrer le paiement réussi dans les logs
    try {
      await prisma.paymentLog.create({
        data: {
          userId,
          songId,
          status: "SUCCEEDED",
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100 // Convertir de centimes à euros
        }
      });
    } catch (logError) {
      console.error(
        "Erreur lors de l'enregistrement du log de paiement:",
        logError
      );
      // Continuer malgré l'erreur de log
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement" },
      { status: 500 }
    );
  }
}

// Traitement des paiements échoués
async function handlePaymentIntentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  try {
    const { songId, userId, songTitle } = paymentIntent.metadata;

    // Enregistrer l'échec de paiement dans les logs
    console.error(
      `Paiement échoué pour la chanson "${songTitle}" (ID: ${songId}) par l'utilisateur ${userId}`
    );

    // Enregistrer l'échec dans les logs si possible
    try {
      await prisma.paymentLog.create({
        data: {
          userId,
          songId,
          status: "FAILED",
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          errorMessage:
            paymentIntent.last_payment_error?.message || "Paiement échoué"
        }
      });
    } catch (logError) {
      console.error(
        "Erreur lors de l'enregistrement du log d'échec:",
        logError
      );
      // Continuer malgré l'erreur de log
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur lors du traitement de l'échec de paiement:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de l'échec" },
      { status: 500 }
    );
  }
}

// Traitement des paiements nécessitant une action supplémentaire
async function handlePaymentIntentRequiresAction(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  try {
    const { songId, userId, songTitle } = paymentIntent.metadata;

    console.log(
      `Action supplémentaire requise pour le paiement de "${songTitle}" (ID: ${songId}) par l'utilisateur ${userId}`
    );

    // Enregistrer dans les logs pour suivi
    try {
      await prisma.paymentLog.create({
        data: {
          userId,
          songId,
          status: "FAILED", // On considère temporairement comme un échec jusqu'à confirmation
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          errorMessage: "Action supplémentaire requise (3D Secure, etc.)"
        }
      });
    } catch (logError) {
      console.error("Erreur lors de l'enregistrement du log:", logError);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur de traitement:", error);
    return NextResponse.json(
      { error: "Erreur de traitement" },
      { status: 500 }
    );
  }
}

// Traitement des paiements annulés
async function handlePaymentIntentCanceled(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  try {
    const { songId, userId, songTitle } = paymentIntent.metadata;

    console.log(
      `Paiement annulé pour "${songTitle}" (ID: ${songId}) par l'utilisateur ${userId}`
    );

    // Enregistrer dans les logs
    try {
      await prisma.paymentLog.create({
        data: {
          userId,
          songId,
          status: "FAILED",
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          errorMessage: "Paiement annulé"
        }
      });
    } catch (logError) {
      console.error("Erreur lors de l'enregistrement du log:", logError);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur de traitement:", error);
    return NextResponse.json(
      { error: "Erreur de traitement" },
      { status: 500 }
    );
  }
}

// Traitement des remboursements
async function handleChargeRefunded(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;

  try {
    // Récupérer l'ID du PaymentIntent associé à ce remboursement
    const paymentIntentId = charge.payment_intent as string;

    // Récupérer le PaymentIntent pour obtenir les métadonnées
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const { songId, userId } = paymentIntent.metadata;

    if (!songId || !userId) {
      throw new Error(
        "Métadonnées de paiement incomplètes pour le remboursement"
      );
    }

    // Récupérer le profil de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { Profile: true }
    });

    if (!user?.Profile?.length) {
      throw new Error("Profil utilisateur non trouvé pour le remboursement");
    }

    // Supprimer l'ordre (achat) correspondant
    await prisma.order.deleteMany({
      where: {
        AND: [{ songId: songId }, { profil: { id: user.Profile[0].id } }]
      }
    });

    // Enregistrer le remboursement dans les logs si possible
    try {
      await prisma.paymentLog.create({
        data: {
          userId,
          songId,
          status: "REFUNDED",
          paymentIntentId: paymentIntentId,
          amount: charge.amount_refunded / 100
        }
      });
    } catch (logError) {
      console.error(
        "Erreur lors de l'enregistrement du log de remboursement:",
        logError
      );
      // Continuer malgré l'erreur de log
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur lors du traitement du remboursement:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du remboursement" },
      { status: 500 }
    );
  }
}

// Traitement d'une dispute (contestation)
async function handleChargeDisputeCreated(event: Stripe.Event) {
  const dispute = event.data.object as Stripe.Dispute;

  try {
    // Récupérer l'ID du PaymentIntent associé à cette dispute
    const chargeId = dispute.charge as string;
    const charge = await stripe.charges.retrieve(chargeId);
    const paymentIntentId = charge.payment_intent as string;

    // Récupérer le PaymentIntent pour obtenir les métadonnées
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const { songId, userId } = paymentIntent.metadata;

    if (userId) {
      // Enregistrer la dispute dans les logs si possible
      try {
        await prisma.paymentLog.create({
          data: {
            userId,
            songId: songId || null,
            status: "DISPUTED",
            paymentIntentId: paymentIntentId,
            amount: dispute.amount / 100,
            errorMessage: dispute.reason || "Dispute créée"
          }
        });
      } catch (logError) {
        console.error(
          "Erreur lors de l'enregistrement du log de dispute:",
          logError
        );
        // Continuer malgré l'erreur de log
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur lors du traitement de la dispute:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement de la dispute" },
      { status: 500 }
    );
  }
}
