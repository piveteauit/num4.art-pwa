"use client";

import React, { useState, useEffect } from 'react';
import SearchBar from '../ui/SearchBar';
import { Link } from '@/navigation';
import Image from 'next/image';
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
  genres:{ id: string; label: string; }[];
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
   {name: "Pop"}, 
  {name: "Electro"}
];
const ClientComponent: React.FC<ClientComponentProps> = ({ initialSongs, initialArtists }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentGenre, setCurrentGenre]= useState('');
  const [filteredSongs, setFilteredSong] = useState(initialSongs);
  useEffect(()=> {
    const filteredSongsBySerachTerm = initialSongs.filter(song =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSong(filteredSongsBySerachTerm);
  },[searchTerm]);
  
  
  useEffect(()=>{
  //  const filterdSongByCategorie = initialSongs.filter(song => 
   //   song.genres?.[0].label.toLowerCase() === currentGenre.toLowerCase());
    //  setFilteredSong(filterdSongByCategorie);
     // console.log(initialSongs);
  },[currentGenre]);

  return (
    <>
      <section className="mt-10 p-2 w-screen lg:max-w-5xl lg:text-center">
        <SearchBar onSearch={setSearchTerm} />
        <span className="flex justify-between items-center my-8 text-xl">Catégories </span>
        <LibraryFilter options={categories}  />
        <div className="flex justify-between items-center my-8">
          <h3 className="text-xl">Sortie récente</h3>
          <Link href={{ 
            pathname: "/see-all" 
            }} className="text-white-500 hover:underline">
            Voir tout
          </Link>
        </div>

        <div className="flex gap-2 overflow-x-scroll max-lg:w-96 max-lg:pr-4 lg:flex-nowrap lg:justify-start lg:mx-auto">
          {filteredSongs.map((s, i) => (
            <Link
              href={{
                pathname: "/player",
                query: { song: s.id }
              }}
              key={`song-${s.id}-${i}`}
            >
              <span className="block relative h-44 w-[140px] m-auto rounded-md overflow-hidden min-h-[180px] min-w-[180px]">
                <Image
                  className="object-cover rounded-md"
                  alt="jaquette musique"
                  src={s?.image || ""}
                  layout="fill"
                />
              </span>

              <div className="flex flex-col items-start text-white mt-2">
              <span
                className="block w-[180px] truncate"
                style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textAlign: 'left',
               }}
  >
    {s.title}
  </span>
                <span className="text-xs opacity-75">{s.artists?.[0]?.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="p-2 w-screen lg:max-w-5xl lg:mt-10 pb-20">
  <div className="flex justify-between items-center">
    <h3 className="text-xl">Connaissez-vous ?</h3>
    <Link
      href={{ pathname: "/see-all-artists" }}
      className="text-white-500 hover:underline"
    >
      Voir tout
    </Link>
  </div>
  <div className="flex gap-2 py-4 overflow-x-scroll flex-grow pr-4">
          
          {initialArtists.map((artist, i) => (
            <Link
              key={`home-artist-${i}-${artist.id}`}
              className="flex justify-center text-center items-center gap-2 flex-col min-w-[100px]"
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
              <span>{artist?.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
};

export default ClientComponent;