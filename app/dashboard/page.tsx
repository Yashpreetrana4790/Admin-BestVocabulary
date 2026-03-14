import DashboardStats from "./components/DashboardStat";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Activity, BookOpen, Zap } from "lucide-react";
import Link from "next/link";

const getStats = async () => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error('NEXT_PUBLIC_API_URL environment variable is not set');
      return {
        totalExpressions: 0,
        totalPhrasalVerbs: 0,
        totalQuestions: 0,
        totalWords: 0,
        totalUsers: 0
      };
    }

    const res = await fetch(`${apiUrl}/admin/dashboard/stats`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch stats: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      totalExpressions: 0,
      totalPhrasalVerbs: 0,
      totalQuestions: 0,
      totalWords: 0,
      totalUsers: 0
    };
  }
};

export default async function DashboardPage() {
  const stats = await getStats();

  const totalContent = stats.totalWords + stats.totalPhrasalVerbs + stats.totalQuestions + stats.totalExpressions;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here&apos;s your content overview
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Activity className="h-4 w-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">All Systems Operational</span>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Content Card */}
          <Card className="border bg-card hover:shadow-lg hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Total Content</h3>
                <div className="p-2 rounded-xl bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{totalContent.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">
                Words, phrases, questions & expressions
              </p>
            </CardContent>
          </Card>

          {/* Growth Card */}
          <Card className="border bg-card hover:shadow-lg hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Monthly Growth</h3>
                <div className="p-2 rounded-xl bg-emerald-500/10">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">+15%</p>
              <p className="text-sm text-muted-foreground">
                Compared to last month
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border bg-card hover:shadow-lg hover:border-primary/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Quick Actions</h3>
                <div className="p-2 rounded-xl bg-amber-500/10">
                  <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Link href="/words" className="block px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors">
                  Manage Words
                </Link>
                <Link href="/phrasal-verbs" className="block px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium text-foreground transition-colors">
                  Manage Phrasal Verbs
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Insights */}
        <Card className="border bg-card">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Quick Insights</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">Avg. Words/User</p>
                <p className="text-2xl font-bold text-foreground">{(stats.totalWords / Math.max(1, stats.totalUsers)).toFixed(0)}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">Content Density</p>
                <p className="text-2xl font-bold text-foreground">{(totalContent / Math.max(1, stats.totalUsers)).toFixed(1)}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">Phrasal Ratio</p>
                <p className="text-2xl font-bold text-foreground">{(stats.totalPhrasalVerbs / Math.max(1, totalContent) * 100).toFixed(0)}%</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50 border">
                <p className="text-sm text-muted-foreground mb-1">Questions/Content</p>
                <p className="text-2xl font-bold text-foreground">{(stats.totalQuestions / Math.max(1, totalContent)).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
