"use client";
import Input from "@/components/ui/Form/Input/Input";
import apiClient from "@/libs/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Avatar({ user }: any) {
  const [ld, setLd] = useState(false);
  const session = useSession();
  const [avater, setAvater] = useState<any>(session?.data?.user?.image);
  const updatePdp = async (image: File) => {
    const formData = new FormData();
    setLd(true);

    formData.append("avatar", image);

    const { data } = await apiClient.post(
      `/upload?userId=${user?.id}&prefix=${user?.id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    await session.update({
      data: {
        user: {
          ...user,
          image: data.avatar.url
        }
      }
    });
    setAvater(data.avatar.url);
    setLd(false);
  };

  console.log(session.data?.user?.image);

  return (
    <label className="avatar hover:cursor-pointer rounded-full border-2 border-white p-5 overflow-hidden w-[100px] h-[100px] hover:bg-black/60 transition-all duration-300">
      {ld ? (
        <span className="loading loading-spinner loading-md" />
      ) : (
        <Image
          alt={`Avatar ${user?.name || user?.email?.split("@")[0]}`}
          fill
          src={
            avater ||
            session.data?.user?.image ||
            "/assets/images/logos/logo.png"
          }
        />
      )}
      <Input
        label=""
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(evt) => updatePdp(evt.target.files[0])}
      />
    </label>
  );
}
