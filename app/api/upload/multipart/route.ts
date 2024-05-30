import type { NextApiRequest, NextApiResponse } from 'next';
import { S3Client, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from 'next/server';

export const s3Config = {
  id: "numero",
  endPoint: "https://s3.gra.io.cloud.ovh.net",
  accessKey: "b19ec7383a4e4e3aa4eb5759d962c7c6",
  secretKey: "7fa4e7fd1b6340dc92ee029c21757dd7",
  region: "GRA"
}
const s3Client = new S3Client({
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.accessKey,
    secretAccessKey: s3Config.secretKey,
  }
});

export async function POST(req: NextApiRequest) {
  const { fileName, fileType } = req.body;

  // Step 1: Create a multipart upload
  const createCommand = new CreateMultipartUploadCommand({
    Bucket: s3Config.id,
    Key: fileName,
    ContentType: fileType
  });

  const { UploadId } = await s3Client.send(createCommand);

  return NextResponse.json({ uploadId: UploadId });
}

export async function PUT(req: NextApiRequest) { 
  const { fileName, uploadId, parts } = req.body;

    // Step 3: Complete multipart upload
    const completeCommand = new CompleteMultipartUploadCommand({
      Bucket: s3Config.id,
      Key: fileName,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts }
    });

    await s3Client.send(completeCommand);
    return NextResponse.json({ message: 'Upload completed successfully' });
}
