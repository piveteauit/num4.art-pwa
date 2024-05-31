"use server"
import { s3, s3Config } from "@/libs/s3";



export async function createPresignedUploadUrl(fileName: string, fileType: string) {
  await s3.putBucketCors({
    Bucket: s3Config.id,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT"],
          AllowedOrigins: ["*"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3000,
        },
      ],
    },
  }).promise();

  const params = {
    Bucket: s3Config.id,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
  };
  const preSignedUrl = await s3.getSignedUrlPromise("putObject", params);

  await s3.putObjectAcl({
    Bucket: s3Config.id,
    Key: fileName,
    ACL: "public-read"
  }).promise();
  
  return preSignedUrl;
}