"use client";
import { User, MapPin, Calendar, ImageIcon, UserIcon } from "lucide-react";
import ProfileTabs from "@/components/profile/ProfileTabs";
import SocialLinks from "@/components/profile/SocialLinks";
import { useDiscussionStore } from "@/store/useDiscussionStore";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { formatRelativeTime } from "@/core/utils/helpers";
import EditProfileForm from "@/components/profile/EditProfileForm";
import { useParams } from "next/navigation";
import Image from "next/image";
import PageLoader from "@/components/ui/PageLoader";
import ImageUploader from "@/components/profile/ImageUploader";

export default function ProfilePage() {
  const { isLoading, profile, getProfile, error, updateAvatar, updateCover } =
    useUserStore();
  const { username } = useParams();
  const {
    isLoading: discussionsLoading,
    userDiscussions,
    fetchDiscussionByUser,
  } = useDiscussionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isOwner =
    JSON.parse(localStorage.getItem("user") || "{}").username ===
    profile?.username;

  useEffect(() => {
    getProfile(username as string);
    fetchDiscussionByUser(username as string);
  }, [username, getProfile, fetchDiscussionByUser]);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto h-screen flex flex-col items-center justify-center">
        <UserIcon className="h-16 w-16 text-gray-900 dark:text-gray-200" />
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">
          {error}
        </p>
      </div>
    );
  }

  if (isLoading || discussionsLoading) {
    return <PageLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto h-screen w-full bg-white dark:bg-gray-800 overflow-y-auto">
      {/* Enhanced Profile Header with Cover */}
      <div className="relative">
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-96 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative rounded-t-lg overflow-hidden">
            {profile?.cover ? (
              <Image
                src={profile?.cover}
                alt="Cover"
                width={908}
                height={400}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 bg-black/20">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            )}

            {/* Cover Photo Actions */}
            {isOwner && profile?.username && (
              <div className="absolute bottom-4 right-4 flex gap-2 bg-white/20 rounded-lg text-white transition-colors">
                <ImageUploader
                  icon={<ImageIcon className="absolute top-3 left-3 cursor-pointer" />}
                  username={profile?.username}
                  type="cover"
                  afterUpload={updateCover}
                />
              </div>
            )}
          </div>
        </div>
        {/* Avatar Section */}
        <div className="absolute -bottom-16 left-6">
          <div className="relative">
            <div className="h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-xl">
              {profile?.user?.avatar ? (
                <Image
                  src={profile?.user?.avatar}
                  alt="Profile"
                  width={128}
                  height={128}
                />
              ) : (
                <User className="h-16 w-16 text-white" />
              )}
            </div>
            {/* Online Status Indicator */}
            {/* <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 border-2 border-white rounded-full"></div> */}
            {/* Avatar Actions */}
            {isOwner && profile?.username && (
              <div className="absolute bottom-0 right-0 flex gap-2 bg-indigo-600 rounded-full text-white transition-colors">
                <ImageUploader
                  username={profile?.username}
                  type="avatar"
                  afterUpload={updateAvatar}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Profile Content */}
      <div className="pt-20 px-6 pb-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                {profile?.name || "Anonymous User"}
              </h1>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                  Pro Member
                </span>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  Active
                </span>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">
              @{profile?.username}
            </p>

            {/* Bio and Location */}
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                {profile?.bio}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                {(profile?.country || profile?.city) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile?.country} {profile?.city}
                  </span>
                )}
                {profile?.createdAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined{" "}
                    {profile?.createdAt
                      ? formatRelativeTime(profile.createdAt)
                      : "N/A"}
                  </span>
                )}
              </div>
            </div>

            {/* Social Links */}
            {profile && <SocialLinks profile={profile} />}
          </div>

          {/* Action Buttons */}
          {isOwner && (
            <div className="flex gap-3">
              <button
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                onClick={() => setIsModalOpen(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Profile Stats */}
        {/* <ProfileStats discussions={discussionList} /> */}

        {/* Achievement Badges */}
        {/* <AchievementBadges /> */}

        {/* Tabs for Posts and Activity */}
        <ProfileTabs discussions={userDiscussions} />

        {/* Edit Profile Modal */}
        {isModalOpen && <EditProfileForm setIsModalOpen={setIsModalOpen} />}
      </div>
    </div>
  );
}
