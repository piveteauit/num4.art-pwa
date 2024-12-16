"use client";
import { Link, usePathname } from "@/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="btm-nav h-auto py-2 border-t border-white border-opacity-10 bg-opacity-80 backdrop-blur-sm text-white bg-base  z-[9999] lg:hidden">
      <Link href={"/"}>
        <div
          className={`flex flex-col justify-center items-center ${pathname === "/" ? "opacity-100" : "opacity-70"}`}
        >
          <div className="relative w-8 h-8">
            <Image
              fill
              className="text-white object-contain mb-1"
              alt="Icon Home"
              src={require(
                pathname === "/"
                  ? "@/public/assets/images/icons/home.active.svg"
                  : "@/public/assets/images/icons/home.svg"
              )}
            />
          </div>
          <p className="font-light text-sm">Accueil</p>
        </div>
      </Link>
      <Link href={"/player"}>
        <div
          className={`flex flex-col justify-center items-center ${pathname === "/player" ? "opacity-100" : "opacity-70"}`}
        >
          <div className="relative size-[1.75rem] mb-1 ">
            <Image
              fill
              className="text-white object-contain mb-1"
              alt="Icon Player"
              src={require(
                pathname === "/player"
                  ? "@/public/assets/images/icons/bouton-jouer-active.svg"
                  : "@/public/assets/images/icons/bouton-jouer-_2_.svg"
              )}
            />
          </div>
          <p className="font-light text-sm">Lecteur</p>
        </div>
      </Link>
      <Link href={"/library"}>
        <div
          className={`flex flex-col justify-center items-center ${pathname === "/library" ? "opacity-100" : "opacity-70"}`}
        >
          <div className="relative w-8 h-8">
            <Image
              fill
              className="text-white object-contain mb-1"
              alt="Icon Library"
              src={require(
                pathname === "/library"
                  ? "@/public/assets/images/icons/bibliotheque-numerique.svg"
                  : "@/public/assets/images/icons/bibliotheque-numerique.svg"
              )}
            />
          </div>
          <p className="font-light text-sm">Bibliothèque</p>
        </div>
      </Link>
    </div>
  );
}

export default Navbar;
