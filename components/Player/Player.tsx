"use client";

import { useState, useEffect, useRef, useCallback, ReactElement } from "react";
import { usePlayer } from "@/context/PlayerContext";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { getProfile } from "@/libs/server/user.action";
import { toast } from "react-hot-toast";
import AudioPlayer, { RHAP_UI } from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import type H5AudioPlayer from "react-h5-audio-player";
import debounce from "lodash/debounce";
import ButtonCheckout from "../ui/sf/ButtonCheckout";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Song } from "@/types/song";

interface CloseButtonProps {
  onClick: () => void;
  isExpanded: boolean;
}

interface DragEndResult {
  destination?: {
    index: number;
  };
  source: {
    index: number;
  };
}

const CloseButton: React.FC<CloseButtonProps> = ({ isExpanded, onClick }) => (
  <button
    onClick={onClick}
    className={`absolute top-4 right-4 text-white z-50 transition-opacity duration-300 ${
      isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"
    }`}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </button>
);

const PlaylistButton = ({ onClick }: { onClick: () => void }) => (
  <button
    className={`absolute top-4 right-16 text-white z-50 transition-opacity duration-300`}
    onClick={onClick}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>
);

const PlaylistView = ({
  songs,
  currentPlaying,
  currentIndex,
  onSelect,
  onClose,
  onRemove,
  onReorder
}: {
  songs: Song[];
  currentPlaying: Song;
  currentIndex: number;
  onSelect: (song: Song, index: number) => void;
  onClose: () => void;
  onRemove: (songId: string) => void;
  onReorder: (newOrder: Song[]) => void;
}) => {
  const { setCurrentQueue, currentQueuePosition } = usePlayer();

  // Obtenir uniquement les chansons restantes
  const remainingSongs = songs.slice(currentQueuePosition + 1);

  const handleDragEnd = (result: DragEndResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Ajuster les index pour prendre en compte le décalage
    const actualSourceIndex = sourceIndex + currentQueuePosition + 1;
    const actualDestinationIndex = destinationIndex + currentQueuePosition + 1;

    // Copier la queue complète
    const newQueue = [...songs];

    // Déplacer l'élément dans la queue complète
    const [movedItem] = newQueue.splice(actualSourceIndex, 1);
    newQueue.splice(actualDestinationIndex, 0, movedItem);

    setCurrentQueue(newQueue);
  };

  const handleSelectFromQueue = (song: Song, index: number) => {
    // Ajuster l'index pour prendre en compte les chansons déjà jouées
    const actualIndex = index + currentQueuePosition + 1;
    onSelect(song, actualIndex);
  };

  return (
    <div className="absolute top-0 right-0 w-full h-full bg-base backdrop-blur-lg p-4 overflow-y-auto z-50 border-l border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-medium">File d'attente</h3>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Morceau en cours de lecture */}
      <div className="mb-4 p-2 bg-white/5 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
            <Image
              src={currentPlaying.image}
              alt={currentPlaying.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate">
              {currentPlaying.title}
            </p>
            <p className="text-white/60 text-xs truncate">
              {currentPlaying.artists?.[0]?.name}
            </p>
          </div>
          <span className="text-emerald-400 text-xs">En cours de lecture</span>
        </div>
      </div>

      {remainingSongs.length === 0 ? (
        <p className="text-white/60 text-center py-4">
          Aucun morceau dans la file d'attente
        </p>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="playlist">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {remainingSongs.map((song, index) => (
                  <Draggable
                    key={`${song.id}-${index}`}
                    draggableId={`${song.id}-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.draggableProps.style}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors group
                          ${snapshot.isDragging ? "bg-white/20 shadow-lg" : "hover:bg-white/10"}`}
                      >
                        <button
                          onClick={() => onRemove(song.id)}
                          className="text-white/40 hover:text-red-500 transition-colors"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={song.image}
                            alt={song.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div
                          className="min-w-0 flex-1 cursor-pointer"
                          onClick={() => handleSelectFromQueue(song, index)}
                        >
                          <p className="text-white text-sm font-medium truncate">
                            {song.title}
                          </p>
                          <p className="text-white/60 text-xs truncate">
                            {song.artists?.[0]?.name}
                          </p>
                        </div>
                        <div
                          className="px-5 py-3"
                          {...provided.dragHandleProps}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-white/40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 6h16M4 12h16M4 18h16"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

function Player(): JSX.Element | null {
  const {
    setPaused,
    paused,
    currentPlaying,
    setCurrentPlaying,
    ownedSongs,
    setCurrentTime,
    isExpanded,
    setIsExpanded,
    loadOwnedSongs,
    currentQueue,
    setCurrentQueue,
    currentQueuePosition,
    setCurrentQueuePosition
  } = usePlayer();

  const { data: session } = useSession();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<H5AudioPlayer>(null);
  const [repeat, setRepeat] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      loadOwnedSongs(session.user.id).then((profile) => {
        if (profile) {
          setUserProfile(profile);
        }
      });
    }
  }, [session?.user?.id]);

  const hasSong = userProfile?.orders?.find(
    (o: any) => o.songId === currentPlaying?.id
  );

  const handleSongChange = (newPosition: number, isSameTrack: boolean) => {
    if (isSameTrack) {
      // Réinitialiser le temps de lecture
      const audioElement = audioRef.current?.audio.current;
      if (audioElement) {
        audioElement.currentTime = 0;
      }
      // Mettre à jour la position dans la queue
      setCurrentQueuePosition(newPosition);
    } else {
      setCurrentQueuePosition(newPosition);
      setCurrentPlaying(currentQueue[newPosition]);
    }
  };

  const handleNext = () => {
    if (!hasSong || currentQueue.length === 0) return;

    const nextPosition = currentQueuePosition + 1;

    if (nextPosition < currentQueue.length) {
      const isSameTrack =
        currentQueue[nextPosition].id === currentQueue[currentQueuePosition].id;
      handleSongChange(nextPosition, isSameTrack);
    } else {
      setCurrentQueuePosition(0);
      setCurrentPlaying(currentQueue[0]);
    }
    setPaused(false);
  };

  const handlePrevious = () => {
    if (!hasSong || currentQueue.length === 0) return;

    const previousPosition =
      currentQueuePosition > 0
        ? currentQueuePosition - 1
        : currentQueue.length - 1;

    const isSameTrack =
      currentQueue[previousPosition].id ===
      currentQueue[currentQueuePosition].id;
    handleSongChange(previousPosition, isSameTrack);
  };

  const handlePurchaseSuccess = useCallback(() => {
    if (session?.user?.id) {
      getProfile(session.user.id).then(setUserProfile).catch(console.error);
      loadOwnedSongs(session.user.id);
    }
  }, [session?.user?.id]);

  const handleRemoveFromQueue = (songId: string) => {
    const newQueue = currentQueue.filter((song, index) => {
      if (index === currentQueuePosition) return true; // Garder le morceau en cours
      return song.id !== songId;
    });

    setCurrentQueue(newQueue);
    // Ajuster la position si nécessaire
    if (currentQueuePosition >= newQueue.length) {
      setCurrentQueuePosition(0);
      setCurrentPlaying(newQueue[0]);
    }
  };

  const handleSelectFromPlaylist = (song: Song, index: number) => {
    setCurrentQueuePosition(index);
    setCurrentPlaying(currentQueue[index]);
    setPaused(false);
  };

  const handleEnded = () => {
    if (repeat) {
      // Si repeat est activé, on redémarre le même morceau
      const audioElement = audioRef.current?.audio.current;
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play();
      }
    } else {
      // Sinon on passe au morceau suivant
      handleNext();
    }
  };

  const handleReorderQueue = (newQueue: Song[]) => {
    const currentSong = currentQueue[currentQueuePosition];
    const newPosition = newQueue.findIndex(
      (song) => song.id === currentSong.id
    );

    setCurrentQueue(newQueue);
    if (newPosition !== -1) {
      setCurrentQueuePosition(newPosition);
      setCurrentPlaying(newQueue[newPosition]);
    }
  };

  const commonAudioProps = {
    ref: audioRef,
    src: currentPlaying?.preview || currentPlaying?.audio,
    autoPlay: !paused,
    onPlay: () => setPaused(false),
    onPause: () => setPaused(true),
    onEnded: handleEnded,
    showJumpControls: false,
    showSkipControls: hasSong,
    onClickPrevious: handlePrevious,
    onClickNext: handleNext,
    loop: false,
    customProgressBarSection: [
      RHAP_UI.CURRENT_TIME,
      RHAP_UI.PROGRESS_BAR,
      RHAP_UI.DURATION,
      <button
        key="repeat"
        onClick={() => setRepeat(!repeat)}
        className={`ml-4 ${repeat ? "text-white" : "text-white/40"} ${
          isExpanded ? "" : "hidden"
        }`}
      >
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    ] as Array<RHAP_UI | ReactElement>,
    customControlsSection: [RHAP_UI.MAIN_CONTROLS] as Array<
      RHAP_UI | ReactElement
    >,
    onListen: (e: Event) => {
      const audioElement = audioRef.current?.audio.current;
      if (audioElement && !isNaN(audioElement.currentTime)) {
        setCurrentTime(audioElement.currentTime);

        if (!hasSong && audioElement.currentTime >= 30) {
          audioElement.pause();
          audioElement.currentTime = 0;
          setPaused(true);
          toast.success("Extrait terminé");
        }
      }
    }
  };

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100dvh";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isExpanded]);

  if (!currentPlaying) return null;

  return (
    <>
      {isExpanded && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999998] isolate" />
      )}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? "100dvh" : "80px",
          bottom: isExpanded ? 0 : "73px"
        }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 w-full bg-base z-[99999999] isolate ${
          isExpanded
            ? "flex flex-col justify-center overflow-hidden"
            : "cursor-pointer"
        }`}
      >
        <CloseButton
          isExpanded={isExpanded}
          onClick={() => setIsExpanded(false)}
        />
        {hasSong && isExpanded && (
          <PlaylistButton onClick={() => setShowPlaylist(!showPlaylist)} />
        )}

        {showPlaylist && hasSong && (
          <PlaylistView
            songs={currentQueue}
            currentPlaying={currentPlaying}
            currentIndex={currentQueuePosition}
            onSelect={(song, index) => handleSelectFromPlaylist(song, index)}
            onClose={() => setShowPlaylist(false)}
            onRemove={handleRemoveFromQueue}
            onReorder={handleReorderQueue}
          />
        )}

        <div onClick={() => !isExpanded && setIsExpanded(true)}>
          {isExpanded ? (
            <>
              {!hasSong && (
                <p className="absolute top-4 left-4 text-red-300 text-sm z-10">
                  EXTRAIT DE 30 SECONDES
                </p>
              )}

              <div className="relative z-20">
                <div className="px-4">
                  <div className="relative w-64 h-64 mx-auto mb-8">
                    <Image
                      src={currentPlaying.image}
                      alt={currentPlaying.title}
                      fill
                      className="object-cover rounded-lg shadow-[1px_10px_49px_21px_rgba(255,255,255,0.05)]"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-white text-center">
                    {currentPlaying.title}
                  </h2>
                  <p className="text-gray-400 text-center mb-6">
                    {currentPlaying.artists?.[0]?.name}
                  </p>
                  {/* <p className="text-gray-white text-center mb-8">
                    prix : {currentPlaying?.price}
                    <sup className="font-normal ml-1">{"€"}</sup>
                  </p> */}
                </div>
              </div>

              {!hasSong && (
                <div className="relative flex items-center justify-center gap-5 z-20 max-w-full">
                  {/* <p className="text-white text-center">
                    Profiter du titre en entier :
                  </p> */}
                  <ButtonCheckout
                    songId={currentPlaying?.id}
                    profileId={userProfile?.id}
                    onSuccess={handlePurchaseSuccess}
                    label={
                      <span className="text-center">
                        <span className="font-bold pt-2">
                          {/* Acheter le titre pour */}
                          {currentPlaying?.price}
                          <sup className="font-normal ml-1">{"€"}</sup>
                        </span>
                      </span>
                    }
                    priceId="price_1JZ6ZyJ9zvZ2Xzvz1Z6ZyJ9z"
                  />
                </div>
              )}
              <div className="absolute inset-0 overflow-hidden z-0">
                <Image
                  src={currentPlaying.image}
                  alt={currentPlaying.title}
                  fill
                  className="object-cover blur-xl opacity-50"
                  priority
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 p-4 border-t  border-white/20 ">
              <div className="relative h-12 w-12 rounded-md overflow-hidden">
                <Image
                  className="object-cover"
                  alt="jaquette musique"
                  src={currentPlaying.image}
                  layout="fill"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-white">
                  {currentPlaying.title}
                </h4>
                <span className="text-sm opacity-70">
                  {currentPlaying.artists?.[0]?.name}
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className={`relative z-20 ${
            isExpanded
              ? hasSong
                ? "player-expanded"
                : "player-expanded-no-song"
              : "player-minimized bg-base!"
          }`}
        >
          <AudioPlayer
            layout={isExpanded ? "stacked-reverse" : "stacked-reverse"}
            {...commonAudioProps}
          />
        </div>
      </motion.div>
    </>
  );
}

export default Player;
