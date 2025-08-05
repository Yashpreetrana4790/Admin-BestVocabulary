'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, MessageSquare, HelpCircle, Layers } from "lucide-react";
import { DashboardStatsProps, StatKey } from '../types/dashboard';




const icons: Record<StatKey, React.ReactElement> = {
  Expressions: <MessageSquare className="h-6 w-6 text-blue-500" />,
  "Phrasal Verbs": <Layers className="h-6 w-6 text-green-500" />,
  Questions: <HelpCircle className="h-6 w-6 text-yellow-500" />,
  Words: <BookOpen className="h-6 w-6 text-purple-500" />,
  "Total Users": <Users className="h-6 w-6 text-pink-500" />,
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statsArray: { title: StatKey; value: number }[] = [
    { title: "Expressions", value: stats.totalExpressions },
    { title: "Phrasal Verbs", value: stats.totalPhrasalVerbs },
    { title: "Questions", value: stats.totalQuestions },
    { title: "Words", value: stats.totalWords },
    { title: "Total Users", value: stats.totalUsers },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statsArray.map((stat) => (
        <Card key={stat.title} className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>{stat.title}</CardTitle>
            {icons[stat.title]}
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-bold">{stat.value}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
