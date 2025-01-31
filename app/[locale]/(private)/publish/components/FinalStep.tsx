interface FinalStepProps {
  formData: {
    title: string;
    price: number;
    ISRC: string;
    description: string;
    audio: File | null;
    image: File | null;
    genre: string[];
  };
  isUploading: boolean;
  onPublish: () => void;
  onPrevious: () => void;
}

export default function FinalStep({
  formData,
  isUploading,
  onPublish,
  onPrevious
}: FinalStepProps) {
  const getGenreName = (id: string) => {
    const genres: { [key: string]: string } = {
      "1": "Rap",
      "2": "Rock",
      "3": "Techno",
      "4": "House",
      "5": "Electro",
      "6": "Pop"
    };
    return genres[id] || "Genre inconnu";
  };

  return (
    <div className="space-y-6 px-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Vérification finale</h2>

      <div className="bg-gray-800 p-6 rounded-lg space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm text-gray-400">Titre</h3>
            <p>{formData.title}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Prix</h3>
            <p>{formData.price} €</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400">ISRC</h3>
            <p>{formData.ISRC}</p>
          </div>
          <div>
            <h3 className="text-sm text-gray-400">Genre</h3>
            <p>{getGenreName(formData.genre[0])}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm text-gray-400">Description</h3>
          <p>{formData.description}</p>
        </div>

        <div>
          <h3 className="text-sm text-gray-400">Fichiers</h3>
          <p>Audio: {formData.audio?.name}</p>
          <p>Image: {formData.image?.name}</p>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <button
          onClick={onPrevious}
          className="btn btn-outline flex-1"
          disabled={isUploading}
        >
          Précédent
        </button>
        <button
          onClick={onPublish}
          disabled={isUploading}
          className="btn btn-primary flex-1"
        >
          {isUploading ? "Publication en cours..." : "Publier"}
        </button>
      </div>
    </div>
  );
}
