import { useState } from "react";
import { PaymentService } from "@/libs/services/paymentService";
import { toast } from "react-hot-toast";

export function usePayment() {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = async (priceId: string) => {
    setIsLoading(true);
    try {
      const response = await PaymentService.createCheckoutSession({
        priceId,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}${window.location.pathname}`
      });

      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error(
        "Erreur lors de la création de la session de paiement",
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
    createCheckoutSession
  };
}
