"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button/Button";
import LayoutPublishStep from "./LayoutPublishStep";

interface AudioPreviewSelectorProps {
  audioFile: File | null;
  onPreviewGenerated: (preview: Blob) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const Submit = ({
  onPrevious,
  onNext
}: {
  onPrevious: () => void;
  onNext: () => void;
}) => {
  return (
    <div className="flex justify-between gap-4 absolute max-lg:bottom-[75px] max-lg:left-6 max-lg:right-6">
      <Button color="base" className="flex-1 opacity-60" onClick={onPrevious}>
        Précédent
      </Button>
      <Button color="primary" className="flex-1" onClick={onNext}>
        Suivant
      </Button>
    </div>
  );
};

export default function AudioPreviewSelector({
  audioFile,
  onPreviewGenerated,
  onNext,
  onPrevious
}: AudioPreviewSelectorProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [previewStartTime, setPreviewStartTime] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  // On garde uniquement la mesure du viewport
  useEffect(() => {
    if (viewportRef.current) {
      const updateWidth = () => {
        setViewportWidth(viewportRef.current?.offsetWidth || 0);
      };

      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  useEffect(() => {
    if (!audioFile) return;
    const audioUrl = URL.createObjectURL(audioFile);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }
    return () => URL.revokeObjectURL(audioUrl);
  }, [audioFile]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.currentTime = previewStartTime;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Gérer la fin des 30 secondes et la mise à jour du temps
  useEffect(() => {
    if (!audioRef.current) return;

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const time = audioRef.current.currentTime;
        if (time >= previewStartTime + 30) {
          audioRef.current.pause();
          setIsPlaying(false);
          setCurrentTime(30);
        } else {
          requestAnimationFrame(() => {
            setCurrentTime(Math.max(0, time - previewStartTime));
          });
        }
      }
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    return () =>
      audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
  }, [previewStartTime]);

  // Gérer le scroll horizontal
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!containerRef.current || !duration) return;

    setIsScrolling(true);
    audioRef.current?.pause();
    setIsPlaying(false);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 2500);

    const container = containerRef.current;
    const scrollPosition = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    // Calculer le temps proportionnellement à la position du scroll
    const newStartTime = (scrollPosition / maxScroll) * (duration - 30);
    setPreviewStartTime(Math.max(0, Math.min(newStartTime, duration - 30)));

    // Réinitialiser le temps courant
    setCurrentTime(0);
  };

  // Nettoyer le timeout
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Fonction pour formater le temps en minutes:secondes
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    // if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    // }
    // return `${seconds} s`;
  };

  const generatePreview = async () => {
    if (!audioFile) return;

    try {
      // 1. Lire le fichier audio
      const audioContext = new AudioContext();
      const audioData = await audioFile.arrayBuffer();
      const fullAudioBuffer = await audioContext.decodeAudioData(audioData);

      // 2. Calculer les paramètres de l'extrait
      const sampleRate = fullAudioBuffer.sampleRate;
      const startOffset = Math.floor(previewStartTime * sampleRate);
      const length = Math.floor(30 * sampleRate);

      // 3. Créer un nouveau buffer pour les 30 secondes
      const previewBuffer = audioContext.createBuffer(
        fullAudioBuffer.numberOfChannels,
        length,
        sampleRate
      );

      // 4. Copier l'extrait sélectionné
      for (
        let channel = 0;
        channel < fullAudioBuffer.numberOfChannels;
        channel++
      ) {
        const channelData = fullAudioBuffer.getChannelData(channel);
        const previewData = previewBuffer.getChannelData(channel);

        for (let i = 0; i < length; i++) {
          if (startOffset + i < channelData.length) {
            previewData[i] = channelData[startOffset + i];
          }
        }
      }

      // 5. Convertir en format binaire
      const offlineContext = new OfflineAudioContext(
        previewBuffer.numberOfChannels,
        length,
        sampleRate
      );

      const source = offlineContext.createBufferSource();
      source.buffer = previewBuffer;
      source.connect(offlineContext.destination);
      source.start();

      const renderedBuffer = await offlineContext.startRendering();

      // 6. Convertir en Blob MP3
      const preview = new Blob(
        [Int16Array.from(renderedBuffer.getChannelData(0))],
        { type: "audio/mp3" }
      );

      onPreviewGenerated(preview);
      onNext();
    } catch (error) {
      console.error("Erreur lors de la génération de la preview:", error);
    }
  };

  return (
    <LayoutPublishStep
      title="Choisis ton extrait"
      description="Il pourra être écouté par les utilsateurs gratuitement"
      onPrevious={onPrevious}
      onNext={generatePreview}
      className=""
    >
      <audio
        ref={audioRef}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
      />
      <div className="flex flex-col flex-1 w-full items-center justify-center">
        <div className="rounded-xl shadow-lg w-full">
          <div className="px-6 lg:pt-6">
            <div className="flex items-center justify-center gap-4">
              <div className="w-10 h-10">&nbsp;</div>
              <div className="w-1/2 relative h-1 bg-white/40 rounded-full">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: `${(30 / duration) * 100}%` }}
                  transition={{
                    duration: 0.016, // ~60fps
                    ease: "linear",
                    type: "tween"
                  }}
                  className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-primary rounded-full transition-all duration-100"
                  style={{
                    left: `${(previewStartTime / duration) * 100}%`
                  }}
                />
              </div>
              <button
                onClick={handlePlayPause}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-primary hover:bg-primary/90 transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* <div className="flex items-center gap-4">
            <div className="text-sm font-medium">
              {formatTime(previewStartTime)} -{" "}
              {formatTime(Math.min(previewStartTime + 30, duration))}
            </div>
          </div> */}
          </div>

          <motion.div
            className="mx-auto mb-6 bg-white w-10 h-6 flex items-center justify-center rounded-full text-black text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: isScrolling ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {formatTime(previewStartTime)}
          </motion.div>

          <div className="relative h-20">
            <div
              ref={containerRef}
              className="absolute inset-0 overflow-x-auto scrollbar-hide overflow-y-hidden rounded-b-lg"
              onScroll={handleScroll}
            >
              <div
                ref={viewportRef}
                className="sticky overflow-hidden rounded-lg left-1/2 transform -translate-x-1/2 h-full w-32"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-primary"
                  animate={{ width: `${(currentTime / 30) * 100}%` }}
                  transition={{
                    duration: 0.016, // ~60fps
                    ease: "linear",
                    type: "tween"
                  }}
                  initial={{ width: "0%" }}
                />
                <div className="absolute inset-0 border-4 rounded-lg border-primary z-[3]" />
              </div>

              <div
                className="absolute inset-y-0"
                style={{
                  paddingLeft: `calc(50% - ${viewportWidth / 2}px)`,
                  paddingRight: `calc(50% - ${viewportWidth / 2}px)`
                }}
              >
                <div className="flex h-full items-center justify-start gap-[6px] relative z-[1]">
                  {Array(Math.ceil(duration * 4))
                    .fill(0)
                    .map((_, i) => {
                      // Calculer si la barre est dans le viewport
                      const barPosition = i * (6 + 6); // largeur + gap
                      const viewportStart =
                        containerRef.current?.scrollLeft || 0;
                      const viewportEnd = viewportStart + viewportWidth;
                      const isInViewport =
                        barPosition >= viewportStart &&
                        barPosition <= viewportEnd;

                      return (
                        <div
                          key={i}
                          className="flex-none w-[6px] bg-white rounded-full transition-all duration-75"
                          style={{
                            height: isInViewport
                              ? i % 2 === 0
                                ? "32px"
                                : "20px" // Plus grand dans le viewport
                              : i % 2 === 0
                                ? "28px"
                                : "16px", // Taille normale hors viewport
                            opacity: isPlaying ? isInViewport ? 0.7 : 0.55 : 0.7
                          }}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutPublishStep>
  );
}
