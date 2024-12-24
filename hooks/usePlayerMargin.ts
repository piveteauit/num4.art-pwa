import { usePlayer } from "@/context/PlayerContext";

export const usePlayerMargin = ({ from0 = false }: { from0?: boolean } = {}) => {
  const { currentPlaying, isExpanded } = usePlayer();

  const getMargin = () => {
    if (!isExpanded && currentPlaying) {
      return from0 ? "80px" : "160px";
    }
    return from0 ? "0px" : "80px";
  };

  return { getMargin };
};
