

import React from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';
import { GetServerSideProps } from 'next';
import prisma from '@/libs/prisma';

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
    <section className="p-2 w-screen lg:max-w-5xl lg:mt-10 pb-20 mx-auto">
      <h3 className="text-xl mb-4">Tous les morceaux</h3>
      <div className="grid grid-cols-2 gap-4 justify-center">
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
            <div className="flex flex-col items-center text-white mt-2">
              <span className="font-semibold">{s.title}</span>
              <span className="text-xs opacity-75">{s.artists?.[0]?.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};


