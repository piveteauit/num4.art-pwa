"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);

  // Récupérer les paramètres de l'URL
  const paymentIntentId = searchParams.get("payment_intent");
  const songId = searchParams.get("song_id");
  const songTitle = searchParams.get("song_title");
  const redirectStatus = searchParams.get("redirect_status");

  const [songInfo, setSongInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasProcessedAlready = useRef(false);

  useEffect(() => {
    // Montrer le toast une seule fois
    if (!hasProcessedAlready.current) {
      toast.success("Paiement réussi !");
      hasProcessedAlready.current = true;
    }

    let timer: NodeJS.Timeout;

    const handleSuccess = async () => {
      // Seulement si nous sommes toujours en chargement et n'avons pas encore traité
      if (isLoading && !songInfo) {
        // Récupérer les informations de l'achat si l'ID du paiement est disponible
        if (paymentIntentId) {
          try {
            const response = await fetch(`/api/payment/${paymentIntentId}`);
            if (response.ok) {
              const data = await response.json();
              setSongInfo(data.songInfo);
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des détails:", error);

            // Si les détails ne sont pas disponibles mais que nous avons songId et songTitle
            if (songId && songTitle) {
              setSongInfo({
                id: songId,
                title: songTitle,
                // Valeurs par défaut si nous n'avons pas récupéré toutes les informations
                artistName: "Artiste",
                price: "Prix non disponible"
              });
            }
          } finally {
            setIsLoading(false);
          }
        } else if (songId && songTitle) {
          // Si nous n'avons pas de paymentIntentId mais que nous avons songId et songTitle
          setSongInfo({
            id: songId,
            title: songTitle,
            artistName: "Artiste",
            price: "Prix non disponible"
          });
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    };

    // N'exécuter qu'une seule fois
    if (!songInfo) {
      handleSuccess();
    }

    // Compte à rebours avant redirection uniquement lorsque le chargement est terminé
    if (!isLoading && !timer) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/library");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [router, paymentIntentId, songId, songTitle, isLoading, songInfo]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl p-8 max-w-lg w-full shadow-xl">
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
          <p className="text-white/50 text-sm">
            Vous serez redirigé dans {countdown} secondes...
          </p>

          {songInfo && (
            <div className="mt-6 p-4 bg-gray-800 rounded-lg flex items-center gap-4">
              {songInfo.image && (
                <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                  <img
                    src={songInfo.image}
                    alt={songInfo.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="text-left">
                <h3 className="font-medium">{songInfo.title}</h3>
                <p className="text-white/60 text-sm">{songInfo.artistName}</p>
                {typeof songInfo.price === "number" && (
                  <p className="text-white/60 text-sm mt-1">
                    {songInfo.price}€
                  </p>
                )}
                {typeof songInfo.price === "string" && (
                  <p className="text-white/60 text-sm mt-1">{songInfo.price}</p>
                )}
              </div>
            </div>
          )}
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
    </div>
  );
}
