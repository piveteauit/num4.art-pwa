import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const artists = (
      await prisma.artist.findMany({
        include: {
          profile: {
            include: {
              user: true
            }
          }
        }
      })
    ).map((a) => ({
      ...a,
      image:
        a?.profile?.[0]?.user?.image || "/assets/images/logos/meduse-icon.png"
    }));

    return NextResponse.json({ artists });
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    return NextResponse.json(
      { error: "Failed to upload file to S3" },
      { status: 500 }
    );
  }
}
