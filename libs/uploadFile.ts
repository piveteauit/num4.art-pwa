import { createPresignedUploadUrl } from "./server/uploadFile.action";

const getPreSignedUrl = async (file: File, prefix: string = "") => {
  const ext = file?.type.split("/")[1];
  const url = `${prefix ? `${prefix}/` : ""}${Date.now()}.${ext}`;
  console.log("Ok 2");

  const preSignedUrl = await createPresignedUploadUrl(
    `${prefix ? `${prefix}/` : ""}${Date.now()}.${ext}`,
    file.type
  );

  console.log("Ok presigned");

  return {
    preSignedUrl,
    url: url,
    name: file.name
  };
};

export async function uploadSong(
  files: {
    audio: File;
    previewStartTime: number;
    image: File;
  },
  prefix: string
) {
  try {
    const formData = new FormData();
    formData.append("audio", files.audio);
    formData.append("previewStartTime", files.previewStartTime.toString());
    formData.append("image", files.image);
    formData.append("prefix", prefix);

    const response = await fetch("/api/upload/song", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de l'upload");
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    throw error;
  }
}
