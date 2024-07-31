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

  if (session?.status !== "authenticated" || isMobile || pathname === "/dashboard" || pathname === "/player") return null;

  return (
    <div className={`fixed top-20 left-0 z-50 ${pathname === "/library" ? "push-right" : ""}`}>
      <div className="flex flex-col items-center">
        <button
          className="bg-gray-800 text-white p-2 rounded-r"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "Fermer" : "Menu"}
        </button>
        {isMenuOpen && (
          <div className="flex flex-col items-center mt-2">
            <Link href={"/"} className="text-white mb-4">
              <div className="vertical-text">Home</div>
            </Link>
            <Link href={"/player"} className="text-white mb-4">
              <div className="vertical-text">Lecteur</div>
            </Link>
            <Link href={"/library"} className="text-white mb-4">
              <div className="vertical-text">Collection</div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;