import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";
import { requireUser } from "@/lib/auth/session";

export default async function HomePage() {
  const user = await requireUser();

  return <DashboardPageClient user={user} />;
}
