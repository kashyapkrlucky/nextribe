export default function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex items-center justify-between p-3 border-t border-gray-200 text-sm">
      <div>
        Page {currentPage} of {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <button
          className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          Prev
        </button>
        <button
          className="px-3 py-1 border border-gray-200 rounded-md disabled:opacity-50"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}