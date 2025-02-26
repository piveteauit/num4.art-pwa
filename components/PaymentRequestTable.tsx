"use client";
import { useEffect, useState } from "react";
import { PaymentRequestService } from "@/libs/services/paymentRequestService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";

type PaymentRequest = {
  id: string;
  amount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  requestDate: string;
  paymentDate: string | null;
  bankAccount: {
    artist: {
      name: string;
    };
    name: string;
    iban: string;
    bic: string;
    email: string;
  };
};

export default function PaymentRequestTable() {
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRequests = async () => {
    try {
      const data = await PaymentRequestService.getAll();
      setRequests(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des demandes");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleValidate = async (requestId: string) => {
    try {
      await PaymentRequestService.validate(requestId);
      toast.success("Paiement validé avec succès");
      setIsModalOpen(false);
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      toast.error("Erreur lors de la validation du paiement");
      console.error(error);
    }
  };

  const openConfirmationModal = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <table className="w-full table-auto divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="w-[15%] p-2 md:p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="w-[25%] p-2 md:p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Artiste
                </th>
                <th className="w-[5%] p-2 md:p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Montant
                </th>
                <th className="w-[5%] p-2 md:p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="w-[5%] p-2 md:p-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {requests.map((request) => (
                <tr key={request.id}>
                  <td className="w-[20%] p-4 whitespace-normal">
                    {format(new Date(request.requestDate), "dd/MM/yyyy HH:mm", {
                      locale: fr
                    })}
                  </td>
                  <td className="w-[35%] p-4 whitespace-normal">
                    <div>{request.bankAccount.artist.name}</div>
                    <div className="text-sm text-gray-400">
                      {request.bankAccount.email}
                    </div>
                  </td>
                  <td className="w-[15%] p-4 whitespace-normal">
                    {request.amount.toFixed(2)}€
                  </td>
                  <td className="w-[15%] p-4 whitespace-normal">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        request.status === "PENDING"
                          ? "bg-yellow-500/20 text-yellow-500"
                          : request.status === "PAID"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-red-500/20 text-red-500"
                      }`}
                    >
                      {request.status === "PENDING"
                        ? "En attente"
                        : request.status === "PAID"
                          ? "Payé"
                          : "Annulé"}
                    </span>
                  </td>
                  <td className="w-[15%] p-4 whitespace-normal">
                    {request.status === "PENDING" && (
                      <button
                        onClick={() => openConfirmationModal(request)}
                        className="text-green-500 hover:text-green-400"
                      >
                        Valider le paiement
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmation */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Confirmer le paiement comme effectuer
            </h3>
            <div className="space-y-4">
              <p className="text-gray-300">
                Êtes-vous sûr de vouloir valider le paiement comme effectuer
                pour {selectedRequest.bankAccount.artist.name} ?
              </p>
              <div className="text-sm text-gray-400 space-y-2">
                <p>Montant : {selectedRequest.amount.toFixed(2)}€</p>
                <p>IBAN : {selectedRequest.bankAccount.iban}</p>
                <p>BIC : {selectedRequest.bankAccount.bic}</p>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleValidate(selectedRequest.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
