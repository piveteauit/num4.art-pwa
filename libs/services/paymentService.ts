import apiClient from "@/libs/api/client";

export class PaymentService {
  static async createPaymentIntent(songId: string) {
    const response = await apiClient.post("/stripe/create-payment-intent", {
      songId
    });
    return response.data;
  }
}
