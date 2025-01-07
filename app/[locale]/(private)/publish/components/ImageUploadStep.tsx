interface ImageUploadStepProps {
  formData: {
    image: File | null;
  };
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ImageUploadStep({
  formData,
  setFormData,
  onNext,
  onPrevious
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
    return null;
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Ajouter une pochette</h2>

      <div
        className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
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
          {formData.image ? (
            <div className="space-y-4">
              <img
                src={handleImagePreview()}
                alt="Preview"
                className="mx-auto max-w-[200px] rounded-lg"
              />
              <p>Cliquez ou glissez pour changer l'image</p>
            </div>
          ) : (
            "Glissez votre image ici ou cliquez pour sélectionner"
          )}
        </label>
      </div>

      <div className="flex justify-between gap-4">
        <button onClick={onPrevious} className="btn btn-outline flex-1">
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={!formData.image}
          className="btn btn-primary flex-1"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
