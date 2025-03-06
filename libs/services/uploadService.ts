import apiClient from "@/libs/api/client";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export class UploadService {
  static ffmpeg: FFmpeg | null = null;
  // Taille maximale pour les fichiers (en octets) - 3MB pour l'audio, 1MB pour l'image
  static MAX_AUDIO_SIZE = 3 * 1024 * 1024; // 3MB
  static MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB

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

      // Amélioration de la conversion pour s'assurer que le format est compatible
      // Utilisation de paramètres compatibles avec tous les navigateurs
      await this.ffmpeg.exec([
        "-i",
        "input",
        "-c:a",
        "libmp3lame",
        "-b:a",
        "128k",
        "-ar",
        "44100", // Fréquence d'échantillonnage standard
        "-ac",
        "2", // Stéréo (2 canaux)
        "-f",
        "mp3", // Format explicite
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

      // Créer un nouveau fichier avec type MIME explicite
      return new File([data], file.name.replace(/\.[^/.]+$/, ".mp3"), {
        type: "audio/mpeg"
      });
    } catch (error) {
      console.error("Erreur détaillée lors de la conversion audio:", error);
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
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.6);
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
        "96k",
        "-ar",
        "44100", // Fréquence d'échantillonnage standard
        "-ac",
        "2", // Stéréo (2 canaux)
        "-f",
        "mp3", // Format explicite
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

  // Fonction utilitaire pour uploader avec retry
  static async uploadWithRetry(
    url: string,
    file: File,
    contentType: string,
    maxRetries = 3
  ) {
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const response = await fetch(url, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": contentType,
            "x-amz-acl": "public-read"
          }
        });

        if (!response.ok) {
          throw new Error(
            `Upload failed with status ${response.status}: ${await response.text()}`
          );
        }

        return response;
      } catch (error) {
        retries++;
        console.warn(
          `Tentative d'upload échouée (${retries}/${maxRetries})`,
          error
        );

        if (retries >= maxRetries) {
          throw error;
        }

        // Attente exponentielle avant retry (300ms, 900ms, 2700ms, etc.)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(3, retries) * 100)
        );
      }
    }
  }

  static async uploadSong(
    files: {
      audio: File;
      image: File;
      previewStartTime: number;
    },
    prefix: string,
    songId: string
  ) {
    // Vérification de la taille des fichiers
    if (files.audio && files.audio.size > this.MAX_AUDIO_SIZE) {
      throw new Error(
        `Le fichier audio est trop volumineux (maximum: ${Math.round(this.MAX_AUDIO_SIZE / (1024 * 1024))}MB)`
      );
    }

    if (files.image && files.image.size > this.MAX_IMAGE_SIZE) {
      throw new Error(
        `L'image est trop volumineuse (maximum: ${Math.round(this.MAX_IMAGE_SIZE / (1024 * 1024))}MB)`
      );
    }

    try {
      // Préparation des fichiers
      let convertedAudio = null;
      let previewAudio = null;
      let optimizedImage = null;

      if (files.audio) {
        // Convertir l'audio en MP3 avec une qualité réduite
        convertedAudio = await this.convertAudio(files.audio);

        // Générer la preview
        previewAudio = await this.generatePreview(
          convertedAudio,
          files.previewStartTime
        );
      }

      if (files.image) {
        // Optimiser l'image
        optimizedImage = await this.convertImage(files.image);
      }

      // Demande des URL pré-signées au serveur
      const filesConfig = [];

      if (convertedAudio) {
        filesConfig.push({
          type: "audio",
          contentType: "audio/mpeg",
          size: convertedAudio.size
        });
      }

      if (previewAudio) {
        filesConfig.push({
          type: "preview",
          contentType: "audio/mpeg",
          size: previewAudio.size
        });
      }

      if (optimizedImage) {
        filesConfig.push({
          type: "image",
          contentType: "image/webp",
          size: optimizedImage.size
        });
      }

      if (filesConfig.length === 0) {
        throw new Error("Aucun fichier à uploader");
      }

      const presignedUrlsResponse = await apiClient.post(
        "/upload/presigned-url",
        {
          prefix,
          songId,
          files: filesConfig
        }
      );

      const { urls } = presignedUrlsResponse.data;

      // Upload parallèle des fichiers directement vers S3
      const uploadPromises = [];

      if (urls.audio && convertedAudio) {
        uploadPromises.push(
          this.uploadWithRetry(
            urls.audio.uploadUrl,
            convertedAudio,
            "audio/mpeg"
          )
        );
      }

      if (urls.preview && previewAudio) {
        uploadPromises.push(
          this.uploadWithRetry(
            urls.preview.uploadUrl,
            previewAudio,
            "audio/mpeg"
          )
        );
      }

      if (urls.image && optimizedImage) {
        uploadPromises.push(
          this.uploadWithRetry(
            urls.image.uploadUrl,
            optimizedImage,
            "image/webp"
          )
        );
      }

      // Attendre que tous les uploads soient terminés
      await Promise.all(uploadPromises);

      // Retourner les URLs publiques pour les fichiers uploadés
      return {
        data: {
          audio: { url: urls.audio.publicUrl },
          preview: { url: urls.preview.publicUrl },
          image: { url: urls.image.publicUrl }
        }
      };
    } catch (error) {
      console.error("Erreur lors de l'upload direct vers S3:", error);
      throw error;
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
