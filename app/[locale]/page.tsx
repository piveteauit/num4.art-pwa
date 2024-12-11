import { getGenerateMetadata } from "@/generateMetadata";
import Image from "next/image";
import { Link } from "@/navigation";
import prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/next-auth";
import ClientComponent from "@/components/client/ClientComponent";
import { Provider } from "next-auth/providers";
import { authOptions } from "@/libs/next-auth";
import HomeHeader from "@/components/ui/Header/HomeHeader";

export const generateMetadata = getGenerateMetadata("home");

export default async function Page({ params }: any) {
  const session = await getServerSession();
  
  const providers = authOptions.providers?.map(
    (provider: Provider) => ({
      id: provider.id,
      name: provider.name,
      type: provider.type
    })
  );

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
    image: a?.profile?.[0]?.user?.image || "/assets/images/logos/meduse-icon.png"
  }));

  return (
    <>
      <main className="flex flex-col h-screen w-screen items-center pb-10 md:p-10">
        <HomeHeader session={session} providers={providers} />
        <ClientComponent initialSongs={songs} initialArtists={artists} />
      </main>
    </>
  );
}