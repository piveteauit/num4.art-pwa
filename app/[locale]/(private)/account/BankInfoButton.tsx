"use client";
import { useRouter } from "next/navigation";

type BankInfoButtonProps = {
  hasBankAccount: boolean;
};

export default function BankInfoButton({ hasBankAccount }: BankInfoButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/bank-info");
  };

  return (
    <button className="py-2 px-4 w-full text-left" onClick={handleClick}>
      {hasBankAccount ? "Modifier mes informations bancaires" : "Remplir mes informations bancaires"}
    </button>
  );
}
