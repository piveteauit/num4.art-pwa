"use client";

import { getAllSongs } from "@/libs/server/song.action";
import { createContext, useContext, useState } from "react";

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
  const [currentList, setCurrentList] = useState([]);

  const fetchSongs = () => {
    getAllSongs()
      .then(setCurrentList)
      .catch(console.error)
  }

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
