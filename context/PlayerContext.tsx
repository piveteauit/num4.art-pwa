"use client";

import { getAllSongs } from "@/libs/server/song.action";
import { useSession } from "next-auth/react";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef
} from "react";
import type H5AudioPlayer from "react-h5-audio-player";
import { getProfile } from "@/libs/server/user.action";
import { Song } from "@/types/song";

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
  fetchSongs: () => Promise<void>;
  audioRef: React.RefObject<H5AudioPlayer>;
  ownedSongs: Song[];
  setOwnedSongs: React.Dispatch<React.SetStateAction<Song[]>>;
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  loadOwnedSongs: (userId: string) => Promise<any>;
  currentQueue: Song[];
  setCurrentQueue: React.Dispatch<React.SetStateAction<Song[]>>;
  currentQueuePosition: number;
  setCurrentQueuePosition: React.Dispatch<React.SetStateAction<number>>;
  isQueueReady: boolean;
  // initializeQueue: (userId: string) => Promise<any>;
}

const defaultProps: Partial<PlayerContextProps> = {
  currentPlaying: null,
  paused: true,
  volume: 1,
  currentTime: 0,
  ownedSongs: [],
  isExpanded: false,
  currentQueue: [],
  currentQueuePosition: 0
};

const PlayerContext = createContext<PlayerContextProps>(undefined);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentPlaying, setCurrentPlaying] = useState(
    defaultProps.currentPlaying
  );
  const [paused, setPaused] = useState(defaultProps.paused);
  const [volume, setVolume] = useState(defaultProps.volume);
  const [currentTime, setCurrentTime] = useState(defaultProps.currentTime);
  const [currentList, setCurrentList] = useState([]);
  const [ownedSongs, setOwnedSongs] = useState(defaultProps.ownedSongs);
  const [isExpanded, setIsExpanded] = useState(defaultProps.isExpanded);
  const [currentQueue, setCurrentQueue] = useState<Song[]>(
    defaultProps.currentQueue || []
  );
  const [currentQueuePosition, setCurrentQueuePosition] = useState(
    defaultProps.currentQueuePosition
  );
  const audioRef = useRef<H5AudioPlayer>(null);
  const { data: session } = useSession();
  const [isQueueReady, setIsQueueReady] = useState(false);

  const loadOwnedSongs = async (userId: string) => {
    try {
      const profile = await getProfile(userId);
      const allSongs = await getAllSongs();

      const purchasedSongIds =
        profile?.orders?.map((order: any) => order.songId) || [];
      const userOwnedSongs = allSongs.filter((song) =>
        purchasedSongIds.includes(song.id)
      );

      setOwnedSongs(userOwnedSongs);
      setIsQueueReady(true);
      return profile;
    } catch (error) {
      console.error("Error loading owned songs:", error);
      return null;
    }
  };
  // Fonction pour initialiser/mettre à jour la queue
  // const initializeQueue = async (userId: string) => {
  //   console.log("initializeQueue");
  //   try {
  //     const profile = await getProfile(userId);
  //     const purchasedSongIds =
  //       profile?.orders?.map((order: any) => order.songId) || [];
  //     // On stocke les chansons possédées dans ownedSongs, mais pas dans la queue
  //     const purchasedSongs = ownedSongs.filter((song) =>
  //       purchasedSongIds.includes(song.id)
  //     );
  //     setOwnedSongs(purchasedSongs);
  //     setIsQueueReady(true);
  //     return profile;
  //   } catch (error) {
  //     console.error("Error initializing queue:", error);
  //     return null;
  //   }
  // };

  useEffect(() => {
    if (session?.user?.id) {
      loadOwnedSongs(session.user.id);
      // initializeQueue(session.user.id);
    }
  }, [session?.user?.id]);

  const fetchSongs = async () => {
    try {
      const songs = await getAllSongs();
      setCurrentList(songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentPlaying,
        setCurrentPlaying,
        paused,
        setPaused,
        volume,
        setVolume,
        currentTime,
        setCurrentTime,
        currentList,
        setCurrentList,
        fetchSongs,
        audioRef,
        ownedSongs,
        setOwnedSongs,
        isExpanded,
        setIsExpanded,
        loadOwnedSongs,
        currentQueue,
        setCurrentQueue,
        currentQueuePosition,
        setCurrentQueuePosition,
        isQueueReady
        // initializeQueue
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error("usePlayer must be used within a PlayerProvider");
  }
  return context;
};
