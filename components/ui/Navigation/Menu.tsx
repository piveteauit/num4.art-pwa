"use client";
import { Link, usePathname } from "@/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "../Button/Button";

const Menu = () => {
  const session = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  

  useEffect(() => {
    document.body.style.marginLeft = isMenuOpen ? '200px' : '0';
    return () => {
      document.body.style.marginLeft = '0';
    };
  }, [isMenuOpen]);

  if (session?.status !== "authenticated" || pathname === "/dashboard" || pathname === "/player") return null;

  return (
    <div className={`fixed top-20 left-0 z-50 h-full  transition-all duration-300 hidden lg:block ${isMenuOpen ? 'w-[200px]' : 'w-[50px]'}`}>
      <div className="flex flex-col items-center h-full">
        <Button
          className="bg-white text-black p-3 w-full text-center"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "Fermer" : "Menu"}
        </Button>
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