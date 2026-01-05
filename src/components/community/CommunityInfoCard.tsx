import CreateDiscussionForm from "../discussions/CreateDiscussionForm";
import { useState } from "react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { Shield, MessageSquarePlus, DoorOpen, UserPlus } from "lucide-react";
import InlineLoader from "../ui/InlineLoader";

interface CommunityInfoCardProps {
  slug: string;
}

export default function CommunityInfoCard({ slug }: CommunityInfoCardProps) {
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);

  const { community, isLoading, onMemberUpdate } = useCommunityStore();

  return (
    <>
      <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        {/* Header with decorative gradient */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="p-6 space-y-6">
          {/* Community Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 truncate mb-2">
                  {community?.name || "Community"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {community?.description || "No description available"}
                </p>
              </div>
              {community?.isMember && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300 capitalize">
                    {community?.memberRole}
                  </span>
                </div>
              )}
            </div>

            {/* Topics Section */}
            {Array.isArray(community?.topics) &&
              community.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {community.topics.map((topic) => (
                    <span
                      key={topic._id.toString()}
                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-full text-xs font-medium text-indigo-700 dark:text-indigo-300 transition-all duration-200 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30"
                    >
                      {(topic as { name?: string })?.name || "Unnamed Topic"}
                    </span>
                  ))}
                </div>
              )}

            {/* Action Buttons */}
            {!isLoading ? (
              <div className="flex flex-col gap-3 pt-2">
                {community?.isMember ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCreateDiscussion(true)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                    >
                      <MessageSquarePlus className="h-3.5 w-3.5" />
                      Start Discussion
                    </button>
                    {community?.memberRole !== "owner" && (
                      <button
                        onClick={() => onMemberUpdate(slug || "", "left")}
                        className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <DoorOpen className="h-3.5 w-3.5" />
                        Leave
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => onMemberUpdate(slug || "", "active")}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Join Community
                  </button>
                )}
              </div>
            ) : (
              <InlineLoader />
            )}
          </div>

          {/* Guidelines Section */}
          {community?.guidelines && community.guidelines.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Community Guidelines
                  </h3>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800/30">
                  <ul className="space-y-2">
                    {community.guidelines.map((guideline, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mt-2 flex-shrink-0"></div>
                        <span>{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showCreateDiscussion && (
        <CreateDiscussionForm
          setShowCreateDiscussion={setShowCreateDiscussion}
          onClose={() => {
            setShowCreateDiscussion(false);
          }}
          communityId={community?._id?.toString() || ""}
        />
      )}
    </>
  );
}
