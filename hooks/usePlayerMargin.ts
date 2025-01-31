import { usePlayer } from "@/context/PlayerContext";

export const usePlayerMargin = ({ from0 = false, fromValue }: { from0?: boolean, fromValue?: number } = {}) => {
  const { currentPlaying, isExpanded } = usePlayer();

  const getMargin = () => {
    if (!isExpanded && currentPlaying) {
      return fromValue ? fromValue : from0 ? "80px" : "160px";
    }
    return fromValue ? fromValue : from0 ? "0px" : "80px";
  };

  return { getMargin };
};
