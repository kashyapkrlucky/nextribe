import { ICommunity } from "@/core/types/index.types";
import { useCommunityStore } from "@/store/useCommunityStore";
import Link from "next/link";

interface Props {
  community: ICommunity;
}

export default function CommunityCardMini({ community }: Props) {
  const { onMemberUpdate } = useCommunityStore();
  return (
    <div
      key={community?._id.toString()}
      className="px-4 py-2 flex items-center justify-between"
    >
      <div>
        <Link
          href={`/community/${community?.slug}`}
          className="font-medium hover:underline"
        >
          {community?.name}
        </Link>
        <div className="text-xs text-slate-600 dark:text-gray-400">
          {(community.memberCount || 0).toLocaleString("en-US")} members
          {Array.isArray(community.topics)
            ? ` • ${community.topics.length} topics`
            : ""}
        </div>
      </div>
      <button
        onClick={() => onMemberUpdate(community.slug, "active")}
        className="text-xs border border-gray-200 rounded-md px-2 py-1 dark:border-gray-700"
      >
        Join
      </button>
    </div>
  );
}
