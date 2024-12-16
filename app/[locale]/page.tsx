import { getGenerateMetadata } from "@/generateMetadata";
import { prisma } from "@/libs/prisma";
import ClientComponent from "@/components/client/ClientComponent";
import HomeHeader from "@/components/ui/Header/HomeHeader";
import { auth } from "@/auth";

export const generateMetadata = getGenerateMetadata("home");

export default async function Page({ params }: any) {
  const session = await auth();

  const songs = await prisma.song.findMany({
    include: {
      genres: true,
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
    orderBy: {
      createdAt: "desc"
    }
  });

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

  return (
    <>
      <main className="flex flex-col h-screen w-screen items-center pb-10 md:p-10">
        <HomeHeader/>
        <ClientComponent initialSongs={songs} initialArtists={artists} />
      </main>
    </>
  );
}
