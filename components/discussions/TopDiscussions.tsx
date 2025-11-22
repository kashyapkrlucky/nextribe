import { TrendingUpIcon } from "lucide-react";
import Link from "next/link";

export function TopDiscussions() {
  const topDiscussions = [
    { id: 101, title: "What tools are you using in 2025?", replies: 128 },
    { id: 102, title: "Show your latest side project", replies: 67 },
    { id: 103, title: "Best practices for onboarding", replies: 54 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
        <TrendingUpIcon className="w-4 h-4 mr-1" /> Top Discussions
      </h3>
      <ul className="space-y-2">
        {topDiscussions.map((d) => (
          <li key={d.id} className="text-sm">
            <Link href={`/discussion/${d.id}`} className="hover:underline">
              {d.title}
            </Link>
            <div className="text-xs text-slate-600">{d.replies} replies</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
