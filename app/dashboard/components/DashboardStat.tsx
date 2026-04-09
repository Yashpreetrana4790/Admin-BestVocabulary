'use client';

import React from 'react';
import { Users, BookOpen, MessageSquare, HelpCircle, Layers, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { DashboardStatsProps, StatKey } from '../types/dashboard';

const statConfig: Record<StatKey, { 
  icon: React.ReactElement;
  gradient: string;
  iconBg: string;
  iconColor: string;
}> = {
  Words: {
    icon: <BookOpen className="h-5 w-5" />,
    gradient: "from-blue-500/10 to-blue-500/5",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  Expressions: {
    icon: <MessageSquare className="h-5 w-5" />,
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
  "Phrasal Verbs": {
    icon: <Layers className="h-5 w-5" />,
    gradient: "from-amber-500/10 to-amber-500/5",
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
  Questions: {
    icon: <HelpCircle className="h-5 w-5" />,
    gradient: "from-purple-500/10 to-purple-500/5",
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  "Total Users": {
    icon: <Users className="h-5 w-5" />,
    gradient: "from-rose-500/10 to-rose-500/5",
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-600",
  },
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statsArray: { title: StatKey; value: number; change: number }[] = [
    { title: "Words", value: stats?.totalWords ?? 0, change: 10 },
    { title: "Expressions", value: stats?.totalExpressions ?? 0, change: 12 },
    { title: "Phrasal Verbs", value: stats?.totalPhrasalVerbs ?? 0, change: 8 },
    { title: "Questions", value: stats?.totalQuestions ?? 0, change: 15 },
    { title: "Total Users", value: stats?.totalUsers ?? 0, change: 18 },
  ];

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3.5 w-3.5" />;
    if (change < 0) return <TrendingDown className="h-3.5 w-3.5" />;
    return <Minus className="h-3.5 w-3.5" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-emerald-600 bg-emerald-500/10";
    if (change < 0) return "text-rose-600 bg-rose-500/10";
    return "text-muted-foreground bg-muted";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsArray.map((stat) => {
        const config = statConfig[stat.title];
        return (
          <div 
            key={stat.title} 
            className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${config.gradient} p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300`}
          >
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${config.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                  <div className={config.iconColor}>
                    {config.icon}
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getTrendColor(stat.change)}`}>
                  {getTrendIcon(stat.change)}
                  <span>{stat.change > 0 ? '+' : ''}{stat.change}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground font-medium mb-1">
                  {stat.title}
                </p>
                <span className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {stat.value.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
