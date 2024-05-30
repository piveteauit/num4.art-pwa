"use client";
// S3UploadContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import apiClient from "@/libs/api";

interface S3UploadContextProps {
  uploadFilesToS3: () => Promise<any>;
  uploadProgress: { loaded: number; percent: number; speed?: number };
  files: File[];
  progresses?: any;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const S3UploadContext = createContext<S3UploadContextProps | undefined>(
  undefined
);

export const useS3Upload = (): S3UploadContextProps => {
  const context = useContext(S3UploadContext);
  if (!context) {
    throw new Error("useS3Upload must be used within an S3UploadProvider");
  }
  return context;
};

interface S3UploadProviderProps {
  children: React.ReactNode;
}

export const S3UploadProvider: React.FC<S3UploadProviderProps> = ({
  children
}) => {
  const [uploadProgress, setUploadProgress] = useState({
    loaded: 0,
    percent: 0,
    speed: 0,
    consumption: {}
  });
  const [progresses, setProgresses] = useState([]);
  const [startTime, setStartTime] = useState<number | any>();
  const [totalSize, setTotalSize] = useState(0);
  const [totalPercent, setTotalPercent] = useState(0);

  const [files, setFiles] = useState<File[]>([]);
  const [transfer, setTransfer] = useState<Transfer>({
    bucket_id: undefined,
    transfer_id: undefined
  });

  useEffect(() => {
    setTotalSize(files?.reduce((total, { size }) => total + size, 0));
    setTotalPercent(files?.length);
    setProgresses(files?.map((f) => [0, 0]));
  }, [files]);

  useEffect(() => {
    const progress = progresses?.reduce(
      (acc, cur) => [acc[0] + cur[0], acc[1] + cur[1]],
      [0, 0]
    );
    const durationInS = (Date.now() - startTime) / 1_000;

    setUploadProgress({
      consumption: {
        ...calcConsumption.forUpload(progress[0], durationInS * 1e3),
        size: totalSize
      },
      loaded: progress[0],
      percent: progress[1] / files.length,
      speed: progress[0] / durationInS
    });
  }, [progresses]);

  const uploadFileToS3 = async (
    file: File & { fullPath?: string }
  ): Promise<void> => {
    const fileName = `${file?.webkitRelativePath || file?.fullPath || file?.name}`; // Replace with the desired file name
    const contentType = file.type;

    try {
      // Request a pre-signed URL from the server
      const result = await apiClient.get(
        `/v2/get-presigned-url?fileSize=${file.size}&fileName=${fileName}&contentType=${contentType}&transfer_id=${transfer?.transfer_id}&bucket_id=${transfer?.bucket_id}`
      );

      const { data } = result;

      if (!data.url) {
        console.error("Failed to get pre-signed URL");
        return;
      }

      const { url } = data;

      const uploadConfig = {
        onUploadProgress: (progressEvent: any) => {
          setProgresses((p) => {
            const newP = [...p];
            newP[files.indexOf(file)] = [
              progressEvent.loaded,
              Number(progressEvent.progress) * 100
            ];
            return newP;
          });
        }
      };

      // Upload the file directly to S3 using the pre-signed URL and form data
      const s3Response = await axios.put(url, file, uploadConfig);

      // Handle the response from S3 if needed
      console.log("S3 Upload Response:", s3Response?.data);
    } catch (error) {
      // Handle error
      console.error("S3 Upload Error:", error);
    }
  };

  const uploadFilesToS3 = async (): Promise<any> => {
    setStartTime(Date.now());

    try {
      return await runBatchUpload([...files]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const finalizeTransfer = async () => {
    const payload: Transfer & any = {
      consumption: uploadProgress?.consumption,
      provider: transfer?.transfer_provider || "FV_WEB",
      transfer_provider: transfer?.transfer_provider || "FV_WEB",
      transfer_name: transfer?.transfer_name
    };
    if (transfer?.transfer_status)
      payload.transfer_status = transfer?.transfer_status;
    const finalizedTransfer = (
      await apiClient.patch(
        `/v2/transfer/${transfer.transfer_id}/upload/finalize/${transfer.bucket_id}`,
        payload
      )
    )?.data;

    setTransfer((t) => ({ ...t, ...finalizedTransfer }));

    return finalizedTransfer;
  };

  const runBatchUpload = async (
    allFiles: File[],
    allPromises: any[] = []
  ): Promise<any> => {
    // const uploadPromises: Promise<void>[] = allFiles.splice(0, 100).map((file) => uploadFileToS3(file));
    allPromises.push(
      await Promise.all(
        allFiles.splice(0, 100).map((file) => uploadFileToS3(file))
      )
    );

    if (allFiles?.length) return await runBatchUpload(allFiles, allPromises);

    return allPromises;
  };

  transfer.consumption = uploadProgress?.consumption;

  const value: S3UploadContextProps = {
    finalizeTransfer,
    uploadFilesToS3,
    uploadProgress,
    transfer,
    setTransfer,
    files,
    setFiles,
    progresses
  };

  return (
    <S3UploadContext.Provider value={value}>
      {children}
    </S3UploadContext.Provider>
  );
};
