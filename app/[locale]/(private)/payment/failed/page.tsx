"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer les paramètres de l'URL
  const errorMessage =
    searchParams.get("error_message") ||
    searchParams.get("message") ||
    "Une erreur est survenue lors du traitement de votre paiement";
  const songId =
    searchParams.get("song_id") || searchParams.get("songId") || "";
  const songTitle =
    searchParams.get("song_title") ||
    searchParams.get("songTitle") ||
    "la chanson";

  useEffect(() => {
    toast.error("Le paiement a échoué");
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl p-8 max-w-lg w-full shadow-xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 bg-red-100/10 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              className="h-8 w-8 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Paiement échoué
          </h1>
          <p className="text-white/70">
            Nous n&apos;avons pas pu traiter votre paiement pour {songTitle}.
          </p>
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm">
              {errorMessage}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {songId && (
            <Link href={`/song/${songId}`} className="btn btn-outline">
              Retourner à la chanson
            </Link>
          )}
          <Link href="/explore" className="btn btn-primary">
            Explorer d&apos;autres titres
          </Link>
          <button onClick={() => router.back()} className="btn btn-secondary">
            Retour
          </button>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-lg font-medium mb-2">Besoin d&apos;aide ?</h3>
          <p className="text-white/60 text-sm">
            Si vous continuez à rencontrer des problèmes, n&apos;hésitez pas à
            <Link
              href="/contact"
              className="text-blue-400 hover:text-blue-300 ml-1"
            >
              contacter notre support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
