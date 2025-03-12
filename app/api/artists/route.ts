import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const skip = (page - 1) * limit;

  try {
    const artists = (
      await prisma.artist.findMany({
        include: {
          profile: {
            include: {
              user: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          name: "asc"
        }
      })
    ).map((a) => ({
      id: a.id,
      name: a.name,
      image:
        a.profile?.[0]?.user?.image || "/assets/images/logos/meduse-icon.png"
    }));

    const totalCount = await prisma.artist.count();

    return NextResponse.json({
      artists,
      totalCount,
      hasMore: skip + artists.length < totalCount
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des artistes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des artistes" },
      { status: 500 }
    );
  }
}
