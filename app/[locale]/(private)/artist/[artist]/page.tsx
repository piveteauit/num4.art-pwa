import { prisma } from "@/libs/prisma";
import { auth } from "@/auth";
import { FollowButton } from "./FollowButton";
import { Follow } from "@/types/follow";
import ScrollableSongsCards from "@/components/ui/ScrollableSongsCards";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import BackButton from "@/components/ui/Button/BackButton";
import ArtistPageClient from "../ArtistPageClient";

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

  // Récupération des titres de l'artiste
  const songs = await prisma.song.findMany({
    where: {
      artists: {
        some: {
          id: artist
        }
      }
    },
    include: {
      artists: true,
      genres: true
    }
  });

  // Vérifier si l'utilisateur suit déjà cet artiste
  const follow = artistFromDb?.follows?.find(
    (f) => f.profil.userId === user?.id
  );

  if (!artistFromDb) return null;

  // Récupérer l'image du profil de l'artiste si disponible
  const artistImage =
    artistFromDb.profile?.[0]?.user?.image ||
    "/assets/images/profile-placeholder.png";

  return (
    <ArtistPageClient>
      {/* Header avec bouton retour */}
      <BackButton />

      {/* Image et informations principales */}
      <div className="flex flex-col gap-6 items-center pt-4">
        <div className="relative w-[28svh] h-[28svh] mx-auto">
          <ImageWithFallback
            src={artistImage}
            alt={artistFromDb.name}
            fill
            className="object-cover rounded-full shadow-[1px_10px_49px_21px_rgba(255,255,255,0.05)]"
          />
        </div>

        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-bold text-white">{artistFromDb.name}</h1>

          {/* Statistiques */}
          <div className="flex justify-center gap-8 text-sm text-white/80 pt-2">
            <div>
              <span className="font-bold text-lg">{songs?.length} </span>
              <span>{songs?.length === 1 ? "titre" : "titres"}</span>
            </div>
            <div>
              <span className="font-bold text-lg">
                {artistFromDb?.follows?.length || 0}{" "}
              </span>
              <span>
                {artistFromDb?.follows?.length === 1 ? "abonné" : "abonnés"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton d'action */}
      <div className="flex justify-center mt-6">
        <FollowButton
          userId={user?.id}
          artistId={artistFromDb?.id}
          follow={follow as Follow}
        />
      </div>

      {/* Liste des titres avec le composant ScrollableSongsCards */}
      {songs.length > 0 ? (
        <ScrollableSongsCards
          title={`Les titres de ${artistFromDb.name}`}
          className="mt-12"
          songs={songs}
          artistName={artistFromDb.name}
          href={{
            pathname: "/artist/[artist]",
            params: { artist: artistFromDb.id }
          }}
        />
      ) : (
        <div className="mt-12 mx-6 p-6 bg-white/5 rounded-xl text-center">
          <p className="text-white/80">
            Cet artiste n'a pas encore publié de titres.
          </p>
        </div>
      )}
    </ArtistPageClient>
  );
}
