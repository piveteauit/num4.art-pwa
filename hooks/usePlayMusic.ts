import { usePlayer } from "@/context/PlayerContext";
import { Song } from "@/types/song";

export const usePlayMusic = () => {
  const { setCurrentQueue, setCurrentQueuePosition, setCurrentPlaying, setPaused, setIsExpanded, ownedSongs } = usePlayer();

  const handlePlay = (song: Song) => {
    const otherOwnedSongs = ownedSongs.filter((s) => s.id !== song.id);

    setCurrentQueue([song, ...otherOwnedSongs]);
    setCurrentQueuePosition(0);
    setCurrentPlaying(song);
    setPaused(false);
    setIsExpanded(false);
  };

  return { handlePlay };
};
