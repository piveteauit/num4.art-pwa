import { Song } from "@/types/song";
import { Link } from "@/navigation";
// import { SongsList } from "@/components/Songs/SongsList";
import { ArtistSongsList } from "@/components/Songs/ArtistSongsList";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";

interface ArtistDashboardProps {
  songs: Song[];
  stats: {
    totalSales: number;
    totalEarnings: number;
    totalFollowers: number;
    totalSongs: number;
  };
  isLoading: boolean;
}

export const ArtistDashboard = ({
  songs,
  stats,
  isLoading
}: ArtistDashboardProps) => {
  return (
    <section className="w-[100svw] mt-4 lg:max-w-3xl lg:text-center lg:left-[200px]">
      <div className="grid grid-cols-3 gap-4 mx-6 mb-8">
        <StatCard title="Ventes" value={stats.totalSales} />
        <StatCard title="Revenue" value={stats.totalEarnings} currency="€" />
        <StatCard title="Abonnés" value={stats.totalFollowers} />
        <StatCard title="Titres" value={stats.totalSongs} />
      </div>

      <div className="mx-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mes titres</h2>
          <Link
            href="/publish"
            className="bg-white text-black px-4 py-2 rounded-full text-sm hover:bg-white/90 transition"
          >
            Publier un titre
          </Link>
        </div>

        {isLoading || songs.length > 0 ? (
          <ArtistSongsList songs={songs} isLoading={isLoading} />
        ) : (
          <EmptyState
            title="Aucun titre publié"
            description="Commencez à publier votre musique dès maintenant"
            actionLabel="Publier un titre"
            actionLink={{ pathname: "/publish" }}
          />
        )}
      </div>
    </section>
  );
};
