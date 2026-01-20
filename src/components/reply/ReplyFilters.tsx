import { SearchIcon } from "lucide-react";

export default function ReplyFilters({
  query,
  setQuery,
  tag,
  setTag,
  sort,
  setSort,
  setPage,
}: {
  query: string;
  setQuery: (query: string) => void;
  tag: "all" | "answer" | "tip" | "question";
  setTag: (tag: "all" | "answer" | "tip" | "question") => void;
  sort: "top" | "new";
  setSort: (sort: "top" | "new") => void;
  setPage: (page: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <SearchIcon className="w-4 h-4 absolute left-3 top-5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search replies"
          className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-200"
        />
      </div>

      <select
        value={tag}
        onChange={(e) => {
          setTag(e.target.value as "all" | "answer" | "tip" | "question");
          setPage(1);
        }}
        className="inline-flex border border-gray-200 rounded-lg px-3 py-2 text-sm dark:border-gray-700"
      >
        {(["all", "answer", "tip", "question"] as const).map((t) => (
          <option key={t} value={t}>
            {t === "all" ? "All tags" : t}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) => {
          setSort(e.target.value as "top" | "new");
          setPage(1);
        }}
        className="inline-flex border border-gray-200 rounded-lg px-3 py-2 text-sm dark:border-gray-700"
      >
        <option value="top">Top</option>
        <option value="new">Newest</option>
      </select>
    </div>
  );
}
