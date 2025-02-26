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

    // Ajout de logs pour les erreurs réseau
    if (error.message === "Network Error") {
      console.error("Erreur réseau détectée:", {
        message: error.message,
        stack: error.stack,
        config: error.config
      });
      message = "Erreur de connexion au serveur";
    } else if (error.response?.status === 401) {
      toast.error("Veuillez vous connecter");
      return signIn(undefined, { callbackUrl: config.auth.callbackUrl });
    } else if (error.response?.status === 403) {
      console.log("error.config.url", error.config.url);
      if (error.config.url?.includes("/auth/callback/nodemailer")) {
        message = `Code invalide, veuillez réessayer 31 ${error.message}`;
      } else {
        message = "Abonnement requis pour cette fonctionnalité";
      }
    } else {
      message =
        error?.response?.data?.error || error.message || error.toString();
    }

    error.message =
      typeof message === "string" ? message : JSON.stringify(message);

    // Amélioration des logs d'erreur
    console.error("Détails de l'erreur:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });

    if (error.message) {
      toast.error(error.message);
    } else {
      toast.error("Une erreur est survenue");
    }
    return Promise.reject(error);
  }
);
export default apiClient;
