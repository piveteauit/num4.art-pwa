"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import PaymentModal from "../Payment/PaymentModal";
import { Song } from "@/types/song";
import { usePayment } from "@/libs/hooks/usePayment";

interface ButtonCheckoutProps {
  label?: string | React.ReactNode;
  song: Song;
  isArtist: boolean;
}

const ButtonCheckout = ({ label, song, isArtist }: ButtonCheckoutProps) => {
  const { isLoading, createCheckoutSession } = usePayment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handlePaymentClick = async () => {
    if (isArtist) {
      toast.error(
        "Vous devez avoir un compte auditeur pour acheter une musique"
      );
      return;
    }

    try {
      await createCheckoutSession(song.stripePriceId);
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

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        song={song}
        clientSecret={clientSecret}
      />
    </>
  );
};

export default ButtonCheckout;
