import { usePlayer } from "@/context/PlayerContext";

export const usePlayerMargin = () => {
  const { currentPlaying, isExpanded } = usePlayer();

  const getBottomMargin = () => {
    if (!isExpanded && currentPlaying) {
      return "mb-[160px]";
    }
    return "mb-[80px]";
  };

  return { getBottomMargin };
}; 