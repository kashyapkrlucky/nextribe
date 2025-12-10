import { SearchIcon } from "lucide-react";
interface Props {
  query: string;
  onQuery: (query: string) => void;
  sort: "popular" | "new";
  onSortChange: (sort: "popular" | "new") => void;
}
export default function DiscussionFilters({
  query,
  onQuery,
  sort,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="relative flex-1">
        <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search discussions"
          className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as "popular" | "new")}
        className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm"
      >
        <option value="popular">Most popular</option>
        <option value="new">Newest</option>
      </select>
    </div>
  );
}
