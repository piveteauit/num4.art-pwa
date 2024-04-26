import aws from "aws-sdk";

export const s3Config = {
  id: "numero",
  endPoint: "https://s3.gra.io.cloud.ovh.net",
  accessKey: "b19ec7383a4e4e3aa4eb5759d962c7c6",
  secretKey: "7fa4e7fd1b6340dc92ee029c21757dd7",
  region: "GRA"
}



export const s3 = new aws.S3({
  region: s3Config.region,
  endpoint: s3Config.endPoint,
  credentials: {
    accessKeyId: s3Config.accessKey,
    secretAccessKey: s3Config.secretKey,
  },
})
