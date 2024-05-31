import { createPresignedUploadUrl, updateFileVisibility } from "./server/uploadFile.action";

const getPreSignedUrl = async (file: File, prefix: string = "") => {
  const ext = file?.type.split("/")[1];
  const url = `${prefix ? `${prefix}/` : ""}${Date.now()}.${ext}`;
  console.log("Ok 2");

  const preSignedUrl = await createPresignedUploadUrl(
    `${prefix ? `${prefix}/` : ""}${Date.now()}.${ext}`,
    file.type
  );

  console.log("Ok presigned");

  
  return {
    preSignedUrl,
    url: url,
    name: file.name
  };
};



export async function uploadToS3(file: File, prefix: string = "") {
  console.log("Ok 1");
  const { preSignedUrl, url, name } = await getPreSignedUrl(file, prefix);
  console.log("Ok with parts");
  
  await fetch(preSignedUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type
    }
  });
  
  console.log("Ok with upload");

  await updateFileVisibility(url);

  return {
    url: `/api/storage/${url}`,
    name
  };
}