import { Link, usePathname } from "@/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";

function Navbar() {
  const session = useSession();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

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

  if (session?.status !== "authenticated" || !isMobile) return null;

  return (
    <div className="btm-nav text-white bg-base h-[60px] py-3 z-[9999]">
      <Link href={"/"}>
        <Image
          layout="fill"
          className="text-white object-contain"
          alt="Icon Home"
          src={require(
            pathname === "/"
              ? "@/public/assets/images/icons/home.active.svg"
              : "@/public/assets/images/icons/home.svg"
          )}
        />
      </Link>
      <Link href={"/player"}>
        <Image
          layout="fill"
          className="text-white object-contain"
          alt="Icon Home"
          src={require(
            pathname === "/player"
              ? "@/public/assets/images/icons/bouton-jouer-active.svg"
              : "@/public/assets/images/icons/bouton-jouer-_2_.svg"
          )}
        />
      </Link>
      <Link href={"/library"}>
        <Image
          layout="fill"
          className="text-white object-contain"
          alt="Icon library"
          src={require(
            pathname === "/library"
              ? "@/public/assets/images/icons/bibliotheque-numerique.svg"
              : "@/public/assets/images/icons/bibliotheque-numerique.svg"
          )}
        />
      </Link>
    </div>
  );
}

export default Navbar;
