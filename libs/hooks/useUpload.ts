import { useState } from "react";
import { UploadService } from "@/libs/services/uploadService";
import { toast } from "react-hot-toast";

export function useUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadSong = async (
    files: {
      audio: File;
      image: File;
      previewStartTime: number;
    },
    prefix: string,
    songId: string
  ) => {
    setIsUploading(true);
    setProgress(0);

    try {
      // Validation des formats
      if (!files.audio.type.startsWith("audio/")) {
        throw new Error("Format audio non supporté");
      }
      if (!files.image.type.startsWith("image/")) {
        throw new Error("Format image non supporté");
      }

      const response = await UploadService.uploadSong(files, prefix, songId);
      setProgress(100);
      return response.data;
    } catch (error) {
      toast.error(error.message || "Erreur lors de l'upload");
      throw error;
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return { uploadSong, isUploading, progress };
}
