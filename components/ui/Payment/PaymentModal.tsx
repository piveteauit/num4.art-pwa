"use client";

import { FormEvent, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import type { Appearance, StripeElementsOptions } from "@stripe/stripe-js";
import { Song } from "@/types/song";
import ImageWithFallback from "../ImageWithFallback";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song;
  clientSecret: string;
}

const PaymentForm = ({
  song,
  onClose
}: {
  song: Song;
  onClose: () => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      // Afficher un message de traitement
      toast.success("Traitement de votre paiement...");

      // Soumettre le paiement avec redirection automatique
      // Note: Ne pas fermer le modal avant que Stripe ne redirige
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Cette URL sera utilisée par Stripe pour rediriger après le traitement
          return_url: `${window.location.origin}/payment/success?song_id=${song.id}&song_title=${encodeURIComponent(song.title)}`
        },
        redirect: "if_required"
      });

      // Si nous arrivons ici, c'est que Stripe n'a pas redirigé automatiquement
      // Ce qui peut arriver dans certains cas (par exemple, paiement accepté immédiatement)
      if (result.error) {
        // En cas d'erreur, afficher un message et ne pas fermer le modal
        toast.error(result.error.message || "Une erreur est survenue");
        setIsLoading(false);
      } else if (result.paymentIntent) {
        // Paiement réussi sans redirection nécessaire
        // On peut fermer le modal et rediriger manuellement
        onClose();
        router.push(
          `/payment/success?payment_intent=${result.paymentIntent.id}&song_id=${song.id}&song_title=${encodeURIComponent(song.title)}`
        );
      } else {
        // Dans tous les autres cas, fermer le modal
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de la confirmation du paiement:", error);
      toast.error("Une erreur est survenue, veuillez réessayer");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24">
          <ImageWithFallback
            src={song.image}
            alt={song.title}
            fill
            className="rounded-lg"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold">{song.title}</h3>
          <p className="text-white/60">{song.artists[0]?.name}</p>
          <p className="text-2xl font-bold mt-2">{song.price}€</p>
        </div>
      </div>

      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full bg-white text-black py-3 px-6 rounded-full font-bold hover:bg-white/90 transition-colors disabled:opacity-50"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          `Payer ${song.price}€`
        )}
      </button>

      <div className="text-xs text-center mt-4 text-white/60">
        <p>Paiement sécurisé via Stripe</p>
        <p className="mt-1">
          En cas de problème, votre paiement ne sera pas débité
        </p>
      </div>
    </form>
  );
};

export default function PaymentModal({
  isOpen,
  onClose,
  song,
  clientSecret
}: PaymentModalProps) {
  if (!isOpen) return null;

  const appearance: Appearance = {
    theme: "night",
    variables: {
      colorPrimary: "#ffffff",
      colorBackground: "#000000",
      colorText: "#ffffff"
    }
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="min-h-[calc(100vh-2rem)] md:min-h-0 flex items-center justify-center py-8">
        <div className="bg-gray-900 p-6 rounded-xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6 top-0 bg-gray-900 pt-2 z-10">
            <h2 className="text-2xl font-bold">Paiement sécurisé</h2>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white p-2"
              aria-label="Fermer"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <Elements stripe={stripePromise} options={options}>
            <PaymentForm song={song} onClose={onClose} />
          </Elements>
        </div>
      </div>
    </div>
  );
}
