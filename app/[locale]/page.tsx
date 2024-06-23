import { getGenerateMetadata } from "@/generateMetadata";
import CategoryFilter from "@/components/ui/CategoryFilter";
import Image from "next/image";
import { Link, redirect } from "@/navigation";
import prisma from "@/libs/prisma";
import { Artist, Profile } from "@prisma/client";
import { getServerSession } from "@/libs/next-auth";

export const generateMetadata = getGenerateMetadata("home");

const categories = [
  { name: "Tout", all: true },
  { name: "Rap" },
  { name: "Rock" },
  { name: "Pop" },
  { name: "Electro" }
];

export default async function Page({ params }: any) {

  const session = await getServerSession();

  if (!session) return redirect("/me/signin");

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

  const artists = Object.values(
    await songs.reduce((acc: any, s) => {
      //@ts-ignore
      if (s.artists[0])
        //@ts-ignore
        s.artists[0].image =
          s.artists?.[0]?.profile?.[0]?.user?.image || s?.image;
      if (s.artists[0]) acc[s.artists[0].id] = s.artists[0];

      return acc;
    }, {})
  );

  console.log("songs", songs);

  return (
    <>
      <main className="flex flex-col h-screen w-screen items-center pb-10 md:p-10">
        <section className="max-lg:max-w-xl mx-auto flex justify-between absolute w-full right-0 px-8 top-0 py-4 bg-base z-50 items-center">
          <h1 className="text-xl md:text-4xl font-medium">Market place</h1>

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

        <section className="mt-20 p-2 w-screen lg:max-w-5xl lg:text-center">
          <span>Catégories</span>

          {/* <div className="flex gap-2">
            <CategoryFilter songs={songs} categories={categories} />
          </div> */}

          <h3 className="text-xl my-8"> Sortie récente </h3>

          <div className="flex gap-2 overflow-x-scroll max-lg:w-96 max-lg:pr-4 lg:flex-wrap lg:justify-center lg:mx-auto">
            {songs.map((s, i) => (
              <Link
                href={{
                  pathname: "/player",
                  query: { song: s.id }
                }}
                className="bg-base-100 bg-opacity-5 p-3 rounded-2xl overflow-hidden min-h-[180px] min-w-[160px] lg:w-[180px]"
                key={`song-${s.id}-${i}`}
              >
                <span className="block relative h-44 w-[140px] m-auto rounded-2xl overflow-hidden">
                  <Image
                    className="object-cover rounded-2xl"
                    alt="jaquette musique"
                    src={s?.image || ""}
                    layout="fill"
                  />
                </span>

                <div className="text-white flex flex-col">
                  <span>{s.title}</span>
                  <span className="text-xs opacity-75">
                    Par {s.artists?.[0]?.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="p-2 w-screen lg:max-w-5xl lg:mt-10 pb-20">
          <h3 className="text-xl"> Connaissez-vous ? </h3>

          <div className="flex gap-2 py-4 overflow-x-scroll flex-grow pr-4">
            {artists.map((artist: Artist & { profile: Profile }, i) => (
              <Link
                key={`home-artist-${i}-${artist.id}`}
                className="flex justify-center text-center  items-center gap-2 flex-col min-w-[100px]"
                href={{
                  pathname: "/artist/[artist]",
                  params: { artist: artist?.id }
                }}
              >
                <Image
                  layout="responsive"
                  height={100}
                  width={100}
                  alt="Artiste avatar N A I"
                  className="avatar rounded-full !w-[100px] !h-[100px] object-cover overflow-hidden"
                  // @ts-ignore
                  src={artist?.image || "/musics/artist-nai.jpg"}
                />
                <span>{artist?.name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* <div className="flex-[2] h-full w-full relative">
          <Link href={"/"}>
            <Image
              className="m-auto max-w-56 object-contain"
              alt="Logo n°4"
              layout="fill"
              src={"/assets/images/logos/logo.png"}
            />
          </Link>
        </div>

        <div className="flex-[1] w-full p-5 max-w-sm">
          <Login />
        </div> */}
      </main>
    </>
  );
}
