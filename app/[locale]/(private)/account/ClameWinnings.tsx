"use client";
import { useRouter } from "@/navigation";
import { useEffect, useState } from "react";
import { useEarnings } from "@/libs/hooks/useEarnings";
import { toast } from "react-hot-toast";

type ClameWinningsButtonProps = {
  hasBankAccount: boolean;
};

export default function ClameWinningsButton({
  hasBankAccount
}: ClameWinningsButtonProps) {
  const router = useRouter();
  const { availableBalance, getEarnings, isLoading, pendingRequests } =
    useEarnings();
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    getEarnings();
  }, []);

  useEffect(() => {
    setCanClaim(availableBalance >= 20 && pendingRequests.length === 0);
  }, [availableBalance, pendingRequests]);

  const handleClick = () => {
    if (!hasBankAccount) {
      toast.error(
        "Vous devez remplir vos informations bancaires pour réclamer vos gains"
      );
      router.push("/bank-info");
      return;
    }

    if (pendingRequests.length > 0) {
      toast.error("Une demande de paiement est déjà en cours");
      return;
    }

    if (!canClaim) {
      toast.error(
        "Vous devez avoir généré au moins 20€ pour pouvoir réclamer vos gains"
      );
      return;
    }

    router.push("/earnings");
  };

  return (
    <div className="space-y-2">
      <button className="py-2 px-4 w-full text-left" onClick={handleClick}>
        {isLoading ? (
          "Chargement..."
        ) : (
          <>
            Réclamer mon solde ({availableBalance.toFixed(2)}€)
            {!canClaim && " (minimum 20€)"}
          </>
        )}
      </button>
      {pendingRequests.length > 0 && (
        <p className="text-sm text-yellow-500 px-4">
          Demande de paiement en cours de traitement
        </p>
      )}
    </div>
  );
}
