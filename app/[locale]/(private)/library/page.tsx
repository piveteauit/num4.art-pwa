import { Link } from "@/navigation";
import Image from "next/image";
import { prisma } from "@/libs/prisma";
import { auth } from "@/auth";
import HeaderBorder from "@/components/ui/HeaderBorder";
import LibraryContent from "@/components/Library/LibraryContent";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export const dynamic = "force-dynamic";

const options = [
  { name: "Mes titres" },
  { name: "Playlists" },
  { name: "Artistes" },
  { name: "Albums" },
  { name: "Titres" },
  { name: "Favoris" }
];

export default async function Library() {
  const session = await auth();
  if (!session?.user?.profile?.id) {
    throw new Error("User profile not found");
  }
  const orders = await prisma.order.findMany({
    where: {
      profil: {
        id: session.user.profile?.id
      }
    },
    select: {
      songId: true
    }
  });

  const songs = await prisma.song.findMany({
    where: {
      id: {
        in: orders.map((o) => o.songId)
      }
    },
    include: {
      artists: true
    }
  });

  return (
    <main
      className="w-screen flex-1 md:p-8 pb-12 md:pb-24"
      style={
        {
          // paddingTop: "env(safe-area-inset-top)",
          // paddingBottom: "env(safe-area-inset-bottom)",
          // paddingLeft: "env(safe-area-inset-left)",
          // paddingRight: "env(safe-area-inset-right)"
        }
      }
    >
      <HeaderBorder>
        <h1 className="text-3xl md:text-4xl font-medium text-left ml-0">
          Collection
        </h1>
        <Link href={"/dashboard"}>
          <Image
            alt="Settings icon"
            src={"/assets/images/icons/settings.svg"}
            width={40}
            height={40}
            className="object-contain max-w-8"
          />
        </Link>
      </HeaderBorder>

      <LibraryContent songs={songs} options={options} />
    </main>
  );
}
