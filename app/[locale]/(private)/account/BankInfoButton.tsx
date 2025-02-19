"use client";
import Button from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";

type BankInfoButtonProps = {
  hasBankAccount: boolean;
};

export default function BankInfoButton({
  hasBankAccount
}: BankInfoButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push("/bank-info");
  };

  return <button className="py-2 w-full text-left" onClick={handleClick}>Mes informations bancaires</button>;
}
