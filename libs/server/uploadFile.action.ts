"use server"
import AWS from "aws-sdk";

const s3Config = {
  id: "numero",
  endPoint: "https://s3.gra.io.cloud.ovh.net",
  accessKey: "b19ec7383a4e4e3aa4eb5759d962c7c6",
  secretKey: "7fa4e7fd1b6340dc92ee029c21757dd7",
  region: "GRA"
}



const s3 = new AWS.S3({
  region: s3Config.region,
  endpoint: s3Config.endPoint,
  credentials: {
    accessKeyId: s3Config.accessKey,
    secretAccessKey: s3Config.secretKey,
  },
})



export async function createPresignedUploadUrl(fileName: string, fileType: string) {
  console.log("Ok before cors");

  await s3.putBucketCors({
    Bucket: s3Config.id,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ["*"],
          AllowedMethods: ["PUT", "GET", "POST"],
          AllowedOrigins: ["*"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3000,
        },
      ],
    },
  }).promise();

  console.log("Ok cors ok");

  const params = {
    Bucket: s3Config.id,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
  };
  const preSignedUrl = await s3.getSignedUrlPromise("putObject", params);

  console.log("Ok presigned in server");
  
  console.log("Ok acl just need return "); 
  return preSignedUrl;
}

export async function updateFileVisibility(Key: string) {
  return await s3.putObjectAcl({
    Bucket: s3Config.id,
    Key,
    ACL: "public-read"
  }).promise();
}