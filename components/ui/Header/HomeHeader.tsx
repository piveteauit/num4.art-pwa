"use client";
import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import AuthModal from "@/components/ui/Modal/AuthModal";
import Image from "next/image";
import { Link } from "@/navigation";
import HeaderBorder from "@/components/ui/HeaderBorder";
import { useSession } from "next-auth/react";

export default function HomeHeader() {
  const { data: session } = useSession();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClose = () => {
    setTimeout(() => {
      setIsAuthModalOpen(false);
    }, 300);
  };

  return (
    <>
      <HeaderBorder>
        <Link href={"/"}>
          <Image
            alt="Logo"
            src={"/assets/images/logos/Logo_num4_V2_blanc.png"}
            width={120}
            height={40}
            className="object-contain"
            layout="fixed"
          />
        </Link>

        {!session && (
          <Button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-transparent hover:bg-white hover:bg-opacity-20 p-2 rounded-lg text-white border-none font-medium"
          >
            Connexion
          </Button>
        )}

        {session && (
          <div className="flex gap-4 items-center">
            <Link href={"/dashboard"}>
              <Image
                alt="Settings icon"
                src={"/assets/images/icons/settings.svg"}
                width={10}
                height={10}
                layout="responsive"
                className="object-contain max-w-8"
              />
            </Link>
            {session?.user?.image && (
              <Image
                alt="Profile picture"
                src={session.user.image}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
            )}
          </div>
        )}
      </HeaderBorder>

      {!session && <AuthModal isOpen={isAuthModalOpen} onClose={handleClose} />}
    </>
  );
}
