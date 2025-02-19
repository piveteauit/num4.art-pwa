import apiClient from "@/libs/api/client";

export class PaymentService {
  static async createCheckoutSession(params: {
    priceId: string;
    successUrl: string;
    cancelUrl: string;
  }) {
    const response = await apiClient.post("/stripe/create-checkout", params);
    return response.data;
  }
}
