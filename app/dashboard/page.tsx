// app/dashboard/page.tsx (Server Component)

import DashboardStats from "./components/DashboardStat";

const getStats = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard/stats`, {
    next: { revalidate: 3600 }, // ISR: cache for 1 hour
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <DashboardStats stats={stats} />
    </div>
  );
}
