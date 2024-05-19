import LibraryFilter from "@/components/ui/LibraryFilter";
import { Link } from "@/navigation";
import Image from "next/image";
import prisma from "@/libs/prisma";
import { getServerSession } from "@/libs/next-auth";

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
    <main className="w-screen h-screen overflow-hidden md:p-8 pb-12 md:pb-24 absolute top-0 left-0">
      <section className="max-w-xl mx-auto flex justify-between absolute w-full right-0 px-8 top-0 py-4 bg-base items-center">
        <h1 className="text-xl md:text-4xl font-medium">Bibliothèque</h1>
        <Link href={"/dashboard"}>
          <Image
            alt="Settings icon"
            src={"/assets/images/icons/settings.svg"}
            width={50}
            height={50}
            className="object-contain max-w-10"
            layout="responsive"
          />
        </Link>
      </section>

      <section className="flex flex-col gap-1 px-2 overflow-y-scroll max-h-[calc(100vh_-_120px)]">
        <div className="flex flex-col">
          <h2 className="text-xl mt-20 mb-2">Trier par </h2>
          <LibraryFilter options={options} />
        </div>

        <div className="flex flex-col gap-2">
          {songs.map(({ artists, title, image, id }, k: number) => {
            return (
              <Link
                href={{ pathname: "/player", query: { song: id } }}
                key={`${id}--${title}--2`}
                className="flex w-full p-1 gap-8"
              >
                <span className="relative w-[50px] h-[50px]]">
                  <Image
                    className="max-h-[50px] object-cover"
                    layout={"fill"}
                    alt={`Jaquette ${title}`}
                    src={image}
                  />
                </span>
                <div className="flex flex-col">
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
