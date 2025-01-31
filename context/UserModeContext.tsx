"use client";

import { createContext, useContext } from "react";
import { useSession } from "next-auth/react";

const UserModeContext = createContext<{
  isArtistMode: boolean;
}>({ isArtistMode: false });

export function UserModeProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  console.log(session?.user?.profile?.artistMode, "session");

  return (
    <UserModeContext.Provider
      value={{
        isArtistMode: session?.user?.profile?.artistMode || false
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
}

export const useUserMode = () => useContext(UserModeContext);
