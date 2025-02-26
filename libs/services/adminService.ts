import apiClient from "@/libs/api/client";

export class AdminService {
  static async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post("/api/admin/auth", credentials);
    return response.data;
  }
}
