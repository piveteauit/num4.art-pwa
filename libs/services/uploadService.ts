import apiClient from "@/libs/api/client";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export class UploadService {
  static ffmpeg: FFmpeg | null = null;

  static async loadFFmpeg() {
    if (this.ffmpeg) return;

    this.ffmpeg = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      )
    });
  }

  static async convertAudio(file: File): Promise<File> {
    try {
      await this.loadFFmpeg();

      // Nettoyer les fichiers existants
      try {
        await this.ffmpeg.deleteFile("input");
        await this.ffmpeg.deleteFile("output.mp3");
      } catch (e) {
        // Ignorer les erreurs si les fichiers n'existent pas
      }

      const inputData = new Uint8Array(await file.arrayBuffer());
      await this.ffmpeg.writeFile("input", inputData);

      await this.ffmpeg.exec([
        "-i",
        "input",
        "-c:a",
        "libmp3lame",
        "-b:a",
        "320k",
        "output.mp3"
      ]);

      const data = await this.ffmpeg.readFile("output.mp3");

      // Nettoyer après utilisation
      try {
        await this.ffmpeg.deleteFile("input");
        await this.ffmpeg.deleteFile("output.mp3");
      } catch (e) {
        console.warn("Erreur lors du nettoyage des fichiers FFmpeg:", e);
      }

      return new File([data], file.name.replace(/\.[^/.]+$/, ".mp3"), {
        type: "audio/mpeg"
      });
    } catch (error) {
      console.error("Erreur lors de la conversion audio:", error);
      throw new Error("Impossible de convertir le fichier audio");
    }
  }

  static async convertImage(file: File): Promise<File> {
    // Compression basique côté client
    const image = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Redimensionner si nécessaire (max 1200px)
    const maxSize = 1200;
    let width = image.width;
    let height = image.height;

    if (width > maxSize || height > maxSize) {
      if (width > height) {
        height = (height / width) * maxSize;
        width = maxSize;
      } else {
        width = (width / height) * maxSize;
        height = maxSize;
      }
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.8);
    });

    return new File([blob], file.name, { type: "image/jpeg" });
  }

  static async generatePreview(
    file: File,
    previewStartTime: number
  ): Promise<File> {
    if (!this.ffmpeg) {
      await this.loadFFmpeg();
    }

    const inputFileName = `input_${Date.now()}.mp3`;
    const outputFileName = `preview_${Date.now()}.mp3`;

    try {
      // Nettoyer les fichiers existants avant de commencer
      try {
        await this.ffmpeg.deleteFile(inputFileName);
        await this.ffmpeg.deleteFile(outputFileName);
      } catch (e) {
        // Ignorer les erreurs si les fichiers n'existent pas
      }

      // Écrire le fichier d'entrée
      const inputData = new Uint8Array(await file.arrayBuffer());
      await this.ffmpeg.writeFile(inputFileName, inputData);

      // Extraire 30 secondes à partir de previewStartTime
      await this.ffmpeg.exec([
        "-i",
        inputFileName,
        "-ss",
        previewStartTime.toString(),
        "-t",
        "30",
        "-c:a",
        "libmp3lame",
        "-b:a",
        "192k",
        outputFileName
      ]);

      // Lire le fichier de sortie
      const data = await this.ffmpeg.readFile(outputFileName);

      // Nettoyer les fichiers
      try {
        await this.ffmpeg.deleteFile(inputFileName);
        await this.ffmpeg.deleteFile(outputFileName);
      } catch (e) {
        console.warn("Erreur lors du nettoyage des fichiers FFmpeg:", e);
      }

      return new File([data], "preview.mp3", {
        type: "audio/mpeg"
      });
    } catch (error) {
      console.error(
        "Erreur détaillée lors de la génération de la preview:",
        error
      );

      // Tentative de nettoyage en cas d'erreur
      try {
        await this.ffmpeg.deleteFile(inputFileName);
        await this.ffmpeg.deleteFile(outputFileName);
      } catch (e) {
        // Ignorer les erreurs de nettoyage
      }

      throw new Error("Impossible de générer la preview audio");
    }
  }

  static async uploadSong(
    files: {
      audio: File;
      image: File;
      previewStartTime: number;
    },
    prefix: string,
    songId: string,
    price: number,
    songName: string
  ) {
    const formData = new FormData();

    if (files.audio) {
      // Convertir l'audio en MP3
      const convertedAudio = await this.convertAudio(files.audio);
      formData.append("audio", convertedAudio);

      // Générer la preview
      const previewAudio = await this.generatePreview(
        convertedAudio,
        files.previewStartTime
      );
      formData.append("preview", previewAudio);
    }

    if (files.image) {
      // Optimiser l'image
      const optimizedImage = await this.convertImage(files.image);
      formData.append("image", optimizedImage);

      formData.append("previewStartTime", files.previewStartTime.toString());
      formData.append("prefix", prefix);
      formData.append("songId", songId);
      formData.append("price", price.toString());
      formData.append("songName", songName);

      return await apiClient.post("/upload/song", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    }
  }

  static async uploadAvatar(
    file: File,
    prefix: string,
    userId: string,
    previousAvatar?: string
  ) {
    // Optimiser l'image
    const optimizedImage = await this.convertImage(file);
    const formData = new FormData();

    formData.append("avatar", optimizedImage);
    formData.append("prefix", prefix);
    formData.append("userId", userId);
    if (previousAvatar) {
      formData.append("previousAvatar", previousAvatar);
    }

    return await apiClient.post("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
}
