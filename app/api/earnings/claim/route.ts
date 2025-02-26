import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { sendEmail } from "@/libs/sendEmail";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.profile?.artistId) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { amount } = await request.json();

    // Vérifier si une demande est en cours
    const pendingRequest = await prisma.paymentRequest.findFirst({
      where: {
        bankAccount: {
          artistId: session.user.profile.artistId
        },
        status: "PENDING"
      }
    });

    if (pendingRequest) {
      return NextResponse.json(
        { error: "Une demande de paiement est déjà en cours" },
        { status: 400 }
      );
    }

    const bankAccount = await prisma.bankAccount.findUnique({
      where: { artistId: session.user.profile.artistId },
      include: {
        artist: {
          include: {
            profile: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!bankAccount) {
      return NextResponse.json(
        { error: "Compte bancaire non trouvé" },
        { status: 404 }
      );
    }

    // Créer la demande de paiement
    const paymentRequest = await prisma.paymentRequest.create({
      data: {
        amount,
        bankAccountId: bankAccount.id
      }
    });

    // Envoyer les emails
    await sendEmail({
      to: "mathisnepal@gmail.com",
      subject: `Demande de retrait - ${bankAccount.artist.name}`,
      priority: "high",
      text: `
        Nouvelle demande de retrait
        Artiste : ${bankAccount.artist.name}
        IBAN : ${bankAccount.iban}
        BIC : ${bankAccount.bic}
        Nom du titulaire : ${bankAccount.name}
        Montant demandé : ${amount}€
      `
    });

    await sendEmail({
      to: bankAccount.artist.profile[0].user.email,
      subject: "Confirmation de votre demande de retrait",
      text: `
        Cher(e) ${bankAccount.artist.name},
        
        Nous avons bien reçu votre demande de retrait de ${amount}€. Le virement sera effectué sous 48h ouvrés.
        
        Cordialement,
        L'équipe Num4
      `
    });

    return NextResponse.json({ success: true, paymentRequest });
  } catch (error) {
    console.error("Erreur lors de la demande de retrait:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
