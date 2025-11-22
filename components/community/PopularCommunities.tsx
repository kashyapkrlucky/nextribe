import { TrendingUpIcon } from "lucide-react";
import Link from "next/link";

const popularItems = [
  { _id: "1", name: "Tech Enthusiasts", membersCount: 1250 },
  { _id: "2", name: "Design Collective", membersCount: 890 },
  { _id: "3", name: "Startup Founders", membersCount: 640 },
];

export function PopularCommunities() {
  return <div className="bg-white border border-gray-200 rounded-xl p-3">
          <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4" /> Popular Communities
          </h3>
          <ul className="space-y-2">
            {popularItems.map((c) => (
              <li key={c._id} className="flex items-center justify-between">
                <Link
                  href={`/community/${c._id}`}
                  className="text-sm hover:underline"
                >
                  {c.name}
                </Link>
                <span className="text-xs text-slate-600">
                  {(c?.membersCount || 0).toLocaleString("en-US")}
                </span>
              </li>
            ))}
          </ul>
        </div>;
}