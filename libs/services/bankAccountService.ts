import apiClient from "@/libs/api/client";
import { BankAccount } from "@/types/bankAccount";

export class BankAccountService {
  static async getBankAccount() {
    const response = await apiClient.get("/bank-account");
    return response.data;
  }

  static async saveBankAccount(
    data: Omit<BankAccount, "id" | "createdAt" | "updatedAt" | "artist">
  ) {
    const response = await apiClient.post("/bank-account", data);
    return response.data;
  }

  static async updateBankAccount(
    data: Omit<BankAccount, "id" | "createdAt" | "updatedAt" | "artist">
  ) {
    const response = await apiClient.put("/bank-account", data);
    return response.data;
  }
}
