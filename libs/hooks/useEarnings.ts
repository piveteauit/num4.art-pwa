import { useState } from "react";
import { EarningsService } from "@/libs/services/earningsService";
import { PaymentRequestService } from "@/libs/services/paymentRequestService";
import { toast } from "react-hot-toast";

type BankInfo = {
  name: string;
  iban: string;
  bic: string;
  email: string;
  artistName: string;
  availableBalance: number;
};

export function useEarnings() {
  const [isLoading, setIsLoading] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);

  const getEarnings = async () => {
    setIsLoading(true);
    try {
      const response = await EarningsService.getEarnings();
      setAvailableBalance(response.availableBalance);
      setPendingRequests(response.pendingRequests);
      return response;
    } catch (error) {
      toast.error("Erreur lors de la récupération du solde");
      console.error(error);
      return { availableBalance: 0, bankInfo: null, pendingRequests: [] };
    } finally {
      setIsLoading(false);
    }
  };

  const claimEarnings = async (amount: number) => {
    setIsLoading(true);
    try {
      if (pendingRequests.length > 0) {
        toast.error("Une demande de paiement est déjà en cours");
        return false;
      }

      await PaymentRequestService.create(amount);
      toast.success("Votre demande de retrait a été envoyée");
      await getEarnings(); // Rafraîchir les données
      return true;
    } catch (error) {
      toast.error("Erreur lors de la demande de retrait");
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    availableBalance,
    pendingRequests,
    getEarnings,
    claimEarnings
  };
}
