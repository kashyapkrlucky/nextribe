import { IDiscussion } from "@/core/types/index.types";
import Link from "next/link";
interface Props {
  item: IDiscussion;
}
export default function DiscussionCardMini({item}: Props) {
  return (
    <div key={item.slug} className="p-4 flex items-center justify-between">
      <div>
        <Link
          href={`/discussion/${item.slug}`}
          className="font-medium hover:underline"
        >
          {item.title}
        </Link>
        <div className="text-xs text-slate-600">
          {(item.commentCount || 0).toLocaleString("en-US")} replies
        </div>
      </div>
      <Link
        href={`/discussion/${item.slug}`}
        className="text-xs border border-gray-200 rounded-md px-2 py-1"
      >
        Reply
      </Link>
    </div>
  );
}
