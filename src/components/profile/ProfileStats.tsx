"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Heart, Share2, TrendingUp, Eye } from "lucide-react";
import { IDiscussion } from "@/core/types/index.types";

interface ProfileStatsProps {
  discussions: IDiscussion[];
}

export default function ProfileStats({ discussions }: ProfileStatsProps) {
  const [animatedStats, setAnimatedStats] = useState({
    discussions: 0,
    replies: 156,
    likes: 89,
    views: 2340,
    reputation: 1250
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({
        discussions: discussions.length,
        replies: 156,
        likes: 89,
        views: 2340,
        reputation: 1250
      });
    }, 100);
    return () => clearTimeout(timer);
  }, [discussions.length]);

  const stats = [
    {
      label: "Discussions",
      value: animatedStats.discussions,
      icon: MessageSquare,
      color: "indigo",
      change: "+12%",
      changeType: "positive"
    },
    {
      label: "Replies", 
      value: animatedStats.replies,
      icon: Share2,
      color: "green",
      change: "+8%",
      changeType: "positive"
    },
    {
      label: "Likes",
      value: animatedStats.likes,
      icon: Heart,
      color: "red",
      change: "+25%",
      changeType: "positive"
    },
    {
      label: "Profile Views",
      value: animatedStats.views,
      icon: Eye,
      color: "blue",
      change: "+15%",
      changeType: "positive"
    },
    {
      label: "Reputation",
      value: animatedStats.reputation,
      icon: TrendingUp,
      color: "purple",
      change: "+5%",
      changeType: "positive"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200 mb-6">Profile Statistics</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="relative p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:shadow-lg transition-all duration-300 group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg`}>
                    <Icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-200 transition-all duration-500">
                    {stat.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
