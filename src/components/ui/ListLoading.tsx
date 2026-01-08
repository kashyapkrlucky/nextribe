import InlineLoader from "./InlineLoader";
import { Types } from "mongoose";

interface ListLoadingProps<T> {
  children: (item: T) => React.ReactNode;
  isLoading: boolean;
  items: T[];
}

export default function ListLoading<T extends { _id: Types.ObjectId }>({
  children,
  isLoading,
  items = [],
}: ListLoadingProps<T>) {
  if (isLoading) {
    return <InlineLoader/>;
  }

  if (!items.length) {
    return <div className="px-2 py-4 text-xs text-gray-500 text-center">Nothing yet.</div>;
  }

  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <div key={item._id.toString()} className="py-1 first:pt-0 last:pb-0">
          {children(item)}
        </div>
      ))}
    </div>
  );
}
