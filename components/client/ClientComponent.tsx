"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "../ui/SearchBar";
import { Link } from "@/navigation";
import LibraryFilter from "@/components/ui/LibraryFilter";
import { usePlayerMargin } from "@/hooks/usePlayerMargin";
import CategoryTitle from "@/components/ui/CategoryTitle";
import { Song } from "@/types/song";
import { Artist } from "@/types/artist";
import ScrollableSongsCards from "@/components/ui/ScrollableSongsCards";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import Image from "next/image";

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
const ClientComponent: React.FC<ClientComponentProps> = ({
  initialSongs,
  initialArtists
}) => {
  const { getMargin } = usePlayerMargin({ from0: true });
  const [searchTerm, setSearchTerm] = useState("");
  // const [currentGenre, setCurrentGenre] = useState("");
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
        {/* <span className="flex justify-between items-center font-semibold mx-6 mb-4 text-xl">
          Catégories
        </span>
        <LibraryFilter options={categories} /> */}
      </div>

      <ScrollableSongsCards
        title="Sortie récente"
        className="mb-8"
        songs={filteredSongs}
        artistName={filteredSongs[0]?.artists[0]?.name}
        href="/see-all"
      />

      <div style={{ marginBottom: getMargin() }}>
        <CategoryTitle title="Connaissez-vous ?" href="/see-all-artists" />
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

const ArtistCard: React.FC<{
  artist: Artist;
  index: number;
  totalLength: number;
}> = ({ artist, index, totalLength }) => {
  if (!artist) {
    return null;
  }
  return (
    <Link
      className={`overflow-hidden relative flex justify-center text-center items-center gap-2 flex-col min-w-[100px] 
      ${index === 0 ? "ml-6" : ""} 
      ${index === totalLength - 1 ? "mr-6" : ""}`}
      href={{
        pathname: "/artist/[artist]",
        params: { artist: artist?.id }
      }}
    >
      <ImageWithFallback
        src={artist?.image}
        alt={`Avatar ${artist?.name}`}
        className="avatar !rounded-full !w-[100px] !h-[100px] aspect-square"
        width={100}
        height={100}
      />
      <span className="overflow-hidden text-nowrap text-ellipsis max-w-[100px] text-sm">
        {artist?.name ?? "Artiste inconnu"}
      </span>
    </Link>
  );
};

export default ClientComponent;
