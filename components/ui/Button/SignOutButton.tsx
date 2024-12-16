"use client";

import { useState } from "react";
import Button from "@/components/ui/Button/Button";
import { signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Button
      onClick={handleSignOut}
      className="border-red-500 border-2 bg-opacity-10 hover:bg-red-500"
    >
      <span className="text-white grid place-items-center relative">
        <span className={isLoading ? "invisible" : "visible"}>Déconnexion</span>
        {isLoading && (
          <span className="loading loading-spinner loading-sm absolute"></span>
        )}
      </span>
    </Button>
  );
}
