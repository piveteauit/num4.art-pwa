import LocalePicker from "@/components/ui/LocalePicker";
import { auth } from "@/auth";
import { redirect } from "@/navigation";
import { PrismaClient } from "@prisma/client";
import Avatar from "./Avater";
import SignOutButton from "@/components/ui/Button/SignOutButton";
import Image from "next/image";
export const dynamic = "force-dynamic";
import Button from "@/components/ui/Button/Button";
import BankInfoButton from "./BankInfoButton";
import ClameWinningsButton from "./ClameWinnings";
// This is a private page: It's protected by the layout.js component which ensures the user is authenticated.
// It's a server compoment which means you can fetch data (like the user profile) before the page is rendered.
// See https://shipfa.st/docs/tutorials/private-page

export default async function Dashboard() {
  const prisma = new PrismaClient();
  const session = await auth();

  if (!session?.user) {
    console.log("1 Redirecting to welcome page");
    redirect("/me/welcome");
    return null;
  }

  const { user } = session;
  //console.log("user",user);


  const getUserDisplayName = (user: any) => {
    const artistName = user?.profile?.artist?.name;
    const userName = user?.profile?.user?.name;
    const email = user?.profile?.user?.email;

    if (artistName) return artistName;
    if (userName) return userName;
    if (email) return email.split("@")[0];
    return "error";
  };

  const getBankButtonText = (user: any) => {
    return user?.profile?.artist?.bankAccount
      ? "Modifier mes informations bancaires"
      : "Remplir mes informations bancaires";
  };

  const hasBankAccount = Boolean(user?.profile?.artist?.bankAccount);

  return (
    <main className=" flex-1">
      <section className="flex flex-col fixed top-0 left-0 w-full h-[40%] mx-auto space-y-8 justify-center items-center bg-custom-black">
        <div className="relative">
          <Avatar user={user} />
          <Image
            src="/assets/images/icons/stylo.svg"
            alt="Stylo Icon"
            width={25}
            height={25}
            className="absolute bottom-0 right-0"
          />
        </div>

        <div className="text-center">
          <h4 className="font-medium text-xl">@{getUserDisplayName(user)}</h4>
          <span className="opacity-60">
            {!user?.profile?.artist ? "Auditeur" : "Artiste"}
          </span>
        </div>
      </section>

      <section className="z-2 bg-custom-black p-5 fixed h-[60%] pb-[60px] top-[40%] flex flex-col w-full items-center">
        <div className="mb-20">
          <div className="text-lg font-medium  w-full flex justify-between">
            {user?.profile?.artist && (
              <ClameWinningsButton hasBankAccount={hasBankAccount} />
            )}
          </div>
          <Divider />
          <div className="text-lg font-medium  w-full  flex justify-between">
            {user?.profile?.artist && (
              <BankInfoButton hasBankAccount={hasBankAccount} />
            )}
          </div>

          <Divider />

          {/* <div className="text-lg font-medium w-full flex justify-between">
            <span>Langues</span>
          </div>
          <Divider /> */}
        </div>
        <SignOutButton />
      </section>
    </main>
  );
}

const Divider = () => {
  return <hr className="w-full my-2 border-secondary" />;
};
