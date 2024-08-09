"use client";
import { usePlayer } from "@/context/PlayerContext";
import React, { ReactHTMLElement, useEffect, useRef, useState } from "react";
import Button from "../ui/Button/Button";
import { usePathname } from "@/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { getProfile, likeSong, unlikeSong,getArtistProfile } from "@/libs/server/user.action";
import ButtonCheckout from "../ui/sf/ButtonCheckout";
import toast from "react-hot-toast";

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
  const { data } = useSession();
  const [userProfile, setUserProfile] = useState(null);
  const [artistProfile, setArtistProfile] = useState(null);
  console.log(paused)
  useEffect(() => {
    getProfile(data?.user?.id).then(setUserProfile).catch(console.error);
  }, [data?.user?.id]);

  useEffect(() => {
    if (!currentPlaying) setCurrentPlaying(currentList[0]);
    if (!currentList?.length) fetchSongs();
  }, []);

  useEffect(() => {
    const song = searchParams.get("song");
    if (typeof song === "string" && song) {
      setCurrentPlaying(currentList?.find((s) => s.id === song));
    }
  }, [searchParams]);

  useEffect(() => {
    if (audioRef.current) {
      console.log(paused)
      console.log(currentTime);
      if (paused) audioRef.current.pause();
      if (!paused) audioRef.current.play();
    }
  }, [paused]);

  const hasSong = userProfile?.orders?.find(
    (o: any) => o.songId === currentPlaying?.id
  );
  useEffect(() => {
    if (!hasSong && currentTime >= 20 ) {
      setPaused(true);
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      console.log("first condition met");
      toast.success("Extrait terminé", {});
    }
    if (currentTime === Number(audioRef.current?.duration)) {
      console.log("second condition met");
      const songIndex = currentList?.indexOf(currentPlaying);
      setCurrentPlaying(
        currentList[songIndex < currentList?.length - 1 ? songIndex + 1 : 0]
      );
    }
  }, [currentTime]);
  useEffect(() => {
  if(!currentPlaying?.artists?.[0]?.id){
    console.error("No artist id found in currentPlaying");
    return;
  }
    getArtistProfile(currentPlaying?.artists?.[0]?.id).then(setArtistProfile).catch(console.error);
  }, [currentPlaying?.artists?.[0]?.id])
  const isPlayerScreen = path === "/player";

  const playerHeight = !isPlayerScreen ? "h-0 hidden" : "h-6";

  if (currentPlaying)
    currentPlaying.liked =
      currentPlaying.liked ||
      currentPlaying?.favorites?.some(
        (f: any) => f?.profil?.userId === data?.user?.id
      );


  return (
    <>
      {hasSong || !isPlayerScreen ? null : (
        <div className="absolute rounded-t-3xl flex flex-col shadow-inner shadow-white/50 pb-16 justify-around gap-4 z-50 px-10 bg-base bottom-0 left-0 w-full h-1/2 min-h-[200px]">
          <div className="flex items-center">
            <div className="relative h-20 w-20 rounded-full m-auto overflow-hidden">
              <Image
                className="object-cover rounded-2xl"
                alt="jaquette musique"
                src={artistProfile?.profile?.[0]?.user?.image || ""}
                layout="fill"
              />
            </div>
            <div>
              <h3 className="text-xl text-left text-white relative z-10">
                {currentPlaying?.title}
              </h3>
              <h4 className="text-sm text-left -mb-5 text-white relative z-10">
                 {currentPlaying?.artists?.[0]?.name || "N/A"}
              </h4>
            </div>
          </div>

          <div className="flex items-center text-left">
            <h5 className="font-semibold text-base/80 text-sm">
              {" "}
              {"Description : "}{" "}
            </h5>
            <p>{currentPlaying?.description || ""}</p>
          </div>
          <div className="flex flex-row-reverse justify-between items-center gap-2">
            <div>
              <Button
                onClick={() => {
                  console.log("clicked");
                  setCurrentTime(0);
                  setPaused((p) => !p);

                  setTimeout(() => {
                    audioRef.current.currentTime = 0;
                    setPaused(true);

                    toast.success("Extrait terminé", {});
                  }, 20_000);
                }}
                className="btn-accent relative border-2"
              >
                <span
                  className="bg-primary absolute top-0 left-0 h-full z-10 overflow-hidden rounded-md"
                  style={{ width: `${(currentTime / 20) * 100}%` }}
                >
                  <span className="text-white relative z-50 text-nowrap flex justify-center items-center"></span>
                </span>
                <span className="text-primary-content relative z-50">
                  {"Écouter l'extrait"}
                </span>
              </Button>
            </div>
            <div>
              <ButtonCheckout
                songId={currentPlaying?.id}
                profileId={userProfile?.id}
                label={
                  <span className="text-center">
                    <span className="font-bold pt-2">
                      {currentPlaying?.price}

                      <sup className="font-normal ml-1">{"€"}</sup>
                    </span>
                  </span>
                }
                priceId="price_1JZ6ZyJ9zvZ2Xzvz1Z6ZyJ9z"
              />
            </div>
          </div>
        </div>
      )}

      {!isPlayerScreen ? null : (
        <div
          style={{ backgroundImage: `url(${currentPlaying?.image})` }}
          className={`bg-left-top bg-cover h-screen pb-24 overflow-hidden w-full fixed top-0 left-0 flex flex-col justify-center items-center`}
        >
          <div className="absolute top-0 left-0 w-full h-full backdrop-blur-md bg-[rgba(0,0,0,.1)]" />
          <div className="relative h-60 w-60  rounded-2xl overflow-hidden" style={{ marginTop: '-100px' }}>
            <Image
              className="object-cover rounded-2xl"
              alt="jaquette musique"
              src={currentPlaying?.image}
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
            max={
              audioRef?.current?.duration
                ? audioRef?.current?.duration
                : undefined
            }
            value={currentTime}
            className="absolute w-full h-full bg-[red] -top-3"
          />

          <div className="flex flex-row justify-between">
            <span>{getTimeArr(currentTime).reverse()}</span>
            {audioRef?.current?.duration ? (
              <span>{getTimeArr(audioRef?.current?.duration).reverse()}</span>
            ) : null}
          </div>
        </div>

        {!currentPlaying?.audio && !currentPlaying?.preview ? null : (
          <audio
            onTimeUpdate={(evt) =>
              setCurrentTime(evt?.currentTarget?.currentTime)
            }
            autoPlay={false}
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
            try {
              const newList = [...currentList];
              newList[currentList.indexOf(currentPlaying)].liked =
                !currentList[currentList.indexOf(currentPlaying)].liked;

              if (newList[currentList.indexOf(currentPlaying)].liked)
                likeSong(data?.user?.id, currentPlaying.id);
              else unlikeSong(currentPlaying.id);

              setCurrentList(newList);
            } catch (error) {
              console.error("Error in Player.tsx", error);
            }
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
