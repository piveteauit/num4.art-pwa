// import { s3Client, s3Config } from "@/libs/s3";

// async function createPresignedUploadUrl(fileName: string, fileType: string) {
//   const params = {
//     Bucket: s3Config.id,
//     Key: fileName,
//     Expires: 60,
//     ContentType: fileType
//   };
//   const preSingedUrl = await s3Client.getSignedUrlPromise("putObject", params);
//   return { preSingedUrl };
// }
