"use client";
import AuthModal from "../ui/Modal/AuthModal";
import { Session } from "next-auth";

interface ProviderLight {
  id: string;
  name: string;
  type: "email" | "oauth" | "credentials";
}

interface PrivateRouteProps {
  children: React.ReactNode;
  providers: ProviderLight[];
  session: Session | null;
}

export default function PrivateRoute({
  children,
  providers,
  session
}: PrivateRouteProps) {
  if (!session) {
    return <AuthModal isOpen={true} onClose={() => {}} />;
  }

  return <>{children}</>;
}
