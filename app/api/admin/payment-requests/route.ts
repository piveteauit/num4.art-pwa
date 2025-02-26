import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    const admin = await prisma.admin.findUnique({
      where: { userId: session?.user?.id }
    });

    if (!admin) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const requests = await prisma.paymentRequest.findMany({
      include: {
        bankAccount: {
          include: {
            artist: true
          }
        }
      },
      orderBy: [{ status: "asc" }, { requestDate: "desc" }]
    });

    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
