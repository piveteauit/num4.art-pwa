"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import PaymentModal from "../Payment/PaymentModal";
import { Song } from "@/types/song";

interface ButtonCheckoutProps {
  label?: string | React.ReactNode;
  song: Song;
  isArtist: boolean;
}

const ButtonCheckout = ({ label, song, isArtist }: ButtonCheckoutProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  const handlePaymentClick = async () => {
    if (isArtist) {
      toast.error(
        "Vous devez avoir un compte auditeur pour acheter une musique"
      );
      return;
    }
    setIsLoading(true);
    try {
      console.log(
        "url",
        `${process.env.NEXT_PUBLIC_URL}/api/stripe/create-checkout`
      );
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/stripe/create-checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            priceId: song.stripePriceId,
            successUrl: `${window.location.origin}/payment/success`,
            cancelUrl: `${window.location.origin}${window.location.pathname}`
          })
        }
      );

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating checkout session", error);
      toast.error("Une erreur est survenue lors de l'achat");
    } finally {
      setIsLoading(false);
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
