"use client";

import { Star, Trophy, Zap, Flame, MessageSquare, Heart } from "lucide-react";

export default function AchievementBadges() {
  const achievements = [
    {
      id: 1,
      name: "Early Adopter",
      description: "Joined in the first month",
      icon: Star,
      color: "yellow",
      earned: true,
      date: "March 2024"
    },
    {
      id: 2,
      name: "Discussion Starter",
      description: "Created 10+ discussions",
      icon: MessageSquare,
      color: "blue",
      earned: true,
      date: "April 2024"
    },
    {
      id: 3,
      name: "Helpful Helper",
      description: "100+ helpful replies",
      icon: Heart,
      color: "red",
      earned: true,
      date: "May 2024"
    },
    {
      id: 4,
      name: "Rising Star",
      description: "500+ reputation points",
      icon: Trophy,
      color: "purple",
      earned: true,
      date: "June 2024"
    },
    {
      id: 5,
      name: "Speed Demon",
      description: "First to reply 50 times",
      icon: Zap,
      color: "indigo",
      earned: false,
      progress: 35,
      total: 50
    },
    {
      id: 6,
      name: "On Fire",
      description: "30-day activity streak",
      icon: Flame,
      color: "orange",
      earned: false,
      progress: 18,
      total: 30
    }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Achievements</h2>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          View All →
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <div
              key={achievement.id}
              className={`relative group cursor-pointer transition-all duration-300 ${
                achievement.earned 
                  ? 'transform hover:scale-105' 
                  : 'opacity-60'
              }`}
            >
              {/* Badge Card */}
              <div className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                achievement.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-700/50 shadow-lg group-hover:shadow-xl'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}>
                {/* Icon */}
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  achievement.earned
                    ? `bg-${achievement.color}-100 dark:bg-${achievement.color}-900`
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    achievement.earned
                      ? `text-${achievement.color}-600 dark:text-${achievement.color}-400`
                      : 'text-gray-400 dark:text-gray-500'
                  }`} />
                </div>
                
                {/* Badge Info */}
                <div className="space-y-1">
                  <h3 className={`text-sm font-medium ${
                    achievement.earned
                      ? 'text-gray-900 dark:text-gray-200'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {achievement.name}
                  </h3>
                  <p className={`text-xs ${
                    achievement.earned
                      ? 'text-gray-600 dark:text-gray-400'
                      : 'text-gray-400 dark:text-gray-500'
                  }`}>
                    {achievement.description}
                  </p>
                </div>

                {/* Progress for unearned badges */}
                {!achievement.earned && achievement.progress !== undefined && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                      <div 
                        className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {achievement.progress}/{achievement.total}
                    </p>
                  </div>
                )}

                {/* Earned date */}
                {achievement.earned && achievement.date && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {achievement.date}
                  </p>
                )}
              </div>

              {/* Glow effect for earned badges */}
              {achievement.earned && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl blur-xl -z-10 group-hover:from-yellow-400/30 group-hover:to-orange-400/30 transition-all duration-300"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
