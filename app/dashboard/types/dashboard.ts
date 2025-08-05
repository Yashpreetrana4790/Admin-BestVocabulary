export interface DashboardStatsProps {
  stats: {
    totalExpressions: number;
    totalPhrasalVerbs: number;
    totalQuestions: number;
    totalWords: number;
    totalUsers: number;
  };
}
// ../types/dashboard.ts
export type StatKey = 'Expressions' | 'Phrasal Verbs' | 'Questions' | 'Words' | 'Total Users';
