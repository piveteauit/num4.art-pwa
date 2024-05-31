import { s3 } from "@/libs/s3";

async function createPresignedUploadUrl(fileName: string, fileType: string) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
  };
  const preSingedUrl = await s3.getSignedUrlPromise("putObject", params);
  return { preSingedUrl };
}