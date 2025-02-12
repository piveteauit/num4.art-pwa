import LayoutPublishStep from "./LayoutPublishStep";
import React from "react";

interface AudioUploadStepProps {
  formData: {
    audio: File | null;
    previewStartTime: number | null;
    title: string | null;
  };
  setFormData: (data: any) => void;
  onNext?: () => void;
  isEditMode?: boolean;
  existingAudioUrl?: string;
  onAudioChange?: () => void;
}

export default function AudioUploadStep({
  formData,
  setFormData,
  onNext,
  isEditMode,
  existingAudioUrl,
  onAudioChange
}: AudioUploadStepProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files[0]?.type.startsWith("audio/")) {
      setFormData((prev: any) => ({
        ...prev,
        audio: files[0],
        previewStartTime: null
      }));
      onAudioChange?.();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFormData((prev: any) => ({
        ...prev,
        audio: e.target.files?.[0],
        previewStartTime: null
      }));
      onAudioChange?.();
    }
  };

  const content = (
    <div className="flex flex-col flex-1 gap-4">
      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept=".mp3,.wav,.ogg,.m4a,.aac,.flac"
          onChange={handleFileChange}
          className="hidden"
          id="audio-upload"
        />
        <label
          htmlFor="audio-upload"
          className="cursor-pointer hover:text-primary transition-colors flex-1"
        >
          {formData.audio || existingAudioUrl ? (
            <div className="space-y-2">
              <p>
                Fichier actuel :{" "}
                {formData.audio?.name ||
                  formData.title ||
                  existingAudioUrl?.split("/").pop()}
              </p>
              <p className="text-sm text-gray-400">
                Cliquez ou glissez pour changer le fichier
              </p>
            </div>
          ) : (
            "Glissez votre fichier audio ici ou cliquez pour sélectionner"
          )}
        </label>
      </div>
    </div>
  );

  if (isEditMode) {
    return content;
  }

  return (
    <LayoutPublishStep
      title="Importer votre musique"
      onNext={onNext}
      canProgress={!!formData.audio}
    >
      {content}
    </LayoutPublishStep>
  );
}
