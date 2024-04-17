import aws from "aws-sdk";

export const s3Config = {
  id: "int.app.num4.art",
  endPoint: "https://s3.fr-par.scw.cloud",
  accessKey: "SCWN0KV0DFZG9NH0CSYS",
  secretKey: "86f93849-f824-48a7-a080-35ec2fac5ea8",
  region: "fr-par"
}



export const s3 = new aws.S3({
  region: s3Config.region,
  endpoint: s3Config.endPoint,
  credentials: {
    accessKeyId: s3Config.accessKey,
    secretAccessKey: s3Config.secretKey,
  },
})
