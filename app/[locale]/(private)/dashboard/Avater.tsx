"use client";
import Input from "@/components/ui/Form/Input/Input";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { useUpload } from "@/libs/hooks/useUpload";
import { toast } from "react-hot-toast";
import { addAvatarToBdd } from "@/libs/server/avatar.action";

export default function Avatar({ user }: any) {
  const { data: sessionData, update: updateSession } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState<string>(
    user?.image || sessionData?.user?.image
  );
  const { uploadAvatar } = useUpload();

  const updatePdp = async (image: File) => {
    console.log("avatar", sessionData);
    if (!image) return;

    setIsLoading(true);
    const loadingToast = toast.loading("Mise à jour de l'avatar...");

    try {
      const data = await uploadAvatar(
        image,
        `${user.profile.id}`,
        user.id,
        user?.image
      );
      const newAvatarUrl = data.avatar.url;

      // Mettre à jour la BDD
      await addAvatarToBdd(newAvatarUrl, user.id);

      // Mettre à jour la session
      await updateSession({
        user: {
          image: newAvatarUrl
        }
      });
      setAvatar(newAvatarUrl);
      // Mettre à jour l'état local avec la même URL utilisée précédemment

      toast.success("Avatar mis à jour avec succès", { id: loadingToast });
      console.log("avatar3333", sessionData);
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      // Réinitialiser l'avatar à sa valeur précédente en cas d'erreur
      setAvatar(user?.image || sessionData?.user?.image);
      toast.error("Erreur lors de la mise à jour de l'avatar", {
        id: loadingToast
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <label className="avatar hover:cursor-pointer rounded-full border-2 border-white p-5 overflow-hidden w-[100px] h-[100px] hover:bg-black/60 transition-all duration-300">
      {isLoading ? (
        <span className="loading loading-spinner loading-md" />
      ) : (
        <Image
          alt={`Avatar ${user?.name || user?.email?.split("@")[0]}`}
          fill
          src={avatar || "/assets/images/logos/logo.png"}
        />
      )}
      <Input
        label=""
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        onChange={(evt) => updatePdp(evt.target.files[0])}
      />
    </label>
  );
}
