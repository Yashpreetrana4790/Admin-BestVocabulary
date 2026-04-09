// app/page.tsx (Server Component) - Dashboard at root

import DashboardStats from "./dashboard/components/DashboardStat";
import { Activity, ArrowUpRight, BookOpen, Layers, MessageSquare, HelpCircle } from "lucide-react";
import Link from "next/link";

const getStats = async () => {
  const fallbackStats = {
    totalExpressions: 0,
    totalPhrasalVerbs: 0,
    totalQuestions: 0,
    totalWords: 0,
    totalUsers: 0,
  };
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    return fallbackStats;
  }

  try {
    const res = await fetch(`${apiUrl}/admin/dashboard/stats`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return fallbackStats;
    const payload = await res.json();
    const stats = payload?.data ?? payload;

    return {
      totalExpressions: Number(stats?.totalExpressions ?? 0),
      totalPhrasalVerbs: Number(stats?.totalPhrasalVerbs ?? 0),
      totalQuestions: Number(stats?.totalQuestions ?? 0),
      totalWords: Number(stats?.totalWords ?? 0),
      totalUsers: Number(stats?.totalUsers ?? 0),
    };
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return fallbackStats;
  }
};

const quickActions = [
  { title: "Add Word", href: "/words/new", icon: BookOpen, color: "bg-blue-500" },
  { title: "Add Idiom", href: "/idioms/new", icon: MessageSquare, color: "bg-emerald-500" },
  { title: "Add Phrase", href: "/phrasal-verbs/new", icon: Layers, color: "bg-amber-500" },
  { title: "View Questions", href: "/questions", icon: HelpCircle, color: "bg-purple-500" },
];

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s an overview of your content.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-sm font-medium">
            <Activity className="h-4 w-4" />
            System Online
          </div>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group relative p-5 rounded-2xl border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${action.color.replace('bg-', 'text-')}`} />
                </div>
                <p className="font-medium text-foreground">{action.title}</p>
                <ArrowUpRight className="absolute top-4 right-4 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
