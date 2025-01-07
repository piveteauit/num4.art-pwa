import { getGenerateMetadata } from "@/generateMetadata";
import { prisma } from "@/libs/prisma";
import HomeHeader from "@/components/ui/Header/HomeHeader";
import HomeContent from "@/components/HomeContent";

export const generateMetadata = getGenerateMetadata("home");

export default async function Page({ params }: any) {
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
    <main className="flex flex-col flex-1  w-screen items-center pb-10 md:p-10">
      <HomeHeader />
      <HomeContent songs={songs} artists={artists} />
    </main>
  );
}
