import { IReply } from "@/core/types/index.types";
import { formatDate } from "@/core/utils/helpers";
import { useAuth } from "@/hooks/useAuth";
import { useReplyStore } from "@/store/useReplyStore";
import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  Trash2Icon,
  UserCircle2Icon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button";

export default function ReplyCard({ reply }: { reply: IReply }) {
  const { updateVoteOnReply, deleteReply } = useReplyStore();
  const { user } = useAuth();
  const onVote = async (vote: "up" | "down", replyId: string) => {
    try {
      updateVoteOnReply(replyId, vote);
    } catch (error) {
      console.error("Vote error:", error);
    }
  };
  return (
    <div className="py-4 flex flex-row items-start gap-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center gap-1">
        <button
          className={`flex flex-col hover:text-indigo-500 p-1`}
          aria-label="Upvote"
          type="button"
          onClick={() => onVote("up", reply._id.toString())}
        >
          <ArrowBigUpIcon className="w-4 h-4" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {reply.upVoteCount}
          </span>
        </button>
        <button
          className={`flex flex-col hover:text-red-500 p-1`}
          aria-label="Downvote"
          type="button"
          onClick={() => onVote("down", reply._id.toString())}
        >
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {reply.downVoteCount}
          </span>
          <ArrowBigDownIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center gap-2 text-xs text-slate-600 dark:text-slate-200 mb-1">
          <div className="flex items-center gap-2">
            {reply?.author?.avatar ? (
              <Image
                src={reply?.author?.avatar}
                alt={reply?.author?.username}
                width={18}
                height={18}
                className="rounded-full"
              />
            ) : (
              <UserCircle2Icon className="w-4 h-4 text-gray-400" />
            )}
            <Link
              href={`/profile/${reply?.author?.username}`}
              className="font-medium"
            >
              {reply?.author?.username}
            </Link>
            <span>•</span>
            <span>{formatDate(reply.createdAt.toString())}</span>
            <span>•</span>
            <span className="inline-flex items-center rounded uppercase font-medium bg-slate-100 dark:bg-slate-700 px-2 py-0.5">
              {reply.tag}
            </span>
          </div>

          {user?.id === String(reply.author._id) && (
            <Button
              variant="outline"
              size="xs"
              onClick={() => deleteReply(reply._id.toString())}
            >
              <Trash2Icon className="w-3 h-3" />
            </Button>
          )}
        </div>
        <div className="text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
          {reply.body}
        </div>
      </div>
    </div>
  );
}
