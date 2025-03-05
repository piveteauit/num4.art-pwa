import { Song } from "@/types/song";
import { Link } from "@/navigation";
import ImageWithFallback from "@/components/ui/ImageWithFallback";

interface SongCardProps {
  song: Song;
  index: number;
  totalLength: number;
}

export default function SongCard({ song, index, totalLength }: SongCardProps) {
  if (!song.image) return null;
  return (
    // song.artists?.[0]?.name && (
    <Link
      href={{
        pathname: "/song",
        query: { id: song.id }
      }}
      className={`flex-shrink-0 w-[180px] flex-1`}
    >
      <div className="relative size-[180px] rounded-lg overflow-hidden">
        <ImageWithFallback
          src={song.image}
          alt={`Jaquette ${song.title}`}
          fill
          sizes="180px"
        />
      </div>
      <div className="mt-2 text-left">
        <h3 className="font-semibold truncate">{song.title}</h3>
        <p className="text-sm text-white/60 truncate">
          {song.artists?.[0]?.name || "Artiste inconnu"}
        </p>
      </div>
    </Link>
    // )
  );
}
