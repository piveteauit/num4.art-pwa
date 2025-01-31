"use server";
import { s3Client, s3Config } from "@/libs/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "../logger";

export async function createPresignedUploadUrl(
  fileName: string,
  fileType: string
) {
  try {
    logger.s3.info("Création d'URL présignée", {
      fileName,
      fileType,
      bucket: s3Config.id
    });

    const command = new PutObjectCommand({
      Bucket: s3Config.id,
      Key: fileName,
      ContentType: fileType,
      ACL: "public-read"
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    logger.s3.info("URL présignée créée avec succès", { url });
    return url;
  } catch (error) {
    logger.s3.error("Erreur lors de la création de l'URL présignée", error);
    throw error;
  }
}

export async function updateFileVisibility(Key: string) {
  logger.s3.info("Mise à jour de la visibilité du fichier", { Key });

  const command = new PutObjectCommand({
    Bucket: s3Config.id,
    Key,
    ACL: "public-read"
  });

  try {
    const result = await s3Client.send(command);
    logger.s3.info("Visibilité mise à jour avec succès");
    return result;
  } catch (error) {
    logger.s3.error("Erreur lors de la mise à jour de la visibilité", error);
    throw error;
  }
}
