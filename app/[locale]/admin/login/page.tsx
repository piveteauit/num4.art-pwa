"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "@/navigation";
import { toast } from "react-hot-toast";
import Input from "@/components/ui/Form/Input/Input";
import Button from "@/components/ui/Button/Button";
import VerifyModal from "@/components/ui/Modal/VerifyModal";
import { useSession } from "next-auth/react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  if (session?.user?.profile?.user?.admin) {
    router.push("/admin");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    setIsSending(true);

    try {
      // Vérifier si l'utilisateur a les droits admin
      const checkAccess = await fetch("/api/admin/check-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      if (!checkAccess.ok) {
        const error = await checkAccess.json();
        toast.error(
          error.error ||
            "Accès non autorisé. Veuillez contacter l'administrateur."
        );
        return;
      }

      const result = await signIn("nodemailer", {
        email,
        redirect: false,
        callbackUrl: "/admin"
      });

      if (result?.ok) {
        localStorage.setItem("email", email);
        localStorage.setItem("callbackUrl", "/admin");
        toast.success("Code de vérification envoyé à " + email);
        setShowVerify(true);
      } else {
        throw new Error("Erreur lors de l'envoi du code");
      }
    } catch (error: any) {
      toast.error("Une erreur est survenue lors de la connexion");
      console.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  // const handleVerifySuccess = () => {
  //   router.push("/admin");
  // };

  //TODO: Empêcher la création d'un compte, uniquement connexion
  return (
    <div className="flex-1 flex items-center justify-center text-black bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-center text-3xl font-bold">Administration</h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            type="email"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            placeholder="Email"
            label="Email"
            required
          />
          <Button type="submit" className="w-full" disabled={isSending}>
            {isSending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Se connecter avec un code"
            )}
          </Button>
        </form>
      </div>

      {showVerify && (
        <VerifyModal
          isOpen={showVerify}
          onClose={() => setShowVerify(false)}
          onSuccess={() => router.push("/admin")}
          isAdmin={true}
        />
      )}
    </div>
  );
}
