import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";
import config from "@/config";

// use this to interact with our own API (/app/api folder) from the front-end side
// See https://shipfa.st/docs/tutorials/api-call
const apiClient = axios.create({
  baseURL: "/api"
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "";

    if (error.response?.status === 401) {
      toast.error("Veuillez vous connecter");
      return signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    } else if (error.response?.status === 403) {
      console.log("error.config.url", error.config.url);
      if (error.config.url?.includes("/auth/callback/nodemailer")) {
        message = "Code invalide, veuillez réessayer";
      } else {
        message = "Abonnement requis pour cette fonctionnalité";
      }
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    console.error(error.message);

    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("Une erreur est survenue");
    }
    return Promise.reject(error);
  }
);
export default apiClient;
