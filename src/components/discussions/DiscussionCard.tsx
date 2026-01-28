import { IDiscussion } from "@/core/types/index.types";
import { formatRelativeTime } from "@/core/utils/helpers";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  BoxesIcon,
  CircleUserRoundIcon,
  MessageCircleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Text from "@/components/ui/Text";
import MetaText from "@/components/ui/MetaText";

export default function DiscussionCard({ item }: { item: IDiscussion }) {
  const { voteDiscussion } = useDiscussionStore();
  return (
    <article className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-200 overflow-hidden group">
      <header className="flex flex-row justify-between md:items-center p-4 pb-2">
        <Link
          className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400"
          href={`/profile/${item.author.username}`}
        >
          {item.author.avatar ? (
            <Image
              src={item.author.avatar || ""}
              alt={item.author.username}
              width={16}
              height={16}
              className="rounded-full"
            />
          ) : (
            <CircleUserRoundIcon className="w-3 h-3" />
          )}
          {item.author.username}
        </Link>
        <MetaText variant="timestamp">
          {formatRelativeTime(item.createdAt || "")}
        </MetaText>
      </header>

      <section className="px-4 pb-3">
        <Link
          href={`/discussion/${item.slug}`}
          className="block mb-2 line-clamp-2"
        >
          <Text
            variant="h4"
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            {item.title}
          </Text>
        </Link>
        <Text variant="body-xs" color="muted" className="line-clamp-3">
          {item.body}
        </Text>
      </section>

      <footer className="flex flex-row items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-1 text-gray-400"
            onClick={() => voteDiscussion(item.slug, "up")}
          >
            <ArrowBigUpIcon className="w-4 h-4 group-hover:text-green-500 transition-colors duration-200" />
            <MetaText variant="count">{item.upVoteCount || 0}</MetaText>
          </button>
          <button
            className="flex items-center gap-1 text-gray-400"
            onClick={() => voteDiscussion(item.slug, "down")}
          >
            <ArrowBigDownIcon className="w-4 h-4 group-hover:text-red-500 transition-colors duration-200" />
            <MetaText variant="count">{item.downVoteCount || 0}</MetaText>
          </button>
          <Link
            href={`/discussion/${item.slug}`}
            className="flex items-center gap-1 text-xs text-gray-400"
          >
            <MessageCircleIcon className="w-4 h-4 group-hover:text-purple-500 transition-colors duration-200" />
            <MetaText variant="count">{item.replyCount}</MetaText>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <MetaText
            variant="topic"
            href={`/community/${item.community.slug}`}
            icon={<BoxesIcon className="w-3 h-3" />}
          >
            {item.community.name}
          </MetaText>
        </div>
      </footer>
    </article>
  );
}
