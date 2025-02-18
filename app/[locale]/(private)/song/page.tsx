import { prisma } from "@/libs/prisma";
import { auth } from "@/auth";
import Image from "next/image";
import { Link } from "@/navigation";
import PlayButton from "@/components/ui/Button/PlayButton";
import ButtonCheckout from "@/components/ui/sf/ButtonCheckout";
import SongPageClient from "./SongPageClient";
import AddToQueueButton from "@/components/ui/Button/AddToQueueButton";
import ScrollableSongsCards from "@/components/ui/ScrollableSongsCards";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

export default async function SongPage({
  searchParams
}: {
  searchParams: { id: string };
}) {
  const session = await auth();
  const songId = searchParams.id;
  const song = await prisma.song.findUnique({
    where: { id: songId },
    include: {
      artists: {
        include: {
          profile: {
            include: {
              user: true
            }
          }
        }
      },
      genres: true
    }
  });

  const userProfile = session?.user?.id
    ? await prisma.profile.findFirst({
        where: { userId: session.user.id },
        include: { orders: true, artist: { include: { songs: true } } }
      })
    : null;

  const hisSong = userProfile?.artist?.songs.some((song) => song.id === songId);
  const hasSong =
    userProfile?.orders?.some((order) => order.songId === songId) ||
    hisSong ||
    false;
  const songBySameArtist = await prisma.song.findMany({
    where: {
      AND: [
        { artists: { some: { id: song?.artists[0]?.id } } },
        { id: { not: songId } } // Exclure le son actuel
      ]
    },
    include: {
      artists: {
        include: {
          profile: {
            include: {
              user: true
            }
          }
        }
      },
      genres: true
    }
  });

  if (!song) return null;

  return (
    <SongPageClient>
      {!hasSong && (
        <p className="absolute top-4 right-4 text-red-300 text-sm z-10">
          EXTRAIT DE 30 SECONDES
        </p>
      )}
      {/* <div className="relative pt-20"> */}
      {/* Header avec bouton retour */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-10">
        <Link href="/" className="text-white/60 hover:text-white">
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      </div>

      {/* Image et informations principales */}
      <div className="flex flex-col gap-4 items-center">
        <div className="relative w-[28svh] h-[28svh] mx-auto ">
          <ImageWithFallback
            src={song.image}
            alt={song.title}
            fill
            className="object-cover rounded-lg shadow-[1px_10px_49px_21px_rgba(255,255,255,0.05)]"
          />
        </div>

        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold text-white">{song.title}</h1>
          <Link
            href={{
              pathname: "/artist/[artist]",
              params: { artist: song.artists[0]?.id }
            }}
            className="text-xl text-white/80 hover:text-white hover:underline"
          >
            {song.artists[0]?.name || "Unknown Artist"}
          </Link>
          <div className="flex gap-2 text-sm text-white/60">
            {song.genres.map((genre) => (
              <span
                key={genre.id}
                className="px-2 py-1 rounded-full bg-white/10"
              >
                {genre.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-4 justify-center mt-8">
        <PlayButton
          song={song}
          text={`Lecture ${hasSong ? "" : "de l'extrait"}`}
        />
        {hasSong && <AddToQueueButton song={song} />}
        {!hasSong && (
          <ButtonCheckout
            isArtist={userProfile?.artist ? true : false}
            label={
              <span className="flex items-center gap-2">
                <span>Acheter</span>
                <span className="font-bold">{song.price}€</span>
              </span>
            }
            song={song}
          />
        )}
      </div>
      {songBySameArtist.length > 0 && (
        <ScrollableSongsCards
          title={`Plus de titres de ${song.artists[0]?.name}`}
          className="mt-12"
          songs={songBySameArtist}
          artistName={song.artists[0]?.name}
          href={{
            pathname: "/artist/[artist]",
            params: { artist: song.artists[0]?.id }
          }}
        />
      )}

      {/* Description */}
      {song.description && (
        <div className="mt-12 mx-6 p-6 bg-white/5 rounded-xl">
          <h2 className="text-xl font-semibold text-white mb-4">À propos</h2>
          <p className="text-white/80 leading-relaxed">{song.description}</p>
        </div>
      )}
    </SongPageClient>
  );
}
