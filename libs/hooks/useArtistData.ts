import { useState } from "react";
import { ArtistService } from "@/libs/services/artistService";
import { toast } from "react-hot-toast";
import { Song } from "@/types/song";

interface ArtistStats {
  totalSales: number;
  totalEarnings: number;
  totalFollowers: number;
  totalSongs: number;
}

export function useArtistData() {
  const [isLoading, setIsLoading] = useState(true);
  const [artistSongs, setArtistSongs] = useState<Song[]>([]);
  const [stats, setStats] = useState<ArtistStats>({
    totalSales: 0,
    totalEarnings: 0,
    totalFollowers: 0,
    totalSongs: 0
  });

  const fetchArtistData = async (artistId: string) => {
    setIsLoading(true);
    try {
      const response = await ArtistService.getArtistData(artistId);
      setArtistSongs(response.songs);
      setStats(response.stats);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSong = async (songId: string) => {
    try {
      await ArtistService.deleteSong(songId);
      setArtistSongs((prev) => prev.filter((song) => song.id !== songId));
      setStats((prev) => ({
        ...prev,
        totalSongs: prev.totalSongs - 1
      }));
      toast.success("Titre supprimé avec succès");
    } catch (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
      throw error;
    }
  };

  const updateSong = async (songData: any) => {
    try {
      const response = await ArtistService.updateSong(songData.id, songData);
      setArtistSongs((prev) =>
        prev.map((song) => (song.id === songData.id ? response.song : song))
      );
      toast.success("Titre mis à jour avec succès");
      return response.song;
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
      throw error;
    }
  };

  const getSong = async (songId: string) => {
    try {
      const response = await ArtistService.getSong(songId);
      return response.song;
    } catch (error) {
      toast.error("Erreur lors du chargement du titre");
      console.error(error);
      return null;
    }
  };

  return {
    artistSongs,
    stats,
    isLoading,
    fetchArtistData,
    deleteSong,
    updateSong,
    getSong
  };
}
