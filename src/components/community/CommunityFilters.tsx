import { FilterIcon, SearchIcon } from "lucide-react";

interface Props {
  query: string;
  sort: string;
  topic: string;
  onQuery: (query: string) => void;
  onTopicChange: (topic: string) => void;
  onSortChange: (sort: "popular" | "new") => void;
}

export default function CommunityFilters({
  query,
  sort,
  topic,
  onQuery,
  onTopicChange,
  onSortChange,
}: Props) {
  const topics = ["all", "tech", "design", "startup", "health"] as const;
  return (
    <div className="flex flex-col gap-3 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl p-3">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Discover Communities</h2>
        <div className="flex items-center gap-2">
          <select
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm dark:border-gray-600 dark:text-gray-400"
        >
          {topics.map((t) => (
            <option key={t} value={t}>
              {t === "all" ? "All topics" : t}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as "popular" | "new")}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm dark:border-gray-600 dark:text-gray-400"
        >
          <option value="popular">Most popular</option>
          <option value="new">Newest</option>
        </select>
        </div>
      </div>
    </div>
  );
}
