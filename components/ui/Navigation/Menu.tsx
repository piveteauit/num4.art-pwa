"use client";
import { Link, usePathname } from "@/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Menu = () => {
  const session = useSession();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.style.marginLeft = isMenuOpen ? '200px' : '0';
    return () => {
      document.body.style.marginLeft = '0';
    };
  }, [isMenuOpen]);

  if (session?.status !== "authenticated" || isMobile || pathname === "/dashboard" || pathname === "/player") return null;

  return (
    <div className={`fixed top-20 left-0 z-50 h-full bg-gray-800 transition-all duration-300 ${isMenuOpen ? 'w-[200px]' : 'w-[50px]'}`}>
      <div className="flex flex-col items-center h-full">
        <button
          className="bg-gray-700 text-white p-2 w-full text-left"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "Fermer" : "Menu"}
        </button>
        <div className={`flex flex-col items-center mt-2 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <Link href={"/"} className="text-white mb-4 w-full text-center py-2 hover:bg-gray-700">
            Home
          </Link>
          <Link href={"/player"} className="text-white mb-4 w-full text-center py-2 hover:bg-gray-700">
            Lecteur
          </Link>
          <Link href={"/library"} className="text-white mb-4 w-full text-center py-2 hover:bg-gray-700">
            Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;