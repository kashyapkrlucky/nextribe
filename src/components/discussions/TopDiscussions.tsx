import { IDiscussion } from "@/core/types/index.types";
import { TrendingUpIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function TopDiscussions() {
  const [list, setList] = useState<IDiscussion[]>([]);

  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        const response = await fetch("/api/discussions/top");
        const { data } = await response.json();
        setList(data || []);
      } catch (error) {
        console.error("Error fetching top discussions:", error);
        setList([]);
      }
    };
    fetchDiscussions();
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
        <TrendingUpIcon className="w-4 h-4 mr-1" /> Top Discussions
      </h3>
      {list.length === 0 ? (
        <p className="text-xs text-slate-500 text-center py-2">
          No discussions found
        </p>
      ) : (
        <ul className="space-y-2">
          {list?.map((d: IDiscussion) => (
            <li key={d._id.toString()} className="text-sm">
              <Link href={`/discussion/${d._id}`} className="hover:underline">
                {d.title}
              </Link>
              <div className="text-xs text-slate-600">
                {d.replyCount ?? 0} replies
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
