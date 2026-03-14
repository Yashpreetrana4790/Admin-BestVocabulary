'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, MessageSquare, HelpCircle, Layers, TrendingUp } from "lucide-react";
import { DashboardStatsProps, StatKey } from '../types/dashboard';

const icons: Record<StatKey, React.ReactElement> = {
  Expressions: <MessageSquare className="h-6 w-6" />,
  "Phrasal Verbs": <Layers className="h-6 w-6" />,
  Questions: <HelpCircle className="h-6 w-6" />,
  Words: <BookOpen className="h-6 w-6" />,
  "Total Users": <Users className="h-6 w-6" />,
};

const iconStyles: Record<StatKey, { bg: string; text: string }> = {
  Expressions: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400" },
  "Phrasal Verbs": { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  Questions: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  Words: { bg: "bg-primary/10", text: "text-primary" },
  "Total Users": { bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400" },
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statsArray: { title: StatKey; value: number }[] = [
    { title: "Words", value: stats.totalWords },
    { title: "Expressions", value: stats.totalExpressions },
    { title: "Phrasal Verbs", value: stats.totalPhrasalVerbs },
    { title: "Questions", value: stats.totalQuestions },
    { title: "Total Users", value: stats.totalUsers },
  ];

  const getPercentage = (title: StatKey): number => {
    const percentages: Record<StatKey, number> = {
      "Expressions": 12,
      "Phrasal Verbs": 8,
      "Questions": 15,
      "Words": 10,
      "Total Users": 18
    };
    return percentages[title];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsArray.map((stat) => (
        <Card 
          key={stat.title} 
          className="group relative overflow-hidden border bg-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${iconStyles[stat.title].bg} group-hover:scale-105 transition-transform`}>
                <div className={iconStyles[stat.title].text}>
                  {icons[stat.title]}
                </div>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+{getPercentage(stat.title)}%</span>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground font-medium mb-1">
                {stat.title}
              </p>
              <span className="text-3xl font-bold text-foreground tracking-tight">
                {stat.value.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
