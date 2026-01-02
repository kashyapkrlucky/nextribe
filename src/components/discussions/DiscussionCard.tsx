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
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-200 overflow-hidden group">
      <header className="flex flex-row justify-between items-center p-4 pb-2">
        <Link
          href={`/community/${item.community.slug}`}
          className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <MessageCircleIcon className="w-3 h-3 text-white" />
          </div>
          <span>{item.community.name}</span>
        </Link>
        <Link
          href={`/profile/${item.author.username}`}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
        >
          <UserIcon className="w-3 h-3" />
          {item.author.username}
        </Link>
      </header>
      
      <section className="px-4 pb-3">
        <Link 
          href={`/discussion/${item.slug}`} 
          className="block font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 mb-2 line-clamp-2"
        >
          {item.title}
        </Link>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
          {item.body}
        </p>
      </section>
      
      <footer className="flex flex-row items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group">
            <ArrowBigUpIcon className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors duration-200" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">0</span>
          </button>
          <button className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group">
            <ArrowBigDownIcon className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">0</span>
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
          href={`/discussion/${item.slug}`}
          className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <MessageCircleIcon className="w-4 h-4" />
            {item.replyCount} Reply
          </Link>
        </div>
      </footer>
    </div>
  );
}
