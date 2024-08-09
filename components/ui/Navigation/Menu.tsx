"use client";
import { Link, usePathname } from "@/navigation";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "../Button/Button";

const Menu = () => {
  const session = useSession();
  const pathname = usePathname();

  


  if (session?.status !== "authenticated" || pathname === "/dashboard" || pathname === "/player"|| pathname === "/artist/[artist]") return null;

  return (
    <div className={`flex justify-between items-center my-8 fixed top-20 left-0 z-50 px-8 hidden lg:block w-[200px] bg-gray rounded-xl`}>
      <div className="flex flex-col items-left h-full ">
       
     <div className={`flex flex-col items-left mt-2`}>
  <Link href={"/"} className="relative text-white mb-4 w-full flex items-center justify-left py-2 hover:bg-gray-700">
    <Image
      src="/assets/images/icons/home.active.svg"
      alt="Search Icon"
      width="30"
      height="30"
      className="mr-2"
    />
    <span>Home</span>
  </Link>
  <Link href={"/player"} className="relative text-white mb-4 w-full flex items-center justify-left py-2 hover:bg-gray-700">
    <Image
      src="/assets/images/icons/bouton-jouer-active.svg"
      alt="Player Icon"
      width="30"
      height="30"
      className="mr-2"
    />
    <span>Lecteur</span>
  </Link>
  <Link href={"/library"} className="relative text-white mb-4 w-full flex items-center justify-left py-2 hover:bg-gray-700">
    <Image
      src="/assets/images/icons/bibliotheque-numerique.svg"
      alt="Library Icon"
      width="30"
      height="30"
      className="mr-2"
    />
    <span>Collection</span>
  </Link>
</div>
      </div>
    </div>
  );
};

export default Menu;