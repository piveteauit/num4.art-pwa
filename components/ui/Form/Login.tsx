"use client";
import { signIn } from "next-auth/react";
import Button from "../Button/Button";
import Input from "./Input/Input";
import { useState } from "react";
import type {
  OAuthConfig,
  EmailConfig,
  CredentialsConfig
} from "next-auth/providers";
import { toast } from "react-hot-toast";
import { useRef } from "react";
type ProviderType = OAuthConfig<any> | EmailConfig | CredentialsConfig<any>;

interface ProviderLight {
  id: string;
  name: string;
  type: "oauth" | "email" | "credentials";
  style?: any;
}

function Login({
  providers = [],
  onSuccess
}: {
  providers: ProviderLight[];
  onSuccess?: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignin = async ({ id }: ProviderLight) => {
    try {
      if (!validateEmail(email)) {
        toast.error("Veuillez entrer une adresse email valide");
        return;
      }

      setIsSending(true);

      if (id === "nodemailer") {
        const result = await signIn("nodemailer", {
          email,
          redirect: false,
          callbackUrl: "/account"
        });

        if (result?.ok) {
          console.log("result", result);

          localStorage.setItem("email", email);
          localStorage.setItem("callbackUrl", "/account");
          toast.success("Code de vérification envoyé à " + email);
          onSuccess?.(email);
        } else {
          console.error("result", result);
          throw new Error("Erreur lors de l'envoi du code");
        }
      } else {
        const result = await signIn(id, {
          redirect: false,
          callbackUrl: "/account"
        });
        if (result?.ok) {
          onSuccess?.(email);
        }
      }
    } catch (error: any) {
      toast.error("Une erreur est survenue lors de la connexion");
      console.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const providersArr = providers;

  return (
    <section className="w-full text-white">
      <Input
        ref={inputRef}
        type="email"
        autoComplete="email"
        name="email"
        value={email}
        label="email"
        onChange={({ target: { value } }: any) => setEmail(value)}
        style={{ backgroundColor: "#FFFFFF", color: "#000000" }}
      />
      {providersArr.map((provider, i) => {
        return (
          <div key={provider.name} className="mb-4 mt-2">
            <Button
              className={`w-full hover:scale-105 ${i ? "bg-secondary border-none" : ""}`}
              onClick={() => handleSignin(provider)}
              style={{ backgroundColor: "#191919", color: "#FFFFFF" }}
              disabled={isSending}
            >
              {isSending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Se connecter avec un code"
              )}
            </Button>

            <div
              className={`flex items-center my-3 ${
                providersArr.length - 1 > providersArr.indexOf(provider)
                  ? ""
                  : "hidden"
              }`}
            >
              <hr className="my-2 flex-1" />
              <span className="mx-2"> OU </span>
              <hr className="my-2 flex-1" />
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default Login;
