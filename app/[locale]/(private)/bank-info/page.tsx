"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useBankAccount } from "@/libs/hooks/useBankAccount";
import Input from "@/components/ui/Form/Input/Input";
import Button from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import BackButton from "@/components/ui/Button/BackButton";

const REGEX = {
  // Format IBAN français (27 caractères)
  IBAN: /^FR\d{2}\s?(\d{4}\s?){4}\d{4}\s?\d{3}$/,
  // Format BIC/SWIFT (8 ou 11 caractères)
  BIC: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  // Format email standard
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  // Nom complet (2 mots minimum, lettres et tirets autorisés)
  NAME: /^[A-Za-zÀ-ÿ]+(?:\s[A-Za-zÀ-ÿ]+)+$/
};

export default function BankInfo() {
  const router = useRouter();
  const { getBankAccount, saveBankAccount, isLoading } = useBankAccount();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    iban: "",
    bic: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    iban: "",
    bic: ""
  });

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "name":
        return !REGEX.NAME.test(value)
          ? "Veuillez entrer un nom et prénom valides"
          : "";
      case "email":
        return !REGEX.EMAIL.test(value)
          ? "Veuillez entrer une adresse email valide"
          : "";
      case "iban": {
        // Supprime les espaces pour la validation
        const cleanIban = value.replace(/\s/g, "");
        return !REGEX.IBAN.test(cleanIban)
          ? "Veuillez entrer un IBAN français valide"
          : "";
      }
      case "bic":
        return !REGEX.BIC.test(value)
          ? "Veuillez entrer un code BIC/SWIFT valide"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid = () => {
    return (
      formData.name !== "" &&
      formData.email !== "" &&
      formData.iban !== "" &&
      formData.bic !== "" &&
      Object.values(errors).every((error) => error === "")
    );
  };

  useEffect(() => {
    const loadBankAccount = async () => {
      const data = await getBankAccount();
      if (data) {
        setFormData({
          name: data.name,
          email: data.email,
          iban: data.iban,
          bic: data.bic
        });
      }
    };
    loadBankAccount();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }
    try {
      await saveBankAccount(formData);
      toast.success("Informations bancaires enregistrées avec succès");
      router.push("/account");
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des informations bancaires");
    }
  };

  return (
    <div className="min-h-screen bg-custom-black">
      <main className="container mx-auto px-4 py-8">
        <BackButton />
        <div className="max-w-md mx-auto bg-zinc-900 rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">
            Informations bancaires
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                label="Titulaire du compte"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-zinc-800 text-white border-zinc-700"
                error={errors.name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-zinc-800 text-white border-zinc-700"
                error={errors.email}
              />
              <Input
                label="IBAN"
                name="iban"
                value={formData.iban}
                onChange={handleChange}
                required
                className="bg-zinc-800 text-white border-zinc-700"
                error={errors.iban}
                placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
              />
              <Input
                label="BIC"
                name="bic"
                value={formData.bic}
                onChange={handleChange}
                required
                className="bg-zinc-800 text-white border-zinc-700"
                error={errors.bic}
                placeholder="BNPAFRPPXXX"
              />
            </div>
            <div className="flex justify-center">
              <Button
                type="submit"
                loading={isLoading}
                disabled={!isFormValid() || isLoading}
                className="w-full max-w-xs"
              >
                Enregistrer
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
