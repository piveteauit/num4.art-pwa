import { Link } from "@/navigation";
import { getNSMessages } from "@/i18n";
import ButtonSignin from "@/components/ui/sf/ButtonSignin";
import { getGenerateMetadata } from "@/generateMetadata";
import Header from "@/components/ui/Navigation/Header";
import Image from "next/image";
import Login from "@/components/ui/Form/Login";
import { Provider } from "next-auth/providers";
import { authOptions } from "@/libs/next-auth";

export const generateMetadata = getGenerateMetadata("home");

export default async function Page({ params, searchParams }: any) {
  const messages = await getNSMessages({ locale: params.locale, ns: "home" });

  const providers = authOptions.providers?.map(
    ({ id, name, type }: Provider) => ({ id, name, type })
  );

  return (
    <>
    <main className="flex flex-col h-screen w-screen items-center p-10 bg-custom-black">
      <div className="flex-[2] h-full w-full relative">
        <Link href={"/"}>
          <Image
            className="m-auto max-w-56 object-contain"
            alt="Logo n°4"
            layout="fill"
            src={"/assets/images/logos/Logo_num4_V2_blanc.png"}
          />
        </Link>
      </div>

      <div
        className={`${!searchParams?.error ? "hidden" : ""} alert w-min alert-error`}
      >
        {searchParams?.error}
      </div>

      <div className="flex-[1] w-full p-5 max-w-sm">
        <Login providers={providers} />
      </div>
    </main>
  </>
  );
}
