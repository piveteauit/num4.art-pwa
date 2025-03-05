import { ChangeEvent, useState, useEffect } from "react";

interface MetadataStepProps {
  formData: {
    title: string;
    price: number; // Ce champ stockera maintenant le prix final pour l'acheteur
    ISRC: string;
    description: string;
    genre: string[];
  };
  setFormData: (data: any) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isEditMode?: boolean;
}

// Constantes pour les frais
const PLATFORM_FEE_PERCENTAGE = 30; // 30% pour le site
const SACEM_FEE_PERCENTAGE = 20; // 20% pour la SACEM
const STRIPE_FEE_PERCENTAGE = 2.9; // 2.9% pour Stripe
const STRIPE_FIXED_FEE = 0.25; // 0,25€ de frais fixe Stripe

export default function MetadataStep({
  formData,
  setFormData,
  onNext,
  onPrevious,
  isEditMode
}: MetadataStepProps) {
  // État local pour stocker le prix artiste
  const [artistPrice, setArtistPrice] = useState<number>(1);

  // Calcul des frais et du prix utilisateur final à partir du prix artiste
  const calculateFees = (artistPrice: number) => {
    const platformFee = (artistPrice * PLATFORM_FEE_PERCENTAGE) / 100;
    const sacemFee = (artistPrice * SACEM_FEE_PERCENTAGE) / 100;
    const subtotal = artistPrice + platformFee + sacemFee;
    const stripeFee =
      (subtotal * STRIPE_FEE_PERCENTAGE) / 100 + STRIPE_FIXED_FEE;
    const finalUserPrice = subtotal + stripeFee;

    return {
      platformFee,
      sacemFee,
      stripeFee,
      finalUserPrice: parseFloat(finalUserPrice.toFixed(2))
    };
  };

  // Calcul du prix artiste à partir du prix final
  const calculateArtistPrice = (finalPrice: number) => {
    // Résolution de l'équation pour trouver le prix artiste
    const platformFactor = PLATFORM_FEE_PERCENTAGE / 100;
    const sacemFactor = SACEM_FEE_PERCENTAGE / 100;
    const stripeFactor = STRIPE_FEE_PERCENTAGE / 100;

    const coefficient =
      1 +
      platformFactor +
      sacemFactor +
      (1 + platformFactor + sacemFactor) * stripeFactor;

    const artistPrice = (finalPrice - STRIPE_FIXED_FEE) / coefficient;

    return parseFloat(artistPrice.toFixed(2));
  };

  // Initialisation de l'état artistPrice à partir du prix final dans formData
  useEffect(() => {
    if (formData.price > 0) {
      const calculatedArtistPrice = calculateArtistPrice(formData.price);
      setArtistPrice(Math.max(1, calculatedArtistPrice));
    }
  }, []);

  const handleArtistPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newArtistPrice = Math.max(1, Number(e.target.value)); // Minimum 1€
    setArtistPrice(newArtistPrice);

    // Calculer le prix final correspondant et le sauvegarder dans formData
    const { finalUserPrice } = calculateFees(newArtistPrice);
    setFormData((prev: any) => ({
      ...prev,
      price: finalUserPrice
    }));
  };

  const handleGenreChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      genre: [e.target.value]
    }));
  };

  const isFormValid = () => {
    return formData.title && formData.price > 0 && formData.ISRC;
  };

  // Calcul des frais pour l'affichage
  const { platformFee, sacemFee, stripeFee } = calculateFees(artistPrice);

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
        <label className="block text-sm font-medium mb-2">
          Prix artiste (€)
        </label>
        <input
          type="number"
          min="1"
          step="0.01"
          value={artistPrice}
          onChange={handleArtistPriceChange}
          className="w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-primary"
        />
        <p className="text-sm text-gray-400 mt-1">
          Le montant que vous recevrez (minimum 1€)
        </p>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Détail des frais</h3>
        <ul className="space-y-1 text-sm text-gray-300">
          <li className="flex justify-between">
            <span>Prix artiste:</span>
            <span>{artistPrice.toFixed(2)}€</span>
          </li>
          <li className="flex justify-between">
            <span>Frais plateforme ({PLATFORM_FEE_PERCENTAGE}%):</span>
            <span>{platformFee.toFixed(2)}€</span>
          </li>
          <li className="flex justify-between">
            <span>Frais SACEM ({SACEM_FEE_PERCENTAGE}%):</span>
            <span>{sacemFee.toFixed(2)}€</span>
          </li>
          <li className="flex justify-between">
            <span>
              Frais Stripe ({STRIPE_FEE_PERCENTAGE}% + {STRIPE_FIXED_FEE}€):
            </span>
            <span>{stripeFee.toFixed(2)}€</span>
          </li>
          <li className="flex justify-between font-medium border-t border-gray-700 pt-1 mt-1">
            <span>Prix final pour l&apos;acheteur:</span>
            <span>{formData.price.toFixed(2)}€</span>
          </li>
        </ul>
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
