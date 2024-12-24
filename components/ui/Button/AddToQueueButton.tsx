"use client";

import { usePlayer } from "@/context/PlayerContext";
import { toast } from "react-hot-toast";
import { Song } from "@/types/song";
import Button from "@/components/ui/Button/Button";

interface AddToQueueButtonProps {
  song: Song;
}

export default function AddToQueueButton({ song }: AddToQueueButtonProps) {
  const {
    isQueueReady,
    currentPlaying,
    setCurrentQueue,
    currentQueuePosition
  } = usePlayer();

  const handleAddToQueue = () => {
    setCurrentQueue((prevQueue) => {
      const newQueue = [
        ...prevQueue.slice(0, currentQueuePosition + 1),
        song,
        ...prevQueue.slice(currentQueuePosition + 1)
      ];
      console.log("Nouvelle file d'attente:", newQueue); // Pour le débogage
      return newQueue;
    });
    toast.success("Ajouté à la file d'attente");
  };

  return (
    <Button
      onClick={handleAddToQueue}
      className="bg-white/10 border-none hover:bg-white/20 transition-colors text-white"
      disabled={currentPlaying === null || !isQueueReady}
    >
      <span className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m-8-8h16"
          />
        </svg>
        Lire ensuite
      </span>
    </Button>
  );
}
