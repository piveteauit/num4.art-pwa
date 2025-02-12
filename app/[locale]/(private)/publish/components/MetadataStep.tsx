import { ChangeEvent } from "react";

interface MetadataStepProps {
  formData: {
    title: string;
    price: number;
    ISRC: string;
    description: string;
    genre: string[];
  };
  setFormData: (data: any) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isEditMode?: boolean;
}

export default function MetadataStep({
  formData,
  setFormData,
  onNext,
  onPrevious,
  isEditMode
}: MetadataStepProps) {
  const handleGenreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      genre: [e.target.value]
    }));
  };

  const isFormValid = () => {
    return formData.title && formData.price > 0 && formData.ISRC;
  };

  const content = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Titre</label>
        <input
          type="text"
          maxLength={35}
          value={formData.title}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, title: e.target.value }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary"
        />
        <p className="text-sm text-gray-400 mt-1">{`${formData.title.length}/35 caractères`}</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Prix</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              price: Number(e.target.value)
            }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">ISRC</label>
        <input
          type="text"
          maxLength={15}
          value={formData.ISRC}
          onChange={(e) =>
            setFormData((prev: any) => ({ ...prev, ISRC: e.target.value }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev: any) => ({
              ...prev,
              description: e.target.value
            }))
          }
          className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary min-h-[100px]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Genre</label>
        <select
          value={formData.genre[0]}
          onChange={handleGenreChange}
          className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary"
        >
          <option value="" disabled>
            Sélectionner un genre
          </option>
          <option value="1">Rap</option>
          <option value="2">Rock</option>
          <option value="3">Techno</option>
          <option value="4">House</option>
          <option value="5">Electro</option>
          <option value="6">Pop</option>
        </select>
      </div>
    </div>
  );

  if (isEditMode) {
    return content;
  }

  return (
    <div className="space-y-6 px-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Informations du titre</h2>
      {content}
      <div className="flex justify-between gap-4">
        <button onClick={onPrevious} className="btn btn-outline flex-1">
          Précédent
        </button>
        <button
          onClick={onNext}
          disabled={!isFormValid()}
          className="btn btn-primary flex-1"
        >
          Suivant
        </button>
      </div>
    </div>
  );
}
