import { Song } from "@/types/song";
import { Link } from "@/navigation";
import Image from "@/components/Image";

interface SongCardProps {
  song: Song;
  index: number;
  totalLength: number;
}

export default function SongCard({ song, index, totalLength }: SongCardProps) {
  return (
    <Link
      href={{
        pathname: "/song",
        query: { id: song.id }
      }}
      className="flex-shrink-0 w-[180px]"
    >
      <div className="relative w-[180px] h-[180px] rounded-lg overflow-hidden">
        <Image
          className="object-cover"
          alt={`Jaquette ${song.title}`}
          src={song.image}
          resourceType="song-cover"
          fill
        />
      </div>
      <div className="mt-2">
        <h3 className="font-semibold truncate">{song.title}</h3>
        <p className="text-sm text-white/60 truncate">
          {song.artists?.[0]?.name || "Artiste inconnu"}
        </p>
      </div>
    </Link>
  );
}
