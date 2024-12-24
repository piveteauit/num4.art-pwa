import React from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { Song } from "@/types/song";

interface SongCardProps {
  song: Song;
  index: number;
  totalLength: number;
  padding?: string;
}

const SongCard: React.FC<SongCardProps> = ({ song, index, totalLength, padding }) => {
  return (
    <Link
      href={{
        pathname: "/song",
        query: { id: song.id }
      }}
      className={`cursor-pointer`}
      style={{
        marginRight: index === totalLength - 1 ? padding ? padding : "1.5rem" : "0rem",
        marginLeft: index === 0 ? padding ? padding : "1.5rem" : "0rem"
      }}
    >
      <span className="block relative h-44 w-[140px] m-auto rounded-md overflow-hidden min-h-[180px] min-w-[180px]">
        <Image
          className="object-cover rounded-md"
          alt="jaquette musique"
          src={song?.image || ""}
          layout="fill"
        />
      </span>
      <div className="flex flex-col items-start text-white mt-2">
        <span className="block w-[180px] truncate">{song.title}</span>
        <span className="text-xs opacity-75">{song.artists?.[0]?.name}</span>
      </div>
    </Link>
  );
};

export default SongCard;
