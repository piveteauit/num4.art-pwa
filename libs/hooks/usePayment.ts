import { useState } from "react";
import { toast } from "react-hot-toast";
import { Song } from "@/types/song";

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const createPaymentIntent = async (songId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ songId })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur de paiement");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      return data.clientSecret;
    } catch (error) {
      console.error(
        "Erreur lors de la création de l'intention de paiement",
        error
      );
      toast.error("Une erreur est survenue lors de l'achat");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    clientSecret,
    createPaymentIntent
  };
}
