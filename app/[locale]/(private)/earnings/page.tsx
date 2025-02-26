"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEarnings } from "@/libs/hooks/useEarnings";
import Button from "@/components/ui/Button/Button";
import BackButton from "@/components/ui/Button/BackButton";

type BankInfo = {
  name: string;
  iban: string;
  bic: string;
  email: string;
  artistName: string;
  availableBalance: number;
};

export default function EarningsPage() {
  const router = useRouter();
  const { getEarnings, claimEarnings, isLoading, availableBalance } =
    useEarnings();
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);

  useEffect(() => {
    const init = async () => {
      const response = await getEarnings();

      if (response.availableBalance < 20) {
        router.push("/account");
        return;
      }

      if (response.pendingRequests.length > 0) {
        router.push("/account");
        return;
      }

      setBankInfo(response.bankInfo);
    };

    init();
  }, []);

  const handleClaim = async () => {
    if (!bankInfo) return;

    if (await claimEarnings(availableBalance)) {
      router.push("/account");
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto flex-1">
      <BackButton />
      <h1 className="text-2xl font-bold mt-8 mb-6">Réclamer mon solde</h1>

      <div className="bg-white/5 p-6 rounded-xl mb-8">
        <h2 className="text-xl mb-4">Récapitulatif</h2>
        <p className="text-2xl font-bold mb-2">
          {availableBalance.toFixed(2)}€
        </p>
        <p className="text-sm opacity-70">
          Votre solde sera viré sur votre compte bancaire sous 48h ouvrés.
        </p>
      </div>

      <div className="bg-white/5 p-6 rounded-xl mb-8">
        <h2 className="text-xl mb-4">Informations bancaires</h2>
        <div className="space-y-2">
          <p>
            <span className="opacity-70">Titulaire :</span> {bankInfo?.name}
          </p>
          <p>
            <span className="opacity-70">IBAN :</span> {bankInfo?.iban}
          </p>
          <p>
            <span className="opacity-70">BIC :</span> {bankInfo?.bic}
          </p>
        </div>
      </div>

      <Button
        onClick={handleClaim}
        disabled={isLoading || !bankInfo}
        className="w-full"
      >
        {isLoading ? "Traitement en cours..." : "Confirmer la demande"}
      </Button>
    </main>
  );
}
