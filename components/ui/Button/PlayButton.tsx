"use client";

import { usePlayer } from "@/context/PlayerContext";
import Button from "./Button";
import { useState } from "react";
import { Song } from "@/types/song";
import { usePlayMusic } from "@/hooks/usePlayMusic";

interface PlayButtonProps {
  song: Song;
  text: string;
}

export default function PlayButton({ song, text }: PlayButtonProps) {
  const { isQueueReady } = usePlayer();

  const { handlePlay } = usePlayMusic();

  console.log("song", song);
  return (
    <Button
      onClick={() => handlePlay(song)}
      className="bg-white text-black hover:scale-105 transition-transform"
      disabled={!isQueueReady}
    >
      <span className="flex items-center gap-2">
        {!isQueueReady ? (
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
        {text}
      </span>
    </Button>
  );
}
