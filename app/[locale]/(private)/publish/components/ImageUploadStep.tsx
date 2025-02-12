import Image from "next/image";
import React from "react";

interface ImageUploadStepProps {
  formData: {
    image: File | null;
  };
  existingImageUrl?: string;
  setFormData: (data: any) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isEditMode?: boolean;
}

export default function ImageUploadStep({
  formData,
  existingImageUrl,
  setFormData,
  onNext,
  onPrevious,
  isEditMode
}: ImageUploadStepProps) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files[0]?.type.startsWith("image/")) {
      setFormData((prev: any) => ({
        ...prev,
        image: files[0]
      }));
    }
  };

  const handleImagePreview = () => {
    if (formData.image) {
      return URL.createObjectURL(formData.image);
    }
    return existingImageUrl || null;
  };

  const content = (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFormData((prev: any) => ({
                ...prev,
                image: e.target.files?.[0]
              }));
            }
          }}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer hover:text-primary transition-colors"
        >
          {formData.image || existingImageUrl ? (
            <div className="space-y-4">
              <Image
                src={handleImagePreview() || ""}
                alt="Preview"
                className="mx-auto w-[180px] h-[180px] overflow-hidden rounded-lg object-cover"
                width={180}
                height={180}
              />
              <p>Cliquez ou glissez pour changer l&apos;image</p>
            </div>
          ) : (
            "Glissez votre image ici ou cliquez pour sélectionner"
          )}
        </label>
      </div>
    </div>
  );

  if (isEditMode) {
    return content;
  }

  return (
    <div className="space-y-6 px-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Ajouter une pochette</h2>
      {content}
      <div className="flex justify-between gap-4">
        <button onClick={onPrevious} className="btn btn-outline flex-1">
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={!formData.image && !existingImageUrl}
          className="btn btn-primary flex-1"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
