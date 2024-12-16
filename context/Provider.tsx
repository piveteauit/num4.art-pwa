import { auth } from "@/auth";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default async function Provider({ children }: { children: ReactNode }) {
  const session = await auth();

  if (session?.user) {
    session.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      isNewUser: session.user.isNewUser,
      profile: session.user.profile
    };
  }
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
