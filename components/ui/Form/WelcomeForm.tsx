"use client";
import { getSession } from "next-auth/react";
import Button from "../Button/Button";
import Input from "./Input/Input";
import { useEffect, useState } from "react";
import { handleSignUp } from "@/libs/server/user.action";
import { toast } from "react-hot-toast";

function Welcome() {
  const [artistName, setArtistName] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getSession().then(({ user }) => setUser(user));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await handleSignUp({ artist: artistName, id: user?.id });
      document.location.href = "/dashboard";
    } catch (error) {
      if (error.message.includes("Unique constraint failed")) {
        toast.error("Ce nom d'artiste est déjà pris");
      } else {
        toast.error("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col gap-8 justify-center max-w-xs" >
      <Input
        type="text"
        autoComplete="username"
        name="username"
        value={artistName}
        label="Nom d'artiste"
        onChange={({ target: { value } }: any) => setArtistName(value)}
      />

      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-custom-black border border-white text-white p-2 rounded"
      >
        <span style={{ color: '#FFFFF' }}>
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Valider"
          )}
        </span>
      </Button>
    </section>
  );
}

export default Welcome;
