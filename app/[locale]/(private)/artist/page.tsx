"use client";
import CategoryFilter from "@/components/ui/CategoryFilter";
import { Link } from "@/navigation";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";

export const dynamic = "force-dynamic";

const categories = [
  { name: "Tout", all: true },
  { name: "Rap" },
  { name: "Rock" },
  { name: "Pop" },
  { name: "Electro" }
];

export default async function Artist() {
  const prisma = new PrismaClient();

  const songs = await prisma.song.findMany({
    include: {
      artists: true
    }
  })

  return (
    <main className="w-screen h-screen overflow-hidden p-8 pb-24 absolute top-0 left-0">
      <section className="max-w-xl mx-auto flex justify-between absolute w-full right-0 px-8 top-0 py-4 bg-base items-center">
        <h1 className="text-xl md:text-4xl font-medium">
          Découvrir les artistes
        </h1>
        <Link href={"/dashboard"}>
          <Image
            alt="Settings icon"
            src={"/assets/images/icons/settings.svg"}
            width={40}
            height={40}
            className="object-contain max-w-10 "
            layout="responsive"
          />
        </Link>
      </section>

      <section>
        <h2 className="text-xl mt-20 mb-2">Trier par </h2>
        <CategoryFilter songs={songs} categories={categories} />
      </section>

      <section className="flex flex-col gap-1 px-2 py-5">
        {songs.map(({ artists, title, image, id }, k: number) => {
          return (
            <Link
              key={`${id}--1`}
              href={{ pathname: "/player", query: { song: k } }}
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
      </section>
    </main>
  );
}
