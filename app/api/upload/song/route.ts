import { s3, s3Config } from "@/libs/s3";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
    responseLimit: false,
  },
};

export async function POST(req: NextRequest & { file: any }, res: NextResponse) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const formData = await req.formData();
    const audio: any = formData.get("audio");
    const preview: any = formData.get("preview");
    const image: any = formData.get("image");
    const prefix = formData.get("prefix");

    const audioKey = `${prefix}/${audio.name}`;
    const previewKey = `${prefix}/${preview.name}`;
    const imageKey = `${prefix}/${image.name}`;

    const audioResult = await s3.upload({
      Bucket: s3Config.id,
      Key: audioKey,
      Body: Buffer.from((await audio.arrayBuffer())),
      ACL: "public-read"
    }).promise();

    const previewResult = await s3.upload({
      Bucket: s3Config.id,
      Key: previewKey,
      Body: Buffer.from((await preview.arrayBuffer())),
      ACL: "public-read"
    }).promise();

    const imageResult = await s3.upload({
      Bucket: s3Config.id,
      Key: imageKey,
      Body: Buffer.from((await image.arrayBuffer())),
      ACL: "public-read"
    }).promise();

    return NextResponse.json({
      audio: {
        name: audio.name,
        url: audioResult?.Location
      },
      preview: {
        name: preview.name,
        url: previewResult?.Location
      },
      image: {
        name: image.name,
        url: imageResult?.Location
      }
    });

  } catch (error) {
    console.error('Error uploading file to S3:', error);
    return NextResponse.json({ error: 'Failed to upload file to S3' }, { status: 500 });
  }
}