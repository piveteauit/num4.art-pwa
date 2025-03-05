"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import PaymentModal from "../Payment/PaymentModal";
import { Song } from "@/types/song";
import { usePayment } from "@/libs/hooks/usePayment";
import Link from "next/link";

interface ButtonCheckoutProps {
  label?: string | React.ReactNode;
  song: Song;
  isArtist: boolean;
}

const ButtonCheckout = ({ label, song, isArtist }: ButtonCheckoutProps) => {
  const { isLoading, clientSecret, createPaymentIntent } = usePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePaymentClick = async () => {
    if (isArtist) {
      toast.error(
        "Vous devez avoir un compte auditeur pour acheter une musique"
      );
      return;
    }

    try {
      const secret = await createPaymentIntent(song.id);
      if (secret) {
        setIsModalOpen(true);

        // Informer l'utilisateur qu'il peut consulter l'historique des paiements
        toast(
          (t) => (
            <div className="flex flex-col">
              <span>
                Astuce: vous pouvez consulter vos paiements dans votre
                historique
              </span>
              <Link
                href="/payment/history"
                className="text-blue-400 hover:text-blue-300 text-sm mt-1 underline"
                onClick={() => toast.dismiss(t.id)}
              >
                Voir l&apos;historique des paiements
              </Link>
            </div>
          ),
          { duration: 6000 }
        );
      }
    } catch (error) {
      // L'erreur est déjà gérée dans le hook
    }
  };

  return (
    <>
      <button
        className="btn btn-white group"
        onClick={handlePaymentClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          label
        )}
      </button>

      {clientSecret && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          song={song}
          clientSecret={clientSecret}
        />
      )}
    </>
  );
};

export default ButtonCheckout;
