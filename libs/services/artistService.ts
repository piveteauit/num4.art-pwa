import apiClient from "@/libs/api/client";

export class ArtistService {
  static async getArtistData(artistId: string) {
    const response = await apiClient.get(`/artist/${artistId}/dashboard`);
    return response.data;
  }

  static async deleteSong(songId: string) {
    const response = await apiClient.delete(`/artist/songs/${songId}`);
    return response.data;
  }

  static async updateSong(songId: string, data: any) {
    const formData = new FormData();

    // Ajouter les fichiers s'ils existent
    if (data.audio) {
      formData.append("audio", data.audio);
    }
    if (data.preview) {
      formData.append("preview", data.preview);
    }
    if (data.image) {
      formData.append("image", data.image);
    }

    // Ajouter les autres données
    const metaData = {
      title: data.title,
      price: data.price,
      ISRC: data.ISRC,
      description: data.description,
      previewStartTime: data.previewStartTime,
      genres: data.genres
    };

    formData.append("data", JSON.stringify(metaData));

    const response = await fetch(`/api/artist/songs/${songId}`, {
      method: "PATCH",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour");
    }

    return response.json();
  }

  static async getSong(songId: string) {
    const response = await apiClient.get(`/artist/songs/${songId}`);
    return response.data;
  }
}
