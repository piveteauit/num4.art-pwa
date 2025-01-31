"use client";
import { Link, usePathname } from "@/navigation";
import { useSession } from "next-auth/react";
import { useUserMode } from "@/context/UserModeContext";
import { IconHome } from "@/components/icons/IconHome";
import { IconLibrary } from "@/components/icons/IconLibrary";
import { IconPublish } from "@/components/icons/IconPublish";

function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isArtistMode } = useUserMode();

  if (!session) {
    return null;
  }

  return (
    <div className="btm-nav sticky bottom-0 h-auto py-2 border-t border-white border-opacity-10 bg-opacity-80 backdrop-blur-sm text-white bg-base z-[9999] lg:hidden">
      <Link href={"/"}>
        <div
          className={`flex flex-col justify-center items-center ${pathname === "/" ? "opacity-100" : "opacity-70"}`}
        >
          <IconHome className=" relative w-8 h-8" isActive={pathname === "/"} />
          <p className="font-light text-sm">Accueil</p>
        </div>
      </Link>
      {isArtistMode && (
        <Link href={"/publish"}>
          <div
            className={`flex flex-col justify-center items-center ${
              pathname === "/publish" ? "opacity-100" : "opacity-70"
            }`}
          >
            <IconPublish
              className="relative w-8 h-8 bg-base"
              isActive={pathname === "/publish"}
            />
            <p className="font-light text-sm">Publier</p>
          </div>
        </Link>
      )}
      <Link href={"/library"}>
        <div
          className={`flex flex-col justify-center items-center ${pathname === "/library" ? "opacity-100" : "opacity-70"}`}
        >
          <IconLibrary
            className="relative w-8 h-8"
            isActive={pathname === "/library"}
          />

          <p className="font-light text-sm">
            {isArtistMode ? "Mes produits" : "Collection"}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Navbar;
