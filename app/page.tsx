// app/page.tsx (Server Component) - Dashboard at root

import DashboardStats from "./dashboard/components/DashboardStat";

const getStats = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not defined. Please create a .env.local file with: NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1'
    );
  }

  const res = await fetch(`${apiUrl}/admin/dashboard/stats`, {
    next: { revalidate: 3600 }, // ISR: cache for 1 hour
  });
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
};

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <DashboardStats stats={stats} />
    </div>
  );
}