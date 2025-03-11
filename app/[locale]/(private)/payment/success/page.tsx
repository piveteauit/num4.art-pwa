"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PaymentSuccessPage() {
  const hasProcessedAlready = useRef(false);

  if (!hasProcessedAlready.current) {
    toast.success("Paiement réussi !");
    hasProcessedAlready.current = true;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 bg-green-100/10 inline-flex h-16 w-16 items-center justify-center rounded-full">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Paiement réussi !
        </h1>
        <p className="text-white/70 mb-2">
          Merci pour votre achat. Votre musique est maintenant disponible dans
          votre bibliothèque.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <Link href="/library" className="btn btn-primary">
          Accéder à ma bibliothèque
        </Link>
        <Link href="/payment/history" className="btn btn-outline">
          Voir mon historique
        </Link>
      </div>
    </div>
  );
}
