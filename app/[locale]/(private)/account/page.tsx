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

  try {
    const profile = await prisma.profile.findFirst({
      where: {
        userId: user?.id
      },
      include: {
        artist: true || false,
        user: true
      }
    });

    if (!profile) {
      redirect("/me/welcome");
      return;
    }
    user.profile = profile;
  } catch (e) {
    redirect("/me/welcome");
  }

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
        <div className="text-lg font-medium  w-full max-w-[300px] flex justify-between">
          {user?.profile?.artist && (
            <BankInfoButton
              hasBankAccount={Boolean(user?.profile?.artist?.bankAccount)}
            />
          )}
        </div>

        {/* <div className="text-lg font-medium w-full max-w-[300px] flex justify-between">
          <span>Profil</span>
          <ButtonChangeMode
            id={user?.profile?.id}
            artistMode={!user?.profile?.artistMode}
            className="btn btn-outline m-0 py-0 h-auto min-h-0"
            size="xs"
          >
            {user?.profile?.artistMode ? "Mode auditeur" : "Mode artiste"}
          </ButtonChangeMode>
        </div>

        <hr className="w-full max-w-[300px] my-2 border-secondary" /> */}

        {/* <div className="text-lg font-medium w-full max-w-[300px] flex justify-between">
          <span>Portefeuilles</span>
        </div> */}

        <hr className="w-full max-w-[300px]  border-secondary" />

        <div className="text-lg font-medium w-full max-w-[300px] flex justify-between">
          <span>Langues</span>
        </div>

        {/* <hr className="w-full max-w-[300px] my-2 border-secondary" /> */}

        {/* <div className="text-lg font-medium w-full max-w-[300px] flex justify-between">
          <span>Notifications</span>
        </div> */}

        <hr className="w-full max-w-[300px] my-2 border-secondary mb-20" />

        <SignOutButton />
      </section>
    </main>
  );
}
