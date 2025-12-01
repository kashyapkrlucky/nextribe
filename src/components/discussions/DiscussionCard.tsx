import { IDiscussion } from "@/core/types/index.types";
import { ArrowBigDownIcon, ArrowBigUpIcon, MessageCircleIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export default function DiscussionCard({
  item,
}: {
  item: IDiscussion;
}) {
  return (
    <div
      // key={item._id.toString()}
      className="p-4 bg-white rounded-lg shadow-xs "
    >
      <header className="flex flex-row justify-between mb-2">
        <Link
          href={`/community/${item.community.slug}`}
          className="text-xs text-blue-700 font-medium flex items-center gap-1"
        >
          <MessageCircleIcon className="w-3 h-3" />
          <span className="ml-1">{item.community.name}</span>
        </Link>
        <Link
          href={`/users/${item.author._id}`}
          className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
        >
          <UserIcon className="w-3 h-3 mr-1" />
          {item.author.name}
        </Link>
      </header>
      <div className="flex items-start gap-3">
        <div className="flex flex-col items-center gap-1">
          <button className="p-1 rounded hover:bg-gray-100">
            <ArrowBigUpIcon className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium">0</span>
          <button className="p-1 rounded hover:bg-gray-100">
            <ArrowBigDownIcon className="w-4 h-4" />
          </button>
        </div>
        <Link href={`/discussion/${item.slug}`} className="flex-1">
          <h3 className="font-medium">{item.title}</h3>
          <p className="text-sm text-gray-500">{item.body}</p>
          <div className="flex items-center gap-2 mt-1">
            <button className="text-xs text-gray-500 hover:text-gray-700">
              Reply
            </button>
            <button className="text-xs text-gray-500 hover:text-gray-700">
              Share
            </button>
          </div>
        </Link>
        <div className="text-xs text-gray-400"></div>
      </div>
    </div>
  );
}
