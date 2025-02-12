"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useArtistData } from "@/libs/hooks/useArtistData";
import AudioPreviewSelector from "../../publish/components/AudioPreviewSelector";
import MetadataStep from "../../publish/components/MetadataStep";
import ImageUploadStep from "../../publish/components/ImageUploadStep";
import ProgressBar from "../../publish/components/ProgressBar";
import { toast } from "react-hot-toast";
import AudioUploadStep from "../../publish/components/AudioUploadStep";
import Button from "@/components/ui/Button/Button";
import { UploadService } from "@/libs/services/uploadService";
const steps = ["Informations", "Preview", "Image"];

export default function EditSongPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { updateSong, getSong } = useArtistData();
  const [originalSong, setOriginalSong] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    ISRC: "",
    description: "",
    audio: null,
    image: null,
    genre: ["1"],
    previewStartTime: 0
  });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const loadSong = async () => {
      const song = await getSong(params.id);
      if (song) {
        setOriginalSong(song);
        setFormData({
          title: song.title,
          price: song.price,
          ISRC: song.ISRC || "",
          description: song.description || "",
          audio: null,
          image: null,
          genre: song.genres.map((g: any) => g.id),
          previewStartTime: song.previewStartTime || 0
        });
      }
    };
    loadSong();
  }, [params.id]);

  // Fonctions de comparaison
  const areStringsEqual = (
    str1: string | null | undefined,
    str2: string | null | undefined
  ) => {
    const normalizedStr1 = !str1 ? "" : str1;
    const normalizedStr2 = !str2 ? "" : str2;
    return normalizedStr1 === normalizedStr2;
  };

  const arePricesEqual = (price1: number | null, price2: number | null) => {
    return Number(price1) === Number(price2);
  };

  const arePreviewTimesEqual = (time1: number | null, time2: number | null) => {
    const t1 = time1 ?? 0;
    const t2 = time2 ?? 0;
    return Math.abs(t1 - t2) < 0.001;
  };

  const areArraysEqual = (arr1: any[], arr2: any[]) => {
    if (!arr1 || !arr2) return false;
    if (arr1.length !== arr2.length) return false;
    const sorted1 = [...arr1].sort();
    const sorted2 = [...arr2].sort();
    return sorted1.every((val, idx) => val === sorted2[idx]);
  };

  const hasChanges = () => {
    const hasFileChanges = formData.audio !== null || formData.image !== null;

    const hasDataChanges =
      !areStringsEqual(formData.title, originalSong?.title) ||
      !arePricesEqual(formData.price, originalSong?.price) ||
      !areStringsEqual(formData.ISRC, originalSong?.ISRC) ||
      !areStringsEqual(formData.description, originalSong?.description) ||
      !arePreviewTimesEqual(
        formData.previewStartTime,
        originalSong?.previewStartTime
      ) ||
      !areArraysEqual(
        formData.genre,
        originalSong?.genres.map((g: any) => g.id)
      );

    return hasFileChanges || hasDataChanges;
  };

  const handleSubmit = async () => {
    if (!hasChanges()) {
      toast.error("Aucune modification détectée");
      router.push("/account");
      return;
    }

    try {
      setIsUpdating(true);
      let updatedData: any = {};

      // Vérifier chaque champ et ne l'ajouter que s'il a changé
      if (!areStringsEqual(formData.title, originalSong?.title)) {
        updatedData.title = formData.title;
      }
      if (!arePricesEqual(formData.price, originalSong?.price)) {
        updatedData.price = formData.price;
      }
      if (!areStringsEqual(formData.ISRC, originalSong?.ISRC)) {
        updatedData.ISRC = formData.ISRC;
      }
      if (!areStringsEqual(formData.description, originalSong?.description)) {
        updatedData.description = formData.description;
      }
      if (
        !arePreviewTimesEqual(
          formData.previewStartTime,
          originalSong?.previewStartTime
        )
      ) {
        updatedData.previewStartTime = formData.previewStartTime;
      }
      if (
        !areArraysEqual(
          formData.genre,
          originalSong?.genres.map((g: any) => g.id)
        )
      ) {
        updatedData.genres = formData.genre;
      }

      // Si on a un nouveau fichier audio, on l'utilise
      if (formData.audio) {
        updatedData.audio = formData.audio;
      }
      // Sinon, si previewStartTime a changé, on télécharge l'audio existant
      else if (updatedData.previewStartTime !== undefined) {
        try {
          const key = originalSong.audio.split("/").slice(3).join("/");
          console.log("key", key);
          const response = await fetch(`/api/get/ressources?key=${key}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const blob = await response.blob();
          const file = new File([blob], "audio.mp3", { type: "audio/mpeg" });

          // Générer d'abord la preview
          const preview = await UploadService.generatePreview(
            file,
            formData.previewStartTime
          );
          updatedData.preview = preview;
          updatedData.previewStartTime = formData.previewStartTime;
        } catch (error) {
          console.error("Erreur lors de la récupération de l'audio:", error);
          toast.error("Erreur lors de la génération de la preview");
          return;
        }
      }

      if (formData.image) {
        updatedData.image = formData.image;
      }

      // Utiliser updateSong d'ArtistService qui gère l'upload et la mise à jour
      if (Object.keys(updatedData).length > 0) {
        await updateSong({
          id: params.id,
          ...updatedData
        });
      }

      router.push("/");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!originalSong)
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );

  return (
    <div className="max-w-4xl flex-1 py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => router.back()} className="btn btn-outline">
          &larr;
        </button>
        <h1 className="text-3xl font-bold">Modifier {formData.title}</h1>
      </div>

      <div className="space-y-8">
        {/* Section Métadonnées */}
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Informations</h2>
          <MetadataStep
            formData={formData}
            setFormData={setFormData}
            isEditMode={true}
          />
        </div>

        {/* Section Audio */}
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Audio</h2>
          <AudioUploadStep
            formData={formData}
            setFormData={setFormData}
            isEditMode={true}
            existingAudioUrl={originalSong.audio}
            onAudioChange={() => {
              setFormData((prev) => ({
                ...prev,
                previewStartTime: 0
              }));
            }}
          />
        </div>

        {/* Section Preview */}
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
          <AudioPreviewSelector
            audioFile={formData.audio}
            existingAudioUrl={originalSong.audio}
            onPreviewGenerated={(time) => {
              setFormData((prev) => ({ ...prev, previewStartTime: time }));
            }}
            isEditMode={true}
            initialPreviewTime={originalSong.previewStartTime || 0}
          />
        </div>

        {/* Section Image */}
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Image</h2>
          <ImageUploadStep
            formData={formData}
            existingImageUrl={originalSong.image}
            setFormData={setFormData}
            isEditMode={true}
          />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => router.back()} className="btn">
            Annuler
          </Button>
          <Button
            disabled={isUpdating || !hasChanges()}
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Enregistrer les modifications
          </Button>
        </div>
      </div>
    </div>
  );
}
