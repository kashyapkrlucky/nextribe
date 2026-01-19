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
    <>  
      {/* Cover Photo */}
      <div className="fixed top-16 z-0 w-full h-full overflow-y-auto">
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
            <div className="absolute inset-0 bg-gradient-to-t bg-purple-300 from-black/30 to-transparent"></div>
          </div>
        )}

        {/* Cover Photo Actions */}
        {isOwner && profile?.username && (
          <div className="absolute top-4 right-4 flex gap-2 bg-white/20 rounded-lg text-white transition-colors">
            <ImageUploader
              icon={
                <ImageIcon className="absolute top-3 left-3 cursor-pointer" />
              }
              username={profile?.username}
              type="cover"
              afterUpload={updateCover}
            />
          </div>
        )}
      </div>

      <div className="relative z-10 top-20 overflow-y-auto scroll-smooth h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-t-lg">
          {/* Enhanced Profile Content */}
          <div className="pt-10 px-6 pb-6">
            {/* Profile Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
                {/* Enhanced Profile Header with Cover */}

                {/* Avatar Section */}
                <div className="relative w-32">
                  <div className="h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-sm">
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

                <div className="flex-1 flex flex-col gap-4">
                  {/* Name and Badges */}
                  <div className="flex items-center flex-wrap gap-3">
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                      {profile?.name || "Anonymous User"}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                        Pro Member
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-medium flex items-center gap-1">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        Active
                      </span>
                    </div>
                  </div>

                  {/* Username */}
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    @{profile?.username}
                  </p>

                  {/* Location and Join Date */}
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    {(profile?.country || profile?.city) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {profile?.country} {profile?.city}
                        </span>
                      </div>
                    )}
                    {profile?.createdAt && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Joined {formatRelativeTime(profile.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bio Section */}
                  <div className="mb-6">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        About
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {profile?.bio || "No bio provided yet"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {isOwner && (
                    <button
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-200"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            {profile && (
              <div className="mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                    Connect
                  </h3>
                  <SocialLinks profile={profile} />
                </div>
              </div>
            )}

            {/* Tabs Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl  overflow-hidden">
              <ProfileTabs discussions={userDiscussions} />
            </div>

            {/* Edit Profile Modal */}
            {isModalOpen && <EditProfileForm setIsModalOpen={setIsModalOpen} />}
          </div>
        </div>
      </div>
     </>
  );
}
