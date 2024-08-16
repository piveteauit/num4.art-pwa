import { getGenerateMetadata } from "@/generateMetadata";
import CategoryFilter from "@/components/ui/CategoryFilter";
import Image from "next/image";
import { Link, redirect } from "@/navigation";
import prisma from "@/libs/prisma";
import { Artist, Profile } from "@prisma/client";
import { getServerSession } from "@/libs/next-auth";
import ClientComponent from "@/components/client/ClientComponent";
import LibraryFilter from "@/components/ui/LibraryFilter";

export const generateMetadata = getGenerateMetadata("home");



export default async function Page({ params }: any) {
  const session = await getServerSession();

  if (!session) return redirect("/me/signin");

  const songs = await prisma.song.findMany({
    include: {
      genres:true,
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
     <main className="flex flex-col h-screen w-screen items-center pb-10 md:p-10 " style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
     <section className="max-lg:max-w-xl mx-auto flex justify-between absolute w-full right-0 px-8 top-5 py-4 bg-base z-50 items-center">
          <Link href={"/"}>
            <Image
              alt="Logo"
              src={"/assets/images/logos/Logo_num4_V2_blanc.png"} 
              width={120} 
              height={40} 
              className="object-contain"
              layout="fixed"
            />
          </Link>

          <Link className="z-50" href={"/dashboard"}>
            <Image
              alt="Settings icon"
              src={"/assets/images/icons/settings.svg"}
              width={40}
              height={40}
              className="object-contain max-w-10"
              layout="responsive"
            />
          </Link>
        </section>

        <ClientComponent initialSongs={songs} initialArtists={artists} />
      </main>
    </>
  );
}