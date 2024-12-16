import PrivateRoute from "@/components/auth/PrivateRoute";
import { auth } from "@/auth";

export default async function PrivateLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <PrivateRoute session={session} providers={[]}>
      {children}
    </PrivateRoute>
  );
}
