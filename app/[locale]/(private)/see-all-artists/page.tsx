import React from "react";
import Image from "next/image";
import { prisma } from "@/libs/prisma";
import { auth } from "@/auth";
import { Link, redirect } from "@/navigation";

export default async function Page() {

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
      <main className="w-screen h-screen overflow-y-auto md:p-8 pb-12 md:pb-24">
        <section className="fixed w-full top-0 px-8 py-2 bg-base z-50 flex justify-between items-center">
          <Link href={"/"}>
            <Image
              alt="Logo"
              src={"/assets/images/logos/Logo_num4_V2_blanc.png"}
              width={150}
              height={50}
              className="object-contain"
              layout="fixed"
            />
          </Link>
          <Link className="z-50" href={"/dashboard"}>
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

        <section className="pt-20 p-2 w-screen overflow-y-auto lg:max-w-3xl lg:mt-10 pb-20 mx-auto">
          <h3 className="text-xl mb-4">Tous les artistes</h3>
          <div className="grid grid-cols-2 gap-4 justify-center lg:grid-cols-4">
            {artists.map((artist, i) => (
              <Link
                href={{
                  pathname: "/artist/[artist]",
                  query: { id: artist.id },
                  params: { artist: artist?.id }
                }}
                key={`artist-${artist?.id}-${i}`}
                className="flex flex-col items-center"
              >
                <div className="relative h-[180px] w-[180px] m-auto rounded-full overflow-hidden">
                  <Image
                    className="object-cover rounded-2xl"
                    alt="jaquette musique"
                    src={artist?.profile?.[0]?.user?.image || ""}
                    layout="fill"
                  />
                </div>
                <div className="flex flex-col items-center text-white mt-2">
                  <span className="font-semibold">{artist.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
