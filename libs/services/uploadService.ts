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
    await this.loadFFmpeg();

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
    return new File([data], file.name.replace(/\.[^/.]+$/, ".mp3"), {
      type: "audio/mpeg"
    });
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
    await this.loadFFmpeg();

    const inputData = new Uint8Array(await file.arrayBuffer());
    await this.ffmpeg.writeFile("input", inputData);

    // Extraire 30 secondes à partir de previewStartTime
    await this.ffmpeg.exec([
      "-i",
      "input",
      "-ss",
      previewStartTime.toString(),
      "-t",
      "30",
      "-c:a",
      "libmp3lame",
      "-b:a",
      "192k",
      "preview.mp3"
    ]);

    const data = await this.ffmpeg.readFile("preview.mp3");
    return new File([data], "preview.mp3", {
      type: "audio/mpeg"
    });
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
    const formData = new FormData();

    // Convertir l'audio en MP3
    const convertedAudio = await this.convertAudio(files.audio);
    formData.append("audio", convertedAudio);

    // Générer la preview
    const previewAudio = await this.generatePreview(
      convertedAudio,
      files.previewStartTime
    );
    formData.append("preview", previewAudio);

    // Optimiser l'image
    const optimizedImage = await this.convertImage(files.image);
    formData.append("image", optimizedImage);

    formData.append("previewStartTime", files.previewStartTime.toString());
    formData.append("prefix", prefix);
    formData.append("songId", songId);

    return await apiClient.post("/upload/song", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  static async uploadAvatar(file: File, prefix: string, userId: string) {
    // Optimiser l'image
    const optimizedImage = await this.convertImage(file);
    const formData = new FormData();

    formData.append("avatar", optimizedImage);
    formData.append("prefix", prefix);
    formData.append("userId", userId);

    return await apiClient.post("/upload/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
}
