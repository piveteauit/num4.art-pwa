"use client";

import { getAllSongs } from "@/libs/server/song.action";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface PlayerContextProps {
  currentPlaying?: string | null | any;
  setCurrentPlaying: React.Dispatch<React.SetStateAction<string | null | any>>;
  paused?: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  volume?: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  currentTime?: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  currentList?: any[];
  setCurrentList: React.Dispatch<React.SetStateAction<any[]>>;
  fetchSongs: any;
}

const defaultProps: Partial<PlayerContextProps> = {
  currentPlaying: null,
  paused: true,
  volume: 1,
  currentTime: 0
};
const PlayerContext = createContext<PlayerContextProps>(undefined);

const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [currentTime, setCurrentTime] = useState(defaultProps.currentTime);
  const [paused, setPaused] = useState(defaultProps.paused);
  const [volume, setVolume] = useState(defaultProps.volume);
  const [currentPlaying, setCurrentPlaying] = useState(
    defaultProps.currentPlaying
  );
  const { data } = useSession();
  const [currentList, setCurrentList] = useState([]);
  const [ready, setReady] = useState(false);

  const fetchSongs = () => {
    getAllSongs()
      .then((s) => {
        setCurrentList(
          s.map((song) => {
            return {
              ...song,
              liked: song.favorites.some(
                (f) => f.profil.userId === data?.user?.id
              )
            };
          })
        );
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!data?.user?.id || !currentList.length || ready) return;

    setCurrentList(
      currentList.map((song) => {
        return {
          ...song,
          liked: song.favorites.some(
            (f: any) => f.profil.userId === data?.user?.id
          )
        };
      })
    );

    setReady(true);
  }, [data, currentList, ready]);

  useEffect(() => {
    if (!currentList.length || currentPlaying) return;
    setCurrentPlaying(
      currentList.find((s) => s.id === localStorage.getItem("songId")) ||
        currentList[0]
    );
  }, [currentList]);

  useEffect(() => {
    try {
      if (currentPlaying?.id)
        localStorage.setItem("songId", currentPlaying?.id);
    } catch (e) {
      console.error(e);
    }
  }, [currentPlaying]);

  return (
    <PlayerContext.Provider
      value={{
        currentTime,
        setCurrentTime,
        paused,
        setPaused,
        volume,
        setVolume,
        currentPlaying,
        setCurrentPlaying,
        currentList,
        setCurrentList,
        fetchSongs
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer: () => PlayerContextProps = (): PlayerContextProps => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used in a context");
  }
  return context;
};

export default PlayerProvider;
