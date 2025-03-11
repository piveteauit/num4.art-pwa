"use client";

import React from "react";
import { usePlayerMargin } from "@/hooks/usePlayerMargin";

interface ArtistPageClientProps {
  children: React.ReactNode;
}

export default function ArtistPageClient({ children }: ArtistPageClientProps) {
  const { getMargin } = usePlayerMargin({ fromValue: 32 });

  return (
    <main
      className="flex-1 bg-gradient-to-b from-neutral-900 to-base pt-6 md:px-6"
      style={{ paddingBottom: getMargin() }}
    >
      {children}
    </main>
  );
}
