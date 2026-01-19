import CreateDiscussionForm from "../discussions/CreateDiscussionForm";
import { useState } from "react";
import { useCommunityStore } from "@/store/useCommunityStore";
import { Shield, MessageSquarePlus, DoorOpen, UserPlus, Users, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import InlineLoader from "../ui/InlineLoader";
import Button from "../ui/Button";

interface CommunityInfoCardProps {
  slug: string;
}

export default function CommunityInfoCard({ slug }: CommunityInfoCardProps) {
  const [showCreateDiscussion, setShowCreateDiscussion] = useState(false);
  const [isViewMore, setIsViewMore] = useState(false);
  const { communityMember, isLoading, onMemberUpdate } = useCommunityStore();

  return (
    <>
      <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 space-y-6 dark:bg-gray-800 bg-white">
        {/* Header with enhanced visual hierarchy */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                {communityMember?.name || "Community"}
              </h2>
              
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
              {communityMember?.description || "No description available"}
            </p>
            
            {/* Community stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>{communityMember?.memberCount || 0} members</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Created {communityMember?.createdAt ? new Date(communityMember.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently'}</span>
              </div>
              <button
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200"
                onClick={() => setIsViewMore(!isViewMore)}
              >
                {isViewMore ? (
                  <><ChevronUp className="h-3.5 w-3.5" /> View Less</>
                ) : (
                  <><ChevronDown className="h-3.5 w-3.5" /> View More</>
                )}
              </button>
            </div>
          </div>
          <div className="lg:w-auto w-full">
            {!isLoading ? (
              communityMember?.member ? (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      onClick={() => setShowCreateDiscussion(true)}
                      className="flex-1 sm:flex-none shadow-md hover:shadow-lg transition-shadow duration-200"
                    >
                      <MessageSquarePlus className="h-4 w-4" />
                      Start Discussion
                    </Button>
                    {communityMember?.role !== "owner" && (
                      <Button
                        variant="secondary"
                        onClick={() => onMemberUpdate(slug || "", "left")}
                        className="flex-1 sm:flex-none"
                      >
                        <DoorOpen className="h-4 w-4" />
                        Leave
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
                     
                      <span className="text-sm font-semibold text-green-700 dark:text-green-300 capitalize">
                        {communityMember?.member?.role} Since {communityMember?.member?.createdAt ? new Date(communityMember.member.createdAt).getFullYear() : '2025'}
                      </span>
                     
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => onMemberUpdate(slug || "", "active")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                >
                  <UserPlus className="h-4 w-4" />
                  Join Community
                </button>
              )
            ) : (
              <div className="flex justify-center py-4">
                <InlineLoader />
              </div>
            )}
          </div>
        </div>

        {/* Expandable Content */}
        {isViewMore && (
          <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            {/* Topics Section */}
            {Array.isArray(communityMember?.topics) &&
              communityMember.topics.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                    Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {communityMember.topics.map((topic) => (
                      <span
                        key={topic?._id?.toString()}
                        className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border border-indigo-200 dark:border-indigo-700 rounded-full text-xs font-medium text-indigo-700 dark:text-indigo-300 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
                      >
                        {(topic as { name?: string })?.name || "Unnamed Topic"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            
            {/* Guidelines Section */}
            {communityMember?.guidelines && communityMember.guidelines.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-xl shadow-sm">
                    <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      Community Guidelines
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Rules to keep our community respectful
                    </p>
                  </div>
                </div>

                <ul className="space-y-3">
                  {communityMember.guidelines.map((guideline, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400 mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {guideline}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {showCreateDiscussion && (
        <CreateDiscussionForm
          setShowCreateDiscussion={setShowCreateDiscussion}
          onClose={() => {
            setShowCreateDiscussion(false);
          }}
          communityId={communityMember?._id?.toString() || ""}
        />
      )}
    </>
  );
}
