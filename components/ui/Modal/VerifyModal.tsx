"use client";
import { useState, useEffect, useRef } from "react";
import Input from "../Form/Input/Input";
import Button from "../Button/Button";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import apiClient from "@/libs/api/client";
import { useRouter } from "next/navigation";

export default function VerifyModal({
  isOpen,
  onClose,
  onSuccess,
  isEmbedded = false
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  isEmbedded?: boolean;
}) {
  const router = useRouter();
  const [{ email, callbackUrl }, setEmailAndUrl] = useState({
    email: "",
    callbackUrl: ""
  });
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [timer, setTimer] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { update } = useSession();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (!isOpen || typeof localStorage === "undefined") return;

    setEmailAndUrl({
      email: localStorage.getItem("email") || "",
      callbackUrl: localStorage.getItem("callbackUrl") || ""
    });
  }, [isOpen]);

  const getUrl = (token: string) => {
    return `/auth/callback/nodemailer?callbackUrl=${callbackUrl}&token=${token}&email=${encodeURIComponent(email)}`;
  };

  const handleResendCode = async () => {
    setIsResending(true);
    if (inputValue && inputValue.length === 6) {
      try {
        const response = await apiClient.get(getUrl(inputValue));
        if (response.status === 200) {
          toast.success(
            "Le code est valide, pas besoin d'en renvoyer un nouveau"
          );
          return;
        }
      } catch (error) {
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }
    }

    try {
      const decodedEmail = decodeURIComponent(email);
      const result = await signIn("nodemailer", {
        email: decodedEmail,
        redirect: false,
        callbackUrl: "/account"
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      localStorage.setItem("email", email);
      localStorage.setItem("callbackUrl", "/account");

      toast.success("Un nouveau code a été envoyé");
      setTimer(30);
      setInputValue("");
      inputRef.current?.focus();
    } catch (error) {
      toast.error("Erreur lors de l'envoi du code");
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyCode = async (token: string) => {
    setIsVerifying(true);
    try {
      const response = await apiClient.get(getUrl(token));

      localStorage.removeItem("email");
      localStorage.removeItem("callbackUrl");

      const sessionUpdate = await update();
      onSuccess();
      toast.success("Connexion réussie");
      if (sessionUpdate?.user?.isNewUser) {
        router.push("/me/welcome");
      }
    } catch (error) {
      setError("Code invalide");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = async () => {
    onClose();
    if (window.location.pathname !== "/") {
      router.push("/");
    }
  };

  const content = (
    <section className="w-full text-white px-8">
      <Input
        ref={inputRef}
        value={inputValue}
        onChange={(evt: any) => {
          const token = evt.target.value;
          setInputValue(token);
          if (token?.length === 6) {
            handleVerifyCode(token);
          }
        }}
        type="text"
        minLength={6}
        maxLength={6}
        required
        name="token"
        label="Code de vérification"
        style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
        disabled={isVerifying}
      />

      {error && (
        <div className="mb-4 mt-2">
          <Button
            onClick={handleResendCode}
            disabled={isResending || timer > 0}
            className="w-full"
            style={{ backgroundColor: "#191919", color: "#FFFFFF" }}
          >
            <span className="text-white">
              {isResending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : timer > 0 ? (
                `Renvoyer un code (${timer}s)`
              ) : (
                "Renvoyer un code"
              )}
            </span>
          </Button>
        </div>
      )}
    </section>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-custom-black p-8 rounded-lg max-w-sm w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          ✕
        </button>

        <div className="mb-8 flex justify-center">
          <Image
            alt="Logo n°4"
            width={120}
            height={40}
            src="/assets/images/logos/Logo_num4_V2_blanc.png"
          />
        </div>

        {content}
      </div>
    </div>
  );
}
