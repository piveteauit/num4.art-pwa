import { S3Client } from "@aws-sdk/client-s3";

export const s3Config = {
  id: process.env.OVH_STORAGE_BUCKET!,
  endPoint: process.env.OVH_STORAGE_ENDPOINT!,
  region: process.env.OVH_STORAGE_REGION!,
  publicUrl: process.env.OVH_PUBLIC_URL!,
  credentials: {
    accessKeyId: process.env.OVH_ACCESS_KEY!,
    secretAccessKey: process.env.OVH_SECRET_KEY!
  }
};

export const s3Client = new S3Client({
  endpoint: s3Config.endPoint,
  region: s3Config.region,
  credentials: s3Config.credentials
});
