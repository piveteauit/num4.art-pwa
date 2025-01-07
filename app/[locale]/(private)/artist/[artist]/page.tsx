import Button from "@/components/ui/Button/Button";
import { Link } from "@/navigation";
import Image from "next/image";
import { prisma } from "@/libs/prisma";
import { auth } from "@/auth";
import { FollowButton } from "./FollowButton";
import { Follow } from "@/types/follow";
import ScrollableSongsCards from "@/components/ui/ScrollableSongsCards";

export const dynamic = "force-dynamic";

export default async function Artist({ params: { artist } }: any) {
  artist = decodeURIComponent(artist);
  const session = await auth();
  const user = session?.user;

  const artistFromDb = await prisma.artist.findUnique({
    where: { id: artist },
    include: {
      profile: {
        include: {
          user: true
        }
      },
      follows: {
        select: {
          id: true,
          profil: {
            select: {
              userId: true
            }
          }
        }
      }
    }
  });
  const songs = await prisma.song.findMany({
    where: {
      artists: {
        some: {
          id: artist
        }
      }
    },

    include: {
      artists: true
    }
  });

  const follow = artistFromDb?.follows?.find(
    (f) => f.profil.userId === user?.id
  );

  return (
    <div
      className="w-screen h-screen overflow-hidden py-8 pb-24 absolute top-0 left-0 pt-[40vh] overflow-y-scroll bg-cover bg-left-top bg-fixed "
      style={{
        backgroundImage: `url(${artistFromDb?.profile?.[0]?.user?.image || "/musics/artist-nai.jpg"})`
      }}
    >
      <section className="max-w-xl mx-auto  flex justify-between  fixed w-full right-0 px-8 top-0 py-4 items-center ">
        <h1 className="text-xl md:text-4xl font-medium ml-[-960px]">
          {artistFromDb?.name}
        </h1>
        <Link href={"/dashboard"}>
          <Image
            alt="Settings icon"
            src={"/assets/images/icons/settings.svg"}
            width={50}
            height={50}
            className="object-contain max-w-10"
          />
        </Link>
      </section>

      <div
        className="flex justify-center items-center"
        style={{ marginTop: "-100px" }}
      >
        <div className="relative h-60 w-60 rounded-full overflow-hidden">
          <Image
            className="object-cover rounded-2xl"
            alt="jaquette musique"
            src={
              artistFromDb?.profile?.[0]?.user?.image ||
              "/musics/artist-nai.jpg"
            }
            fill
          />
        </div>
      </div>

      <div className="h-full min-h-[100dvh] -mb-[60px] rounded-t-3xl bg-base ">
        <section className="flex justify-between p-4">
          <div className="flex flex-col">
            <div>
              <span className="font-bold text-xl">{songs?.length} </span>
              <span className="opacity-60">
                {songs?.length === 1 ? "produit" : "produits"}
              </span>
            </div>
            <div>
              <span className="font-bold text-xl">
                {artistFromDb?.follows?.length}{" "}
              </span>
              <span className="opacity-60">
                {artistFromDb?.follows?.length === 1 ? "abonné" : "abonnés"}
              </span>
            </div>
          </div>

          <div>
            <FollowButton
              {...{
                userId: user?.id,
                artistId: artistFromDb?.id,
                follow: follow as Follow
              }}
            />
          </div>
        </section>

        {/* <section className="flex flex-col gap-1 px-2 py-5"> */}
        <ScrollableSongsCards
          className="mt-10"
          title={`Les titres de ${artistFromDb?.name}`}
          songs={songs}
          artistName={artistFromDb?.name}
        />
      </div>
    </div>
  );
}
