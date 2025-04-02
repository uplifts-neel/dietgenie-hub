
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, Clock } from "lucide-react";

type StatsProps = {
  stats?: {
    activeMembers?: number;
    trainers?: number;
    operationalHoursTitle?: string;
    operationalHours?: string;
  };
};

const StatsSection = ({ stats }: StatsProps) => {
  const statsItems = [
    {
      title: "Active Members",
      value: stats?.activeMembers || 0,
      icon: Users,
      color: "from-coral-red/80 to-coral-red/20",
    },
    {
      title: "Trainers",
      value: stats?.trainers || 5,
      icon: UserPlus,
      color: "from-turquoise/80 to-turquoise/20",
    },
    {
      title: stats?.operationalHoursTitle || "Operational Hours",
      value: stats?.operationalHours || "5AM - 10PM",
      icon: Clock,
      color: "from-purple-500/80 to-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 px-6">
      {statsItems.map((stat, i) => (
        <Card
          key={i}
          className="glass-card overflow-hidden animate-fade-in border-none"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsSection;
