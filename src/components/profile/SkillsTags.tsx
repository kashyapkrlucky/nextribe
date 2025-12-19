"use client";

import { Code, Database, Cloud, Cpu } from "lucide-react";

export default function SkillsTags() {
  const skills = [
    {
      category: "Frontend",
      icon: Code,
      color: "blue",
      items: [
        { name: "React", level: 5, endorsements: 23 },
        { name: "TypeScript", level: 4, endorsements: 18 },
        { name: "Next.js", level: 5, endorsements: 15 },
        { name: "Tailwind CSS", level: 4, endorsements: 12 }
      ]
    },
    {
      category: "Backend", 
      icon: Database,
      color: "green",
      items: [
        { name: "Node.js", level: 4, endorsements: 20 },
        { name: "PostgreSQL", level: 3, endorsements: 8 },
        { name: "GraphQL", level: 3, endorsements: 11 },
        { name: "Redis", level: 3, endorsements: 6 }
      ]
    },
    {
      category: "Cloud & DevOps",
      icon: Cloud,
      color: "purple",
      items: [
        { name: "AWS", level: 4, endorsements: 14 },
        { name: "Docker", level: 3, endorsements: 9 },
        { name: "Kubernetes", level: 2, endorsements: 5 },
        { name: "CI/CD", level: 4, endorsements: 7 }
      ]
    },
    {
      category: "Tools & Others",
      icon: Cpu,
      color: "orange",
      items: [
        { name: "Git", level: 5, endorsements: 25 },
        { name: "Figma", level: 3, endorsements: 4 },
        { name: "VS Code", level: 5, endorsements: 12 },
        { name: "Linux", level: 4, endorsements: 8 }
      ]
    }
  ];

  const getLevelColor = (level: number) => {
    const colors = [
      "bg-gray-200 dark:bg-gray-600",
      "bg-green-200 dark:bg-green-800", 
      "bg-green-300 dark:bg-green-700",
      "bg-green-400 dark:bg-green-600",
      "bg-green-500 dark:bg-green-500"
    ];
    return colors[level] || colors[0];
  };

  const getLevelText = (level: number) => {
    const levels = ["", "Beginner", "Intermediate", "Advanced", "Expert", "Master"];
    return levels[level] || "";
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-200">Skills & Expertise</h2>
        <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Manage Skills →
        </button>
      </div>

      <div className="space-y-6">
        {skills.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.category} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 bg-${category.color}-100 dark:bg-${category.color}-900 rounded-lg`}>
                  <Icon className={`h-5 w-5 text-${category.color}-600 dark:text-${category.color}-400`} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                  {category.category}
                </h3>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.items.map((skill) => (
                  <div
                    key={skill.name}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    {/* Skill Name and Level */}
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {skill.name}
                      </h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getLevelText(skill.level)}
                      </span>
                    </div>

                    {/* Skill Level Bar */}
                    <div className="mb-3">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-2 flex-1 rounded-full ${
                              level <= skill.level
                                ? getLevelColor(skill.level)
                                : "bg-gray-200 dark:bg-gray-600"
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Endorsements */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="flex -space-x-1">
                          {[...Array(Math.min(3, skill.endorsements))].map((_, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 border border-white dark:border-gray-800"
                            ></div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {skill.endorsements} endorsements
                        </span>
                      </div>
                      <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        Endorse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
