"use client";

import { useRouter } from "@/navigation";
export default function BackButton() {
  const router = useRouter();

  return (
    <div className="absolute top-0 left-0 right-0 p-4 flex items-center z-10">
      <button onClick={() => router.back()}>
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
    </div>
  );
}
