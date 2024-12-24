"use client";

import { usePlayerMargin } from "@/hooks/usePlayerMargin";

interface SongPageClientProps {
  children: React.ReactNode;
}

export default function SongPageClient({ children }: SongPageClientProps) {
  const { getMargin } = usePlayerMargin({ from0: false });

  return (
    <main
      className="min-h-dvh bg-gradient-to-b from-neutral-900 to-base pt-20"
      style={{ paddingBottom: getMargin() }}
    >
      {children}
    </main>
  );
}
