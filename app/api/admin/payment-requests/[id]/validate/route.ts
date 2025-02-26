import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { sendEmail } from "@/libs/sendEmail";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const admin = await prisma.admin.findUnique({
      where: { userId: session?.user?.id }
    });

    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Utiliser une transaction pour mettre à jour à la fois la demande de paiement et le solde
    const paymentRequest = await prisma.$transaction(async (tx) => {
      // Récupérer d'abord la demande de paiement pour avoir le montant
      const request = await tx.paymentRequest.findUnique({
        where: { id: params.id },
        include: {
          bankAccount: {
            include: {
              artist: true
            }
          }
        }
      });

      if (!request) {
        throw new Error("Demande de paiement non trouvée");
      }

      // Mettre à jour le solde disponible
      await tx.bankAccount.update({
        where: { id: request.bankAccountId },
        data: {
          availableBalance: {
            decrement: request.amount
          }
        }
      });

      // Mettre à jour le statut de la demande
      return await tx.paymentRequest.update({
        where: { id: params.id },
        data: {
          status: "PAID",
          paymentDate: new Date()
        },
        include: {
          bankAccount: {
            include: {
              artist: true
            }
          }
        }
      });
    });

    // Envoyer un email de confirmation à l'artiste
    await sendEmail({
      to: paymentRequest.bankAccount.email,
      subject: "Votre paiement a été effectué",
      text: `
        Cher(e) ${paymentRequest.bankAccount.artist.name},
        
        Nous vous confirmons que votre paiement de ${paymentRequest.amount}€ a été effectué.
        Il devrait apparaître sur votre compte bancaire dans les prochains jours.
        
        Cordialement,
        L'équipe Num4
      `
    });

    return NextResponse.json(paymentRequest);
  } catch (error) {
    console.error("Erreur lors de la validation du paiement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
