import apiClient from "@/libs/api/client";

export class PaymentRequestService {
  static async getAll() {
    const response = await apiClient.get("/admin/payment-requests");
    return response.data;
  }

  static async validate(requestId: string) {
    const response = await apiClient.post(
      `/admin/payment-requests/${requestId}/validate`
    );
    return response.data;
  }

  static async create(amount: number) {
    const response = await apiClient.post("/payment-requests", { amount });
    return response.data;
  }

  static async getArtistRequests() {
    const response = await apiClient.get("/payment-requests");
    return response.data;
  }
}
