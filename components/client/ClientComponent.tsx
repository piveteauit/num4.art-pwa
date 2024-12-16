"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "../ui/SearchBar";
import { Link } from "@/navigation";
import Image from "next/image";
import LibraryFilter from "@/components/ui/LibraryFilter";

interface Artist {
  id: string;
  name: string;
  image: string;
}

interface Song {
  id: string;
  title: string;
  image: string;
  genres: { id: string; label: string }[];
  artists: { name: string }[];
}

interface ClientComponentProps {
  initialSongs: Song[];
  initialArtists: Artist[];
}
const categories = [
  { name: "Tout", all: true },
  { name: "Rap" },
  { name: "Rock" },
  { name: "Techno" },
  { name: "House" },
  { name: "Pop" },
  { name: "Electro" }
];

type AppRoutes =
  | "/see-all"
  | "/see-all-artists"
  | "/player"
  | "/artist"
  | "/library";

const SongCard: React.FC<{
  song: Song;
  index: number;
  totalLength: number;
}> = ({ song, index, totalLength }) => (
  <Link
    className={`${index === 0 ? "ml-6" : ""} 
    ${index === totalLength - 1 ? "mr-6" : ""}`}
    href={{
      pathname: "/player",
      query: { song: song.id }
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
      <span
        className="block w-[180px] truncate"
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          textAlign: "left"
        }}
      >
        {song.title}
      </span>
      <span className="text-xs opacity-75">{song.artists?.[0]?.name}</span>
    </div>
  </Link>
);

const ArtistCard: React.FC<{
  artist: Artist;
  index: number;
  totalLength: number;
}> = ({ artist, index, totalLength }) => (
  <Link
    className={`overflow-hidden flex justify-center text-center items-center gap-2 flex-col min-w-[100px] 
    ${index === 0 ? "ml-6" : ""} 
    ${index === totalLength - 1 ? "mr-6" : ""}`}
    href={{
      pathname: "/artist/[artist]",
      params: { artist: artist?.id }
    }}
  >
    <Image
      layout="responsive"
      height={100}
      width={100}
      alt="Artiste avatar N A I"
      className="avatar rounded-full !w-[100px] !h-[100px] object-cover overflow-hidden"
      src={artist?.image || "/musics/artist-nai.jpg"}
    />
    <span className="overflow-hidden text-nowrap text-ellipsis max-w-[100px] text-sm">
      {artist?.name}
    </span>
  </Link>
);

const SectionHeader: React.FC<{ title: string; linkPath: AppRoutes }> = ({
  title,
  linkPath
}) => (
  <Link href={linkPath} className="text-white-500 hover:underline">
    <div className="flex justify-between items-center mb-4 mx-6">
      <h3 className="font-semibold text-xl">{title}</h3>
      <span>Voir tout</span>
    </div>
  </Link>
);

const ClientComponent: React.FC<ClientComponentProps> = ({
  initialSongs,
  initialArtists
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentGenre, setCurrentGenre] = useState("");
  const [filteredSongs, setFilteredSong] = useState(initialSongs);

  useEffect(() => {
    const filteredSongsBySerachTerm = initialSongs.filter((song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSong(filteredSongsBySerachTerm);
  }, [searchTerm]);

  return (
    <section className="w-[100svw] mt-4 lg:max-w-3xl lg:text-center lg:left-[200px]">
      <SearchBar onSearch={setSearchTerm} />

      <div className="my-8">
        <span className="flex justify-between items-center font-semibold mx-6 mb-4 text-xl">
          Catégories
        </span>
        <LibraryFilter options={categories} />
      </div>

      <div className="mb-8">
        <SectionHeader title="Sortie récente" linkPath="/see-all" />
        <div className="flex gap-2 overflow-x-scroll scrollbar-hide max-lg:pr-4 lg:flex-nowrap lg:justify-start lg:mx-auto">
          {filteredSongs.map((song, i) => (
            <SongCard
              key={`song-${song.id}-${i}`}
              song={song}
              index={i}
              totalLength={filteredSongs.length}
            />
          ))}
        </div>
      </div>

      <div className="mb-20">
        <SectionHeader title="Connaissez-vous ?" linkPath="/see-all-artists" />
        <div className="flex gap-2 overflow-x-scroll scrollbar-hide flex-grow">
          {initialArtists.map((artist, i) => (
            <ArtistCard
              key={`home-artist-${i}-${artist.id}`}
              artist={artist}
              index={i}
              totalLength={initialArtists.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientComponent;
