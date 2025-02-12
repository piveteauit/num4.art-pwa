"use client";

import { BaseSongsList } from "./BaseSongsList";
import { Song } from "@/types/song";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { useArtistData } from "@/libs/hooks/useArtistData";
import { Menu } from "@/components/ui/Menu";

export const ArtistSongsList = ({
  songs: initialSongs,
  isLoading
}: {
  songs: Song[];
  isLoading: boolean;
}) => {
  const router = useRouter();
  const { deleteSong } = useArtistData();
  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [songToDelete, setSongToDelete] = useState<Song | null>(null);

  useEffect(() => {
    setSongs(initialSongs);
  }, [initialSongs]);

  const handleEdit = (song: Song) => {
    router.push(`/edit-song/${song.id}`);
  };

  const handleDelete = async () => {
    if (songToDelete) {
      try {
        await deleteSong(songToDelete.id);
        setSongs((prev) => prev.filter((song) => song.id !== songToDelete.id));
        setSongToDelete(null);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderActions = (song: Song) => (
    <Menu
      items={[
        {
          label: "Modifier",
          onClick: () => handleEdit(song)
        },
        {
          label: "Supprimer",
          onClick: () => setSongToDelete(song),
          className: "text-red-500"
        }
      ]}
    />
  );

  return (
    <>
      <BaseSongsList
        songs={songs}
        renderActions={renderActions}
        isClickable={false}
        isLoading={isLoading}
      />

      <Modal
        isOpen={!!songToDelete}
        onClose={() => setSongToDelete(null)}
        title="Confirmer la suppression"
      >
        <div className="p-6">
          <p>
            Êtes-vous sûr de vouloir supprimer &quot;{songToDelete?.title}&quot;
            ?
          </p>
          <div className="flex gap-4 mt-6">
            <button
              className="btn btn-outline flex-1"
              onClick={() => setSongToDelete(null)}
            >
              Annuler
            </button>
            <button className="btn btn-danger flex-1" onClick={handleDelete}>
              Supprimer
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
