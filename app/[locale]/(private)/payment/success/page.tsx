"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const handleSuccess = async () => {
      toast.success("Paiement réussi !");
      setTimeout(() => {
        router.push("/library");
      }, 2000);
    };

    handleSuccess();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Merci pour votre achat !</h1>
        <p className="text-white/60">
          Vous allez être redirigé vers votre bibliothèque...
        </p>
      </div>
    </div>
  );
}
