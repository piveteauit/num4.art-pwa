
import LibraryFilter from "@/components/ui/LibraryFilter";
import { Link } from "@/navigation";
import Image from "next/image";
import prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/next-auth";
import {useState} from "react";
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

  const session = await getServerSession();
  const setCurrent = () => {}
  const orders = await prisma.order.findMany({
    where: {
      profil: {
        id: session?.user?.profile?.id
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
    <main className="w-screen h-screen overflow-hidden md:p-8 pb-12 md:pb-24" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)', paddingLeft: 'env(safe-area-inset-left)', paddingRight: 'env(safe-area-inset-right)' }}>
      <div className="max-lg:max-w-xl mx-auto flex justify-between absolute w-full right-0 px-8 top-3 py-4 bg-base z-50 items-center">
        <h1 className="text-4xl md:text-4xl font-medium text-left ml-0">Collection</h1>
        <Link href={"/dashboard"} className="ml-0">
          <Image
            alt="Settings icon"
            src={"/assets/images/icons/settings.svg"}
            width={30}
            height={30}
            className="object-contain max-w-10"
            layout="responsive"
          />
        </Link>
      </div>

      <section className="flex flex-col gap-1 px-2 overflow-y-scroll overflow-x-hidden max-h-[calc(100vh_-_120px)] lg:mx-[200px]">
        <div className="flex flex-col ml-4">
          <h2 className="text-xl mt-20 mb-2 ">Trier par</h2>
          <LibraryFilter options={options} />
        </div>

        <div className="flex flex-col gap-2 ml-4">
          {songs.map(({ artists, title, image, id }, k: number) => {
            return (
              <Link
                href={{ pathname: "/player", query: { song: id } }}
                key={`${id}--${title}--2`}
                className="flex w-full p-1 gap-8 ml-4"
              >
                <span className="relative w-[50px] h-[50px] ml-4">
                  <Image
                    className="max-h-[50px] object-cover"
                    layout={"fill"}
                    alt={`Jaquette ${title}`}
                    src={image}
                  />
                </span>
                <div className="flex flex-col ml-4">
                  <h4 className="font-semibold text-xl">{title}</h4>
                  <Link
                    href={{
                      pathname: "/artist/[artist]",
                      params: { artist: artists?.[0]?.name }
                    }}
                    className="opacity-60"
                  >
                    {artists?.[0]?.name}
                  </Link>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}