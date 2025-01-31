"use client";
import Button from "./Button";

interface ButtonStyleAppleMusicProps {
  onClick?: () => void;
}

export default function ButtonStyleAppleMusic({
  onClick
}: ButtonStyleAppleMusicProps) {
  return (
    <Button
      onClick={onClick}
      className="bg-white text-black hover:scale-105 transition-transform"
    >
      <span className="flex items-center gap-2">
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
        Découvrir l&apos;artiste
      </span>
    </Button>
  );
}
