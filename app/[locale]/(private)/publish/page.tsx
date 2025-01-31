"use client";
import { useUserMode } from "@/context/UserModeContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { uploadSong } from "@/libs/uploadFile";
import { addSong } from "@/libs/server/song.action";
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

const steps = ["Audio", "Preview", "Informations", "Image", "Finalisation"];

export default function PublishPage() {
  const { isArtistMode } = useUserMode();
  const router = useRouter();
  const { data: session } = useSession();
  const { fetchSongs } = usePlayer();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    ISRC: "",
    description: "",
    audio: null,
    // preview: null,
    image: null,
    genre: ["1"],
    previewStartTime: 0
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!isArtistMode) {
      router.push("/");
    }
  }, [isArtistMode, router]);

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

    setIsUploading(true);
    try {
      const uploadedFiles = await uploadSong(
        {
          audio: formData.audio,
          image: formData.image,
          previewStartTime: formData.previewStartTime
        },
        `songs/${session.user.profile?.id}`
      );

      const artistId = await getArtistIdByUserId(session.user.id);
      if (!artistId) {
        throw new Error("Profil artiste non trouvé");
      }

      //bdd
      await addSong({
        title: formData.title,
        price: formData.price,
        ISRC: formData.ISRC,
        description: formData.description,
        image: uploadedFiles.image.url,
        audio: uploadedFiles.audio.url,
        previewStartTime: formData.previewStartTime,
        artists: [artistId],
        genres: formData.genre
      });

      await fetchSongs();
      router.push("/dashboard");
    } catch (error) {
      toast.error("Erreur lors de la publication");
      console.error("Erreur détaillée lors de la publication:", error);
    } finally {
      setIsUploading(false);
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
            isUploading={isUploading}
            onPublish={handlePublish}
            onPrevious={handlePrevious}
          />
        )}
      </div>
    </div>
  );
}
