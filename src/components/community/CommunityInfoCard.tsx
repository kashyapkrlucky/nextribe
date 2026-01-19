import CreateDiscussionForm from "../discussions/CreateDiscussionForm";
import { useState } from "react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { Shield, MessageSquarePlus, DoorOpen, UserPlus } from "lucide-react";
import InlineLoader from "../ui/InlineLoader";
import Button from "../ui/Button";

interface CommunityInfoCardProps {
  slug: string;
}

export default function CommunityInfoCard({ slug }: CommunityInfoCardProps) {
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [isViewMore, setIsViewMore] = useState(false);
  const { community, isLoading, onMemberUpdate } = useCommunityStore();

  return (
    <>
      <div className="relative rounded-2xl shadow-xs border border-gray-200/50 dark:border-gray-700/50 p-6 space-y-4 bg-white dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-2xl text-gray-900 dark:text-gray-100 truncate">
              {community?.name || "Community"}
              <button
                className="pl-4 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                onClick={() => setIsViewMore(!isViewMore)}
              >
                {isViewMore ? "View Less" : "View More"}
              </button>
            </h2>
            <p className="text-gray-600 text-sm font-semibold dark:text-gray-400 leading-relaxed">
              {community?.description || "No description available"}
            </p>
          </div>
          <div>
            {!isLoading ? (
              community?.isMember ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setShowCreateDiscussion(true)}>
                      <MessageSquarePlus className="h-3.5 w-3.5" />
                      Start Discussion
                    </Button>
                    {community?.memberRole !== "owner" && (
                      <Button
                        variant="secondary"
                        onClick={() => onMemberUpdate(slug || "", "left")}
                      >
                        <DoorOpen className="h-3.5 w-3.5" />
                        Leave
                      </Button>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 px-3 py-1">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {community?.memberRole} Since 2025
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onMemberUpdate(slug || "", "active")}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Join Community
                </button>
              )
            ) : (
              <InlineLoader />
            )}
          </div>
        </div>

        {isViewMore && (
          <>
            {/* Topics Section */}
            {Array.isArray(community?.topics) &&
              community.topics.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {community.topics.map((topic) => (
                    <span
                      key={topic?._id?.toString()}
                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 rounded-full text-xs font-medium text-indigo-700 dark:text-indigo-300 transition-all duration-200 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30"
                    >
                      {(topic as { name?: string })?.name || "Unnamed Topic"}
                    </span>
                  ))}
                </div>
              )}
            {/* Guidelines Section */}
            {community?.guidelines && community.guidelines.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                <div className="flex items-center gap-2 pb-2">
                  <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                    <Shield className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    Community Guidelines
                  </p>
                </div>

                <ul className="space-y-1 pl-2">
                  {community.guidelines.map((guideline, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-xs text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 dark:bg-amber-400 mt-2 flex-shrink-0"></div>
                      <span>{guideline}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
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
