import apiClient from "@/libs/api/client";

export class EarningsService {
  static async getEarnings() {
    const response = await apiClient.get("/earnings");
    return response.data;
  }

  static async claimEarnings(amount: number) {
    const response = await apiClient.post("/earnings/claim", { amount });
    return response.data;
  }
}
