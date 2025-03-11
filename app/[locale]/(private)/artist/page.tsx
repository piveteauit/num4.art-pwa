import { prisma } from "@/libs/prisma";
import { auth } from "@/auth";
import Image from "next/image";
import { Link } from "@/navigation";
import CategoryFilter from "@/components/ui/CategoryFilter";
import BackButton from "@/components/ui/Button/BackButton";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { redirect } from "next/navigation";

// Client component pour les fonctionnalités interactives
import ArtistPageClient from "./ArtistPageClient";

// Catégories pour le filtre
const categories = [
  { name: "Tout", all: true },
  { name: "Rap" },
  { name: "Rock" },
  { name: "Pop" },
  { name: "Electro" }
];

export default async function ArtistPage({
  searchParams
}: {
  searchParams: { id?: string };
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Si un ID d'artiste est fourni, afficher les détails de cet artiste
  if (searchParams.id) {
    const artist = await prisma.artist.findUnique({
      where: { id: searchParams.id },
      include: {
        profile: {
          include: {
            user: true
          }
        },
        songs: {
          include: {
            artists: true,
            genres: true
          }
        }
      }
    });

    if (!artist) return null;

    return (
      <ArtistPageClient>
        {/* Header avec bouton retour */}
        <BackButton />

        {/* Profil de l'artiste */}
        <div className="flex flex-col gap-4 items-center">
          <div className="relative w-[28svh] h-[28svh] mx-auto">
            <ImageWithFallback
              src={
                // artist?.profile?.avatar ||
                "/assets/images/profile-placeholder.png"
              }
              alt={artist.name}
              fill
              className="object-cover rounded-full shadow-[1px_10px_49px_21px_rgba(255,255,255,0.05)]"
            />
          </div>

          <div className="flex flex-col gap-1 text-center">
            <h1 className="text-2xl font-bold text-white">{artist.name}</h1>
            <p className="text-white/80">
              {/* {artist.profile?.bio || "Aucune biographie disponible"} */}
              { "Aucune biographie disponible"}
            </p>
          </div>
        </div>

        {/* Liste des morceaux de l'artiste */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold mb-4">
            Morceaux ({artist.songs.length})
          </h2>

          <div className="flex flex-col gap-4">
            {artist.songs.map((song) => (
              <Link
                key={song.id}
                href={{
                  pathname: "/song",
                  query: { id: song.id }
                }}
                className="flex items-center gap-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
              >
                <div className="relative w-14 h-14 flex-shrink-0">
                  <ImageWithFallback
                    src={song.image}
                    alt={song.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-medium">{song.title}</h3>
                  <div className="flex gap-2 mt-1">
                    {song.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="text-xs text-white/60 px-2 py-0.5 rounded-full bg-white/10"
                      >
                        {genre.label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="ml-auto">
                  <p className="font-semibold">{song.price}€</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </ArtistPageClient>
    );
  }

  // Sinon, afficher la liste des artistes (découverte)
  const artists = await prisma.artist.findMany({
    include: {
      profile: true,
      songs: {
        include: {
          genres: true,
          artists: true
        }
      }
    }
  });

  return (
    <ArtistPageClient>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Découvrir les artistes</h1>
        <Link href="/account">
          <Image
            alt="Paramètres"
            src="/assets/images/icons/settings.svg"
            width={32}
            height={32}
            className="object-contain"
          />
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="text-xl mb-3">Filtrer par genre</h2>
        <CategoryFilter categories={categories} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={{
              pathname: "/artist",
              query: { id: artist.id }
            }}
            className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <div className="relative w-16 h-16 flex-shrink-0">
              <ImageWithFallback
                src={
                  // artist.profile?.avatar ||
                  "/assets/images/profile-placeholder.png"
                }
                alt={artist.name}
                fill
                className="object-cover rounded-full"
              />
            </div>
            <div>
              <h3 className="font-medium text-lg">{artist.name}</h3>
              <p className="text-white/60 text-sm">
                {artist.songs.length} morceaux
              </p>
            </div>
          </Link>
        ))}
      </section>
    </ArtistPageClient>
  );
}
