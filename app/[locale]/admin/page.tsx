import { redirect } from "@/navigation";
import { auth } from "@/auth";
import PaymentRequestTable from "../../../components/PaymentRequestTable";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }
  if (!session?.user?.profile?.user?.admin) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col space-y-6 max-w-[100svw] mt-10">
      <h1 className="text-2xl font-bold">Demandes de paiement</h1>
      <div className="bg-white shadow rounded-lg">
        <PaymentRequestTable />
      </div>
    </div>
  );
}
