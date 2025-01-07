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
  const songsComplete = songs.filter((song) => {
    return song.title;
    // song.title !== "Unknown" &&
    // song.image &&
    // song.audio &&
    // song.artists?.length > 0 &&
    // song.genres?.length > 0
  });
  if (songsComplete.length === 0) return null;

  return (
    <div className={className}>
      {title && <CategoryTitle title={title} href={href} />}
      <div className="flex gap-2 overflow-x-scroll scrollbar-hide max-lg:pr-4 lg:flex-nowrap lg:justify-start lg:mx-auto">
        {songsComplete.map((songComplete, i) => (
          <SongCard
            key={`song-${songComplete.id}-${i}`}
            song={songComplete}
            index={i}
            totalLength={songsComplete.length}
          />
        ))}
      </div>
    </div>
  );
}
