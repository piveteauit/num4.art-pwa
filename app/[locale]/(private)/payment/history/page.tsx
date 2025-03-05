"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import PaymentStatusBadge from "@/components/ui/Payment/PaymentStatusBadge";
import Link from "next/link";
import { toast } from "react-hot-toast";

type PaymentLog = {
  id: string;
  status: "SUCCEEDED" | "FAILED" | "REFUNDED" | "DISPUTED";
  amount: number;
  createdAt: string;
  errorMessage?: string;
  song?: {
    id: string;
    title: string;
    image: string;
    artists: {
      name: string;
    }[];
  } | null;
};

export default function PaymentHistoryPage() {
  const [paymentLogs, setPaymentLogs] = useState<PaymentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch("/api/payment/history");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de l'historique");
        }
        const data = await response.json();
        setPaymentLogs(data.paymentLogs);
      } catch (error) {
        console.error("Erreur:", error);
        toast.error("Impossible de charger votre historique de paiements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Historique des paiements</h1>

      {paymentLogs.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-800 p-8 rounded-xl max-w-lg mx-auto">
            <h2 className="text-xl font-medium mb-3">Aucun paiement trouvé</h2>
            <p className="text-white/60 mb-6">
              Vous n&apos;avez effectué aucun achat pour le moment.
            </p>
            <Link href="/explore" className="btn btn-primary">
              Explorer les titres
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Titre</th>
                  <th className="p-4 text-left">Montant</th>
                  <th className="p-4 text-left">Statut</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {paymentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-800/40">
                    <td className="p-4">
                      {format(new Date(log.createdAt), "dd MMM yyyy HH:mm", {
                        locale: fr
                      })}
                    </td>
                    <td className="p-4">
                      {log.song ? (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-700 relative overflow-hidden">
                            {log.song.image && (
                              <img
                                src={log.song.image}
                                alt={log.song.title}
                                className="object-cover w-full h-full"
                              />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{log.song.title}</div>
                            <div className="text-sm text-white/60">
                              {log.song.artists[0]?.name}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-white/40">Non disponible</span>
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      {log.amount.toFixed(2)}€
                    </td>
                    <td className="p-4">
                      <PaymentStatusBadge status={log.status} />
                      {log.errorMessage && (
                        <div className="text-xs text-white/60 mt-1">
                          {log.errorMessage.length > 30
                            ? `${log.errorMessage.substring(0, 30)}...`
                            : log.errorMessage}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {log.song && log.status === "SUCCEEDED" && (
                        <Link
                          href={`/song/${log.song.id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Voir le titre
                        </Link>
                      )}
                      {log.status === "FAILED" && (
                        <Link
                          href="/contact"
                          className="text-white/60 hover:text-white text-sm"
                        >
                          Assistance
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
