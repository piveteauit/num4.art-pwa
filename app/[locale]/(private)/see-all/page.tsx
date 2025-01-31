import React from "react";
import Image from "next/image";
import { prisma } from "@/libs/prisma";
import { Link } from "@/navigation";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default async function Page() {
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
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <>
      <main className="w-screen flex-1 overflow-y-auto md:p-8">
        <section className="fixed w-full top-0 px-8 py-4 bg-base z-50 flex justify-between items-center">
          <Link href={"/"}>
            <Image
              alt="Logo"
              src={"/assets/images/logos/Logo_num4_V2_blanc.png"}
              width={120}
              height={40}
              className="object-contain"
            />
          </Link>
          <Link className="z-50" href={"/dashboard"}>
            <Image
              alt="Settings icon"
              src={"/assets/images/icons/settings.svg"}
              width={40}
              height={40}
              className="object-contain max-w-10"
            />
          </Link>
        </section>
        <section className="pt-20 p-2 w-screen overflow-y-auto lg:max-w-3xl lg:mt-10 pb-20 mx-auto">
          <h3 className="text-xl mb-4">Tous les morceaux</h3>
          <div className="grid grid-cols-2 gap-4 justify-center lg:grid-cols-4">
            {songs.map((s, i) => (
              <Link
                href={{
                  pathname: "/song",
                  query: { id: s.id }
                }}
                key={`song-${s.id}-${i}`}
                className="flex flex-col items-center"
              >
                <div className="relative h-[180px] w-[180px] m-auto rounded-md overflow-hidden">
                  <ImageWithFallback
                    src={s?.image || ""}
                    alt="jaquette musique"
                    width={180}
                    height={180}
                  />
                </div>
                <div className="flex flex-col items-start text-white mt-2">
                  <span className="block w-[180px] truncate">{s.title}</span>
                  <span className="text-xs opacity-75">
                    {s.artists?.[0]?.name || "Artiste inconnu"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
