import { IDiscussion } from "@/core/types/index.types";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  MessageCircleIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";

export default function DiscussionCard({ item }: { item: IDiscussion }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-xs ">
      <header className="flex flex-row justify-between">
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
      <section className="flex flex-col items-start gap-3 py-4">
        <Link href={`/discussion/${item.slug}`} className="flex-1 font-medium">
          {item.title}
        </Link>
        <p className="text-sm text-gray-500">{item.body}</p>
      </section>
      <footer className="flex flex-row items-center gap-1 justify-between">
        <div className="flex items-center gap-2 mt-1">
          <button className="p-1 flex items-center gap-1 rounded hover:bg-gray-100">
            <ArrowBigUpIcon className="w-4 h-4" />
            <span className="text-xs font-medium">0</span>
          </button>
          <button className="p-1 flex items-center gap-1 rounded hover:bg-gray-100">
            <ArrowBigDownIcon className="w-4 h-4" />
            <span className="text-xs font-medium">0</span>
          </button>
        </div>
        <div className="flex items-center gap-6 mt-1">
          <button className="text-xs text-gray-500 hover:text-gray-700">
            Reply
          </button>
          <button className="text-xs text-gray-500 hover:text-gray-700">
            Share
          </button>
        </div>
      </footer>
    </div>
  );
}
