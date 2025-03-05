import React from "react";

type PaymentStatus =
  | "SUCCEEDED"
  | "FAILED"
  | "REFUNDED"
  | "DISPUTED"
  | "PENDING";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig = {
  SUCCEEDED: {
    label: "Réussi",
    bgClass: "bg-green-500/20",
    textClass: "text-green-500"
  },
  FAILED: {
    label: "Échoué",
    bgClass: "bg-red-500/20",
    textClass: "text-red-500"
  },
  REFUNDED: {
    label: "Remboursé",
    bgClass: "bg-blue-500/20",
    textClass: "text-blue-500"
  },
  DISPUTED: {
    label: "Contesté",
    bgClass: "bg-orange-500/20",
    textClass: "text-orange-500"
  },
  PENDING: {
    label: "En attente",
    bgClass: "bg-yellow-500/20",
    textClass: "text-yellow-500"
  }
};

export default function PaymentStatusBadge({
  status,
  className = ""
}: PaymentStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.FAILED;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs ${config.bgClass} ${config.textClass} ${className}`}
    >
      {config.label}
    </span>
  );
}
