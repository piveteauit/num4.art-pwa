import { useState } from "react";
import { BankAccountService } from "@/libs/services/bankAccountService";
import { toast } from "react-hot-toast";
import { BankAccount } from "@/types/bankAccount";

export function useBankAccount() {
  const [isLoading, setIsLoading] = useState(false);

  const getBankAccount = async () => {
    setIsLoading(true);
    try {
      const response = await BankAccountService.getBankAccount();
      return response.bankAccount;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations bancaires",
        error
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveBankAccount = async (
    data: Omit<BankAccount, "id" | "createdAt" | "updatedAt" | "artist">
  ) => {
    setIsLoading(true);
    try {
      const response = await BankAccountService.saveBankAccount(data);
      return response.bankAccount;
    } catch (error) {
      console.error(
        "Erreur lors de l'enregistrement des informations bancaires",
        error
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    getBankAccount,
    saveBankAccount
  };
}
