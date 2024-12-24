import { Song } from "@/types/song";
import CategoryTitle from "@/components/ui/CategoryTitle";
import SongCard from "@/components/ui/SongCard";

interface RelatedSongsProps {
  songs: Song[];
  artistName: string;
  title?: string;
  className?: string;
  href?:
    | {
        pathname: string;
        params: {
          artist: string;
        };
      }
    | string;
}

export default function ScrollableSongsCards({
  songs,
  artistName,
  title,
  className,
  href
}: RelatedSongsProps) {
  if (songs.length === 0) return null;

  return (
    <div className={className}>
      {title && <CategoryTitle title={title} href={href} />}
      <div className="flex gap-2 overflow-x-scroll scrollbar-hide max-lg:pr-4 lg:flex-nowrap lg:justify-start lg:mx-auto">
        {songs.map((song, i) => (
          <SongCard
            key={`song-${song.id}-${i}`}
            song={song}
            index={i}
            totalLength={songs.length}
          />
        ))}
      </div>
    </div>
  );
}
