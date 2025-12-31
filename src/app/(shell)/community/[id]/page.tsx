"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import CreateDiscussionForm from "@/components/discussions/CreateDiscussionForm";
import ListLoading from "@/components/ui/ListLoading";
import { useCommunityStore } from "@/store/useCommunityStore";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import Pagination from "@/components/ui/Pagination";
import DiscussionFilters from "@/components/discussions/DiscussionFilters";
import DiscussionCardMini from "@/components/discussions/DiscussionCardMini";

export default function CommunityPage() {
  const params = useParams();
  const communityId = (params?.id as string) || "";
  const {
    community,
    fetchCommunityByID,
    fetchCommunityBySlug,
    isLoading: communityLoading,
  } = useCommunityStore();
  const {
    isLoading: discussionsLoading,
    discussionList,
    fetchDiscussionsByCommunity,
  } = useDiscussionStore();

  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);

  // UI state
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"popular" | "new">("popular");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  function isObjectIdLike(s: string) {
    return /^[a-fA-F0-9]{24}$/.test(s);
  }

  useEffect(() => {
    if (isObjectIdLike(communityId)) {
      fetchCommunityByID(communityId);
    } else {
      fetchCommunityBySlug(communityId);
    }
    fetchDiscussionsByCommunity(communityId);
  }, [
    communityId,
    fetchCommunityByID,
    fetchCommunityBySlug,
    fetchDiscussionsByCommunity,
  ]);

  const filtered = useMemo(() => {
    let list = [...discussionList];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q)
      );
    }
    if (sort === "popular") {
      list.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
    } else {
      list.sort(
        (a, b) =>
          new Date(a.createdAt || 0).getTime() -
          new Date(b.createdAt || 0).getTime()
      );
    }
    return list;
  }, [discussionList, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const onQuery = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  const onSortChange = (newSort: "popular" | "new") => {
    setSort(newSort);
    setPage(1);
  };

  const { onCommunityJoin } = useCommunityStore();

  return (
    <Fragment>
      {/* Mid section */}
      <section className="max-w-7xl mx-auto flex flex-row flex-1 gap-4">
        <div className="w-3/4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <DiscussionFilters
            query={query}
            onQuery={onQuery}
            sort={sort}
            onSortChange={onSortChange}
          />
          <ListLoading isLoading={discussionsLoading} items={discussionList}>
            {(item) => <DiscussionCardMini item={item} />}
          </ListLoading>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        <div className="w-1/4">
          {!communityLoading && (
            <div className="flex flex-col gap-2 bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-xl p-3">
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold">
                    {community?.name || "Community"}
                  </h2>
                  <div className="text-sm text-slate-700 dark:text-gray-400">
                    {community?.description || ""}
                  </div>
                  <div className="mb-2">
                    {Array.isArray(community?.topics) &&
                    community.topics.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {community.topics.map((topic) => (
                          <span
                            key={topic._id.toString()}
                            className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded"
                          >
                            {(topic as { name?: string })?.name ||
                              "Unnamed Topic"}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500">No topics</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setShowCreateDiscussion(true)}
                    className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-indigo-600 text-indigo-600 dark:text-indigo-400 text-sm"
                  >
                    Start Discussion
                  </Button>
                  <Button
                    onClick={() => onCommunityJoin(communityId)}
                    className="inline-flex items-center gap-2 rounded-lg px-2 py-1 border border-indigo-600 text-indigo-600 dark:text-indigo-400 text-sm"
                  >
                    Join
                  </Button>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3">
                <h3 className="text-sm font-semibold mb-2">
                  Community Guidelines
                </h3>
                <ul className="list-disc list-inside text-sm text-slate-600 dark:text-gray-400 space-y-1">
                  <li>Be respectful and inclusive</li>
                  <li>Stay on topic</li>
                  <li>No spam or self-promotion</li>
                  <li>Follow local laws and regulations</li>
                  <li>Keep discussions constructive</li>
                  <li>Report any violations to moderators</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>

      {showCreateDiscussion && (
        <CreateDiscussionForm
          setShowCreateDiscussion={setShowCreateDiscussion}
          onClose={() => {
            setShowCreateDiscussion(false);
            // getDiscussions();
          }}
          communityId={community?._id?.toString() || ""}
        />
      )}
    </Fragment>
  );
}
