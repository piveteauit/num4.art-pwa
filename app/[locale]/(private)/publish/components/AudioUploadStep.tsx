import LayoutPublishStep from "./LayoutPublishStep";
import React from "react";

interface AudioUploadStepProps {
  formData: {
    audio: File | null;
    previewStartTime: number | null;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
}

export default function AudioUploadStep({
  formData,
  setFormData,
  onNext
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
    }
  };

  return (
    <LayoutPublishStep
      title="Importer votre musique"
      //   description="Importer votre musique"
      onNext={onNext}
      canProgress={!!formData.audio}
    >
      <div className="flex flex-col gap-4 px-6 mt-6">
        <div
          className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            accept=".mp3,.wav,.ogg,.m4a,.aac,.flac"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              if (e.target.files?.[0]) {
                setFormData((prev: any) => ({
                  ...prev,
                  audio: e.target.files?.[0],
                  previewStartTime: null
                }));
              }
            }}
            className="hidden"
            id="audio-upload"
          />
          <label
            htmlFor="audio-upload"
            className="cursor-pointer hover:text-primary transition-colors"
          >
            Glissez votre fichier audio ici ou cliquez pour sélectionner
          </label>
        </div>

        {formData.audio && (
          <div className="bg-white/20 p-4 rounded-lg">
            <p>Fichier sélectionné: {formData.audio.name}</p>
          </div>
        )}
      </div>
    </LayoutPublishStep>
  );
}
