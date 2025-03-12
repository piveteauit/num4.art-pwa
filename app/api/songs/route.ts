import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "12", 10);
  const skip = (page - 1) * limit;

  try {
    const songs = await prisma.song.findMany({
      include: {
        artists: {
          include: {
            profile: {
              include: {
                user: true
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      }
    });

    const totalCount = await prisma.song.count();

    return NextResponse.json({
      songs,
      totalCount,
      hasMore: skip + songs.length < totalCount
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des morceaux:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des morceaux" },
      { status: 500 }
    );
  }
}
