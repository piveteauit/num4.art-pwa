import Button, { ButtonChangeMode } from "@/components/ui/Button/Button";
import SongForm from "@/components/ui/Form/SongForm";
import LocalePicker from "@/components/ui/LocalePicker";
import { auth } from "@/auth";
import { Link, redirect } from "@/navigation";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Avatar from "./Avater";
import SignOutButton from "@/components/ui/Button/SignOutButton";

export const dynamic = "force-dynamic";

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
        artist: true,
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
  return (
    <main className="min-h-screen pb-24">
      <section className="flex flex-col fixed top-0 left-0 w-full h-[40%] mx-auto space-y-8 justify-center items-center bg-custom-black">
        <div className="relative">
          <Avatar user={user} />
          <img
            src="/assets/images/icons/stylo.svg"
            alt="Stylo Icon"
            width="25"
            height="25"
            className="absolute bottom-0 right-0"
          />
        </div>

        <div className="text-center">
          <h4 className="font-medium text-xl">{`@${user?.profile?.artist?.name || user?.name || user?.email?.split("@")[0]}`}</h4>
          <span className="opacity-60">
            Mode {!user?.profile?.artistMode ? "auditeur" : "artiste"}{" "}
          </span>
        </div>
      </section>

      <section className="z-2 bg-custom-black p-5 fixed h-[60%] pb-[60px] top-[40%] flex flex-col w-full items-center">
        <SongForm user={user} />

        <div className="text-lg font-medium w-full max-w-[300px] flex justify-between">
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

        <hr className="w-full max-w-[300px] my-2 border-secondary" />

        {/* <div className="text-lg font-medium w-full max-w-[300px] flex justify-between">
          <span>Portefeuilles</span>
        </div> */}

        {/* <hr className="w-full max-w-[300px] my-2 border-secondary" /> */}

        <div className="text-lg font-medium w-full max-w-[300px] flex justify-between">
          <span>Langues</span>
          <LocalePicker {...user?.profile} />
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
