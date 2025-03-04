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
      console.error("Erreur d'upload:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de l'upload des fichiers"
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadAvatar = async (
    image: File,
    prefix: string,
    userId: string,
    previousAvatar?: string
  ) => {
    setIsUploading(true);
    setProgress(0);

    try {
      if (!image.type.startsWith("image/")) {
        throw new Error("Format image non supporté");
      }

      const response = await UploadService.uploadAvatar(
        image,
        prefix,
        userId,
        previousAvatar
      );
      setProgress(100);
      return response.data;
    } catch (error) {
      console.error("Erreur d'upload:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de l'upload de l'avatar"
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadSong, uploadAvatar, isUploading, progress };
}
