import {
  createPresignedUploadUrl,
  updateFileVisibility
} from "./server/uploadFile.action";
import { s3Config } from "./s3";

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

export async function uploadToS3(file: File, prefix: string = "") {
  try {
    const { preSignedUrl, url, name } = await getPreSignedUrl(file, prefix);

    await fetch(preSignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type
      }
    });

    await updateFileVisibility(url);

    // Construction de l'URL publique avec le préfixe correct
    const publicUrl = `${s3Config.publicUrl}/${url}`;

    return {
      url: publicUrl,
      name
    };
  } catch (error) {
    console.error("Erreur lors de l'upload du fichier:", error);
    throw error;
  }
}
