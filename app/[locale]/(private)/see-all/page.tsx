
import React from 'react';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import prisma from '@/libs/prisma';
import { getServerSession } from "@/libs/next-auth";
import { Link, redirect } from "@/navigation";

export default async function Page() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/me/welcome");
    return null;
  }
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

    <main className="w-screen h-screen overflow-y-auto md:p-8 pb-12 md:pb-24">
    <section className="fixed w-full top-0 px-8 py-4 bg-base z-50 flex justify-between items-center">
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
    <section className="pt-20 p-2 w-screen overflow-y-auto lg:max-w-5xl lg:mt-10 pb-20 mx-auto">
      <h3 className="text-xl mb-4">Tous les morceaux</h3>
      <div className="grid grid-cols-2 gap-4 justify-center lg:grid-cols-4">
        {songs.map((s, i) => (
          <Link
            href={{
              pathname: "/player",
              query: { song: s.id }
            }}
            key={`song-${s.id}-${i}`}
            className="flex flex-col items-center"
          >
            <div className="relative h-[180px] w-[180px] m-auto rounded-md overflow-hidden">
              <Image
                className="object-cover rounded-md"
                alt="jaquette musique"
                src={s?.image || ""}
                width={180}
                height={180}
              />
            </div>
            <div className="flex flex-col items-start text-white mt-2">
            <span
                className="block w-[180px] truncate"

  >
    {s.title}
  </span>
              <span className="text-xs opacity-75" >{s.artists?.[0]?.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
    </main>
    </>
  );
}
