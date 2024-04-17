"use client";
import { usePlayer } from "@/context/PlayerContext";
import React, { ReactHTMLElement, useEffect, useRef } from "react";
import Button from "../ui/Button/Button";
import { usePathname } from "@/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

function getTimeArr(time: number) {
  let hour = 0,
    min = Math.floor(time / 60),
    sec = Math.round(time % 60);

  if (min >= 60) {
    hour = Math.floor(min / 60);
    min = Math.round(min % 60);
  }
  const timeArr = [
    sec.toString().padStart(2, "0"),
    ":",
    min.toString().padStart(2, "0")
  ];
  if (hour) {
    timeArr.push(":");
    timeArr.push(hour.toString().padStart(2, "0"));
  }
  return timeArr;
  // return `${hour ? hour.toString().padStart(2, "0") + ":" : ""}${min
  //   .toString()
  //   .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

function Player() {
  const {
    paused,
    setPaused,
    currentPlaying,
    currentList,
    setCurrentPlaying,
    setCurrentList,
    currentTime,
    setCurrentTime,
    fetchSongs
  } = usePlayer();
  const audioRef = useRef<ReactHTMLElement<HTMLAudioElement> | any>();
  const path = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!currentPlaying) setCurrentPlaying(currentList[0]);
    if (!currentList?.length) fetchSongs();
  }, []);

  useEffect(() => {
    console.log(currentList)
    const song = Number(searchParams.get("song"));
    if (typeof song === "string" && song) {
      setCurrentPlaying(currentList?.find(s => s.id === song))
    }
  }, [searchParams]);

  useEffect(() => {
    if (audioRef.current) {
      if (paused) audioRef.current.pause();
      if (!paused) audioRef.current.play();
    }
  }, [paused]);

  useEffect(() => {
    if (currentTime === Number(audioRef.current?.duration)) {
      const songIndex = currentList?.indexOf(currentPlaying);
      setCurrentPlaying(
        currentList[songIndex < currentList?.length - 1 ? songIndex + 1 : 0]
      );
    }
  }, [currentTime]);

  const isPlayerScreen = path === "/player";

  const playerHeight = !isPlayerScreen ? "h-0 hidden" : "h-6";

  return (
    <>
      {!isPlayerScreen ? null : (
        <div
          style={{ backgroundImage: `url(${currentPlaying?.image})` }}
          className={`bg-left-top bg-cover h-screen pb-24 overflow-hidden w-full fixed top-0 left-0 flex flex-col justify-center items-center`}
        >
          <div className="absolute top-0 left-0 w-full h-full backdrop-blur-md bg-[rgba(0,0,0,.1)]" />
          <div className="relative h-60 w-60 rounded-2xl overflow-hidden">
            <Image
              className="object-cover rounded-2xl"
              alt="jaquette musique"
              src={currentPlaying?.image || ""}
              layout="fill"
            />
          </div>

          <h3 className="text-3xl text-center text-white relative z-10">
            {currentPlaying?.title}
          </h3>
          <h4 className="text-md text-center -mb-5 text-white relative z-10">
            Par {currentPlaying?.artists?.[0]?.name || "N/A"}
          </h4>
        </div>
      )}

      <div
        className={`absolute bottom-[90px] py-2 left-0 w-full ${playerHeight} flex justify-around items-center`}
      >
        <div className="absolute rounded-full -top-8 left-2  right-2 w-98 h-5 ">
          <input
            onChange={({ target: { value } }) => {
              setCurrentTime(Number(value));
              audioRef.current.currentTime = Number(value);
            }}
            type="range"
            max={audioRef?.current?.duration}
            value={currentTime}
            className="absolute w-full h-full bg-[red] -top-3"
          />

          <div className="flex flex-row justify-between">
            <span>{getTimeArr(currentTime).reverse()}</span>
            <span>{getTimeArr(audioRef?.current?.duration).reverse()}</span>
          </div>
        </div>

        {!currentPlaying?.audio ? null : (
          <audio
            onTimeUpdate={(evt) =>
              setCurrentTime(evt?.currentTarget?.currentTime)
            }
            autoPlay={!paused}
            src={currentPlaying?.preview || currentPlaying?.audio}
            ref={audioRef}
          />
        )}

        <Button
          className="!text-white border-none rounded-full min-h-0 w-10 h-10  relative !bg-[transparent]"
          onClick={() => {
            const newList = [...currentList];
            setCurrentList(newList.reverse());
          }}
        >
          <Image
            layout="fill"
            className="text-white object-contain"
            alt="Icon next song"
            src={
              currentList?.[0]?.name
                ? require("@/public/assets/images/icons/shuffle.svg")
                : require("@/public/assets/images/icons/unshuffle.svg")
            }
          />
        </Button>

        <Button
          className="!text-white border-none rounded-full min-h-0 w-10 h-10 relative !bg-[transparent]"
          onClick={() => {
            const songIndex = currentList?.indexOf(currentPlaying);
            setCurrentPlaying(
              currentList[songIndex ? songIndex - 1 : currentList?.length - 1]
            );
          }}
        >
          <Image
            layout="fill"
            className="text-white object-contain"
            alt="Icon previous song"
            src={require("@/public/assets/images/icons/previoussong.svg")}
          />
        </Button>

        <Button
          className="!text-white !border-white border-2 rounded-full p-2 min-h-0 w-10 h-10 relative !bg-[transparent]"
          onClick={() => {
            setPaused((p) => !p);
          }}
        >
          <Image
            layout="fill"
            className={`text-white object-contain max-w-[30px] m-auto rounded-full ${paused ? "ml-[6px]" : ""}`}
            alt={`Icon ${paused ? "play" : "pause"} song`}
            src={
              paused
                ? require("@/public/assets/images/icons/play.svg")
                : require("@/public/assets/images/icons/pause.svg")
            }
          />
        </Button>

        <Button
          className="!text-white border-none rounded-full min-h-0 w-10 h-10  relative !bg-[transparent]"
          onClick={() => {
            const songIndex = currentList?.indexOf(currentPlaying);
            setCurrentPlaying(
              currentList[
                songIndex < currentList?.length - 1 ? songIndex + 1 : 0
              ]
            );
          }}
        >
          <Image
            layout="fill"
            className="text-white object-contain"
            alt="Icon next song"
            src={require("@/public/assets/images/icons/nextsong.svg")}
          />
        </Button>

        <Button
          className="!text-white border-none rounded-full min-h-0 w-10 h-10  relative !bg-[transparent]"
          onClick={() => {
            const newList = [...currentList];
            newList[currentList.indexOf(currentPlaying)].liked =
              !currentList[currentList.indexOf(currentPlaying)].liked;
            setCurrentList(newList);
          }}
        >
          <Image
            layout="fill"
            className="text-white object-contain"
            alt="Icon next song"
            src={
              currentPlaying?.liked
                ? require("@/public/assets/images/icons/unlike.svg")
                : require("@/public/assets/images/icons/like.svg")
            }
          />
        </Button>
      </div>
    </>
  );
}

export default Player;
