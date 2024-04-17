import { Link } from "@/navigation";
import ButtonSignin from "../sf/ButtonSignin";
import { useTranslations } from "next-intl";

function Header() {
  const t = useTranslations("common");

  return (
    <header className="w-full z-50 h-[60px] top-0 left-0 bg-white sticky p-4 flex justify-between items-center">
      <Link className="text-[black]" href={"/"}>
        {" "}
        {t("header.links.home")} ee{" "}
      </Link>
      <ButtonSignin text="Login" />
      {/* <ButtonSignin text="Login" />
      <ButtonSignin text="Login" />
      <ButtonSignin text="Login" /> */}
    </header>
  );
}

export default Header;
