import {
  S3Client,
  PutObjectCommand,
  ObjectCannedACL,
  DeleteObjectCommand
} from "@aws-sdk/client-s3";

export const s3Config = {
  id: process.env.OVH_STORAGE_BUCKET!,
  endPoint: process.env.OVH_STORAGE_ENDPOINT!,
  region: "sbg",
  publicUrl: process.env.OVH_PUBLIC_URL!,
  credentials: {
    accessKeyId: process.env.OVH_ACCESS_KEY!,
    secretAccessKey: process.env.OVH_SECRET_KEY!
  }
};

export const s3Client = new S3Client({
  endpoint: s3Config.endPoint,
  region: s3Config.region,
  credentials: s3Config.credentials,
  forcePathStyle: true,
  maxAttempts: 3
});

export const uploadToS3 = async (params: {
  Bucket: string;
  Key: string;
  Body: Buffer;
  ACL?: ObjectCannedACL;
  ContentType?: string;
}) => {
  const command = new PutObjectCommand(params);
  const result = await s3Client.send(command);
  return {
    ...result,
    Location: `${s3Config.publicUrl}/${params.Key}`
  };
};

export const deleteFromS3 = async (params: {
  Bucket: string;
  Key: string;
}) => {
  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
};
