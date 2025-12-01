import { Spinner } from "./Spinner";
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
    return <Spinner />;
  }

  if (!items.length) {
    return <p className="px-2 py-2 text-xs text-gray-500">Nothing yet.</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      {items.map((item) => (
        <div key={item._id.toString()}>
          {children(item)}
        </div>
      ))}
    </div>
  );
}
