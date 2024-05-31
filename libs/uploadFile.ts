import { createPresignedUploadUrl } from "./server/uploadFile.action";

const getPreSignedUrl = async (file: File, prefix: string = "") => {
  const ext = file?.type.split("/")[1];
  const url = `${prefix ? `${prefix}/` : ""}${Date.now()}.${ext}`;
  const preSignedUrl = await createPresignedUploadUrl(
    `${prefix ? `${prefix}/` : ""}${Date.now()}.${ext}`,
    file.type
  );
  
  return {
    preSignedUrl,
    url: `${process.env.NEXT_PUBLIC_AWS_BUCKET_URL || "https://numero.s3.gra.io.cloud.ovh.net"}/${url}`,
    name: file.name
  };
};



export async function uploadToS3 (file: File, prefix: string = "") {
  const { preSignedUrl, url, name } = await getPreSignedUrl(file, prefix);
  
  await fetch(preSignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type
    }
  });
  
  return {
    url,
    name
  };
}