import { s3, s3Config } from "@/libs/s3";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/libs/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "@/libs/next-auth";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req: NextRequest & { file: any }, res: NextResponse) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const formData = await req.formData();
    const audio: any = formData.get("audio");
    const image: any = formData.get("image");
    const avatar: any = formData.get("avatar");
    const prefix = formData.get("prefix");

    const audioKey = `${prefix}/${audio?.name}`;
    const imageKey = `${prefix}/${image?.name}`;
    const avatarKey = `${prefix}/${avatar?.name}`;


    if (avatar) {
      const avatarResult = await s3.upload({
        Bucket: s3Config.id,
        Key: avatarKey,
        Body: Buffer.from((await avatar.arrayBuffer())),
        ACL: "public-read"
      }).promise();

      await prisma.user.update({
        where: {
          id: req.nextUrl.searchParams.get('userId')
        },
        data: {
          image: avatarResult?.Location
        }
      })

    
      revalidatePath('/dashboard');

      return NextResponse.json({
        avatar: {
          name: avatar.name,
          url: avatarResult?.Location
        }
      });
     }

    const audioResult = await s3.upload({
      Bucket: s3Config.id,
      Key: audioKey,
      Body: Buffer.from((await audio.arrayBuffer())),
    }).promise();

    const imageResult = await s3.upload({
      Bucket: s3Config.id,
      Key: imageKey,
      Body: Buffer.from((await image.arrayBuffer())),
      ACL: "public-read"
    }).promise();


    // await s3.putObjectTagging({

    // })

    return NextResponse.json({
      audio: {
        name: audio.name,
        url: audioResult?.Location
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