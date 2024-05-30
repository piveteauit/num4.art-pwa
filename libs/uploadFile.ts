import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export const s3Config = {
  id: "numero",
  endPoint: "https://s3.gra.io.cloud.ovh.net",
  accessKey: "b19ec7383a4e4e3aa4eb5759d962c7c6",
  secretKey: "7fa4e7fd1b6340dc92ee029c21757dd7",
  region: "GRA"
}

export const s3Client = new S3Client({
  region: s3Config.region,
  endpoint: s3Config.endPoint,
  credentials: {
    accessKeyId: s3Config.accessKey,
    secretAccessKey: s3Config.secretKey,
  },
})

interface UploadParams {
  Key: string;
  Body: File;
  PartSize?: number; // Optional, defaults to 5 MB
}

export const uploadLargeFileToS3 = async ({ Key, Body, PartSize = 5 * 1024 * 1024 }: UploadParams): Promise<void> => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: s3Config.id,
      Key,
      Body
    },
    partSize: PartSize,
    leavePartsOnError: false, // Set this to true to leave the parts on error for manual cleanup
  });

  upload.on("httpUploadProgress", (progress) => {
    console.log(`Uploaded ${progress.loaded} of ${progress.total} bytes`);
  });

  try {
    await upload.done();
    console.log(`Upload completed successfully.`);
  } catch (err) {
    console.error("Upload failed:", err);
    throw err;
  }
};
