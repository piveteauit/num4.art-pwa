"use client";

import React from "react";
import { usePlayerMargin } from "@/hooks/usePlayerMargin";

interface SongPageClientProps {
  children: React.ReactNode;
}

export default function SongPageClient({ children }: SongPageClientProps) {
  const { getMargin } = usePlayerMargin({  fromValue: 32 });

  return (
    <main
      className=" flex-1 bg-gradient-to-b from-neutral-900 to-base pt-20"
      style={{ paddingBottom: getMargin() }}
    >
      {children}
    </main>
  );
}
