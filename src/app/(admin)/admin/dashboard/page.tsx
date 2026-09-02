import type { Metadata } from "next";

import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";

export const metadata: Metadata = {
  title:
    "Indian wedding Invitation | Admin Dashboard",
  description: "This is the admin dashboard for the Indian wedding invitation website.",
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
