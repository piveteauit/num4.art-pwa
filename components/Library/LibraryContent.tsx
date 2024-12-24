"use client";

import { usePlayerMargin } from "@/hooks/usePlayerMargin";
import LibraryFilter from "@/components/ui/LibraryFilter";
import { Link } from "@/navigation";
import Image from "next/image";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePlayMusic } from "@/hooks/usePlayMusic";
import { usePlayer } from "@/context/PlayerContext";
import { SongsList } from "@/components/Songs/SongsList";

interface LibraryContentProps {
  songs: any[];
  options: any[];
}

export default function LibraryContent({
  songs,
  options
}: LibraryContentProps) {
  const { getMargin } = usePlayerMargin();

  return (
    <section
      id="scrollable-content"
      className={`*:flex overflow-y-scroll flex-col gap-1 lg:max-h-[calc(100vh_-_73px)] overflow-x-hidden lg:mx-[200px]`}
      style={{
        maxHeight: `calc(100svh - (${getMargin()} + 69px))`
      }}
    >
      <div className="flex flex-col mt-4">
        <h2 className="text-xl mb-2 ml-6">Trier par</h2>
        <LibraryFilter options={options} />
      </div>

      {songs.length > 0 ? (
        <div className="mx-6 mt-8 mb-4">
          <SongsList songs={songs} />
        </div>
      ) : (
        <div className="flex flex-col gap-2 mx-6 mt-8 mb-4">
          <EmptyState
            title="Votre bibliothèque est vide"
            description="Découvrez notre catalogue et ajoutez vos morceaux préférés à votre collection"
            actionLabel="Explorer le catalogue"
            actionLink={{ pathname: "/" }}
          />
        </div>
      )}
    </section>
  );
}
