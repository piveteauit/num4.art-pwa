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
  const [isArtistMode, setIsArtistMode] = useState(false);

  useEffect(() => {
    getSession().then(({ user }) => setUser(user));
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await handleSignUp({
        artist: isArtistMode ? artistName : null,
        id: user?.id
      });
      document.location.href = "/dashboard";
    } catch (error) {
      if (error.message.includes("Unique constraint failed")) {
        toast.error("Ce nom d&apos;artiste est déjà pris");
      } else {
        toast.error("Une erreur est survenue");
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full flex flex-col justify-between mt-[30px] h-[calc(100svh-300px)] max-w-xs relative overflow-hidden">
      <div className="flex flex-col gap-8">
        <div className="relative flex bg-opacity-20 bg-white rounded-lg">
          <div
            className="absolute h-[90%] top-[5%] w-[50%] bg-white rounded-md transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(${isArtistMode ? "100%" : "0%"})`
            }}
          />
          <button
            onClick={() => setIsArtistMode(false)}
            className={`flex-1 z-10 py-2 px-4 rounded-md transition-colors duration-300 ${
              !isArtistMode ? "text-black" : "text-white"
            }`}
          >
            Auditeur
          </button>
          <button
            onClick={() => setIsArtistMode(true)}
            className={`flex-1 z-10 py-2 px-4 rounded-md transition-colors duration-300 ${
              isArtistMode ? "text-black" : "text-white"
            }`}
          >
            Artiste
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className={`transition-all duration-300 ease-in-out transform ${
              !isArtistMode
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-[-100%] absolute"
            }`}
          >
            <p className="text-white text-center text-sm">
              En tant qu&apos;auditeur, vous pourrez écouter et acheter de la
              musique sur la plateforme.
            </p>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out transform ${
              isArtistMode
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-[100%] absolute"
            }`}
          >
            <p className="text-white text-center text-sm">
              En tant qu&apos;artiste, vous pourrez publier votre musique et la
              vendre sur la plateforme.
            </p>
            <Input
              type="text"
              name="username"
              value={artistName}
              label="Nom d'artiste"
              onChange={({ target: { value } }: any) => setArtistName(value)}
              style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
            />
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isLoading || (isArtistMode && !artistName)}
        className="bg-custom-black border border-white p-2 rounded-lg text-white hover:text-black w-full"
        style={{ backgroundColor: "#191919", color: "#FFFFFF" }}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          "Valider"
        )}
      </Button>
    </section>
  );
}

export default Welcome;
