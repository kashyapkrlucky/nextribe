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
    <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-3">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold">Discover Communities</h2>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex items-center justify-center bg-white rounded-lg border border-gray-200 px-2 py-2"
            title="Filters"
          >
            <FilterIcon className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search communities"
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <select
          value={topic}
          onChange={(e) => onTopicChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
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
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
        >
          <option value="popular">Most popular</option>
          <option value="new">Newest</option>
        </select>
      </div>
    </div>
  );
}
