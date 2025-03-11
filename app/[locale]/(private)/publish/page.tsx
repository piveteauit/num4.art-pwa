"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { addSong, updateSongBdd } from "@/libs/server/song.action";
import { usePlayer } from "@/context/PlayerContext";
import { useSession } from "next-auth/react";
import ProgressBar from "./components/ProgressBar";
import AudioUploadStep from "./components/AudioUploadStep";
import MetadataStep from "./components/MetadataStep";
import ImageUploadStep from "./components/ImageUploadStep";
import FinalStep from "./components/FinalStep";
import AudioPreviewSelector from "./components/AudioPreviewSelector";
import { getArtistIdByUserId } from "@/libs/server/artist.action";
import { toast } from "react-hot-toast";
import { useUpload } from "@/libs/hooks/useUpload";

const steps = ["Audio", "Preview", "Informations", "Image", "Finalisation"];

export default function PublishPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { fetchSongs } = usePlayer();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    ISRC: "",
    description: "",
    audio: null,
    image: null,
    genre: ["1"],
    previewStartTime: 0,
    preview: null
  });
  const { uploadSong, isUploading } = useUpload();

  // Prévenir la fermeture de la page pendant le processus
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isPublishing || isUploading) {
        // La méthode moderne recommandée (e.preventDefault est suffisant)
        e.preventDefault();

        // Pour la compatibilité avec les navigateurs plus anciens
        // Utiliser une chaîne vide pour éviter l'avertissement de dépréciation
        // @ts-ignore - Ignorer l'avertissement de dépréciation
        e.returnValue = "";

        // Renvoyer une chaîne pour les navigateurs qui supportent encore les messages personnalisés
        return "Êtes-vous sûr de vouloir annuler la publication ?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPublishing, isUploading]);

  // Intercepter la navigation avec un middleware
  const handleNavigation = useCallback(() => {
    if (
      (isPublishing || isUploading) &&
      !window.confirm(
        "L'upload ou la publication est en cours. Êtes-vous sûr de vouloir quitter ?"
      )
    ) {
      return false;
    }
    return true;
  }, [isPublishing, isUploading]);

  useEffect(() => {
    if (isPublishing || isUploading) {
      window.onpopstate = () => {
        if (handleNavigation()) {
          router.back();
        }
      };
    }

    return () => {
      window.onpopstate = null;
    };
  }, [isPublishing, isUploading, router, handleNavigation]);

  useEffect(() => {
    if (!session?.user?.profile?.artist) {
      router.push("/");
    }
  }, [session?.user?.profile?.artist, router]);

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handlePublish = async () => {
    if (!session?.user) {
      console.error("Pas de session utilisateur");
      return;
    }

    setIsPublishing(true);
    const loadingToast = toast.loading("Publication en cours...");

    try {
      const artistId = await getArtistIdByUserId(session.user.id);
      if (!artistId) {
        throw new Error("Profil artiste non trouvé");
      }

      const songBdd = await addSong({
        title: formData.title,
        price: formData.price,
        ISRC: formData.ISRC,
        description: formData.description,
        previewStartTime: formData.previewStartTime,
        preview: formData.preview,
        artists: [artistId],
        genres: formData.genre
      });

      const uploadedFiles = await uploadSong(
        {
          audio: formData.audio,
          image: formData.image,
          previewStartTime: formData.previewStartTime
        },
        `${session.user.profile?.id}/songs`,
        songBdd.id
      );

      await updateSongBdd({
        songId: songBdd.id,
        data: {
          image: uploadedFiles.image.url as string,
          audio: uploadedFiles.audio.url as string,
          preview: uploadedFiles.preview.url as string
        }
      });

      await fetchSongs();
      toast.success("Publication réussie !", { id: loadingToast });
      router.push("/account");
    } catch (error) {
      toast.error("Erreur lors de la publication", { id: loadingToast });
      console.error("Erreur détaillée lors de la publication:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="relative flex flex-col flex-1 bg-gradient-to-b from-gray-900 to-base text-white">
      {/* <div className="max-w-3xl mx-auto flex flex-col flex-1"> */}
      <ProgressBar steps={steps} currentStep={currentStep} />

      <div className="mt-8 flex flex-col flex-1">
        {currentStep === 0 && (
          <AudioUploadStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        )}

        {currentStep === 1 && (
          <AudioPreviewSelector
            audioFile={formData.audio}
            onPreviewGenerated={(previewStartTime) => {
              setFormData((prev) => ({
                ...prev,
                previewStartTime: previewStartTime
              }));
            }}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {currentStep === 2 && (
          <MetadataStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {currentStep === 3 && (
          <ImageUploadStep
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        )}

        {currentStep === 4 && (
          <FinalStep
            formData={formData}
            isUploading={isUploading || isPublishing}
            onPublish={handlePublish}
            onPrevious={handlePrevious}
          />
        )}
      </div>

      {(isPublishing || isUploading) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-base p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="text-center mt-4">
              {isUploading
                ? "Upload en cours... Merci de ne pas quitter cette page"
                : "Publication en cours... Cela peut prendre quelques minutes"}
            </p>
            <p className="text-center mt-2 text-yellow-400 text-sm">
              Ne fermez pas cette fenêtre et ne quittez pas la page
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
