"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { TrendingUpIcon } from "lucide-react";
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

  // Right sidebar data
  const popularItems = filtered.slice(0, 5);

  const onQuery = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  const onSortChange = (newSort: "popular" | "new") => {
    setSort(newSort);
    setPage(1);
  };

  async function onJoin() {
    try {
      const id = community?._id || communityId;
      const res = await fetch(`/api/communities/${id}/join`, {
        method: "POST",
      });
      if (res.status === 401) {
        window.location.href = "/sign-in";
        return;
      }
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json?.error || "Failed to join");
      }
      // Optionally refetch members-related data here in future
      alert("Joined community");
    } catch (e) {
      console.error(e);
      alert("Failed to join");
    }
  }

  return (
    <Fragment>
      {/* Mid section */}
      <section className="flex flex-col flex-1 gap-6">
        <div className="flex flex-col gap-3 bg-white border border-gray-200 rounded-xl p-3">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            {!communityLoading && <h2 className="text-xl font-semibold">
              {community?.name || "Community"}
            </h2>}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCreateDiscussion(true)}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 border border-blue-600 text-blue-600 text-sm"
              >
                Start a Discussion
              </Button>
            </div>
          </div>

          <DiscussionFilters
            query={query}
            onQuery={onQuery}
            sort={sort}
            onSortChange={onSortChange}
          />
        </div>

        <div className="bg-white border border-gray-200 rounded-xl">
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
      </section>

      <aside className="flex flex-col lg:w-1/4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <h3 className="text-sm font-semibold mb-2">About Community</h3>
          <div className="text-sm text-slate-700 mb-6">
            {community?.description || ""}
          </div>

          <div className="mb-2">
            {Array.isArray(community?.topics) && community.topics.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {community.topics.map((topic) => (
                  <span
                    key={topic._id.toString()}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {(topic as { name?: string })?.name || "Unnamed Topic"}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500">No topics</div>
            )}
          </div>

          <button
            onClick={onJoin}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1 border border-blue-600 text-blue-600 text-sm"
          >
            Join Community
          </button>
          <div className="mt-3 text-xs text-slate-600">
            {/* <div>Topics: {Array.isArray(community?.topics) ? community!.topics!.length : 0}</div> */}
            {/* <div>ID: {community?._id}</div> */}
          </div>
          <div className="mt-3 text-xs text-slate-600">
            {/* <div>Topics: {Array.isArray(community?.topics) ? community!.topics!.length : 0}</div> */}
            {/* <div>ID: {community?._id}</div> */}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <h3 className="text-sm font-semibold mb-2">Community Guidelines</h3>
          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
            <li>Be respectful and inclusive</li>
            <li>Stay on topic</li>
            <li>No spam or self-promotion</li>
            <li>Follow local laws and regulations</li>
            <li>Keep discussions constructive</li>
            <li>Report any violations to moderators</li>
          </ul>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4" /> Popular Discussions
          </h3>

          <ListLoading isLoading={false} items={popularItems}>
            {(item) => (
              <div
                key={item.slug}
                className="flex items-center justify-between"
              >
                <Link
                  href={`/discussion/${item.slug}`}
                  className="text-sm hover:underline"
                >
                  {item.title}
                </Link>
                <span className="text-xs text-slate-600">
                  {(item.commentCount || 0).toLocaleString("en-US")}
                </span>
              </div>
            )}
          </ListLoading>
        </div>
      </aside>

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
