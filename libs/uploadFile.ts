import apiClient from "./api";

export async function uploadLargeFileToS3(file: File) { 
  const urls = await apiClient.post("/upload/multipart", { fileName: file?.name, fileType: file?.type, fileSize: file?.size });
}