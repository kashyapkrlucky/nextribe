"use client"
import { User, MapPin, Link2, Calendar } from "lucide-react";
import ProfileTabs from "@/components/profile/ProfileTabs";
import ProfileStats from "@/components/profile/ProfileStats";
import SocialLinks from "@/components/profile/SocialLinks";
import AchievementBadges from "@/components/profile/AchievementBadges";
import SkillsTags from "@/components/profile/SkillsTags";
import { useDiscussionStore } from "@/store/useDiscussionStore";

export default function ProfilePage() {
  const user = {
    name: "Kashyap Lucky",
    bio: "Passionate developer and community builder. Love sharing knowledge and helping others grow in their tech journey.",
    createdAt: new Date(),
    
  }
  const { discussionList } = useDiscussionStore();


  return ( 
      <div className="w-full bg-white dark:bg-gray-800">
        {/* Enhanced Profile Header with Cover */}
        <div className="relative">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
            <div className="absolute inset-0 bg-black/20">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            {/* Cover Photo Actions */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Avatar Section */}
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center shadow-xl">
                <User className="h-16 w-16 text-white" />
              </div>
              {/* Online Status Indicator */}
              <div className="absolute bottom-2 right-2 h-6 w-6 bg-green-500 border-2 border-white rounded-full"></div>
              {/* Avatar Actions */}
              <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors shadow-lg">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Profile Content */}
        <div className="pt-20 px-6 pb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                  {user.name || 'Anonymous User'}
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
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-3">@{user.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</p>
              
              {/* Bio and Location */}
              <div className="mb-4">
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  {user?.bio || 'Passionate developer and community builder. Love sharing knowledge and helping others grow in their tech journey.'}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    San Francisco, CA
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {user.createdAt ? user.createdAt.toDateString() : 'N/A'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Link2 className="h-4 w-4" />
                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">kashyap.dev</a>
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <SocialLinks />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                Edit Profile
              </button>
              <button className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Share Profile
              </button>
            </div>
          </div>

          {/* Profile Stats */}
          <ProfileStats discussions={discussionList} />
          
          {/* Achievement Badges */}
          <AchievementBadges />
          
          {/* Skills Tags */}
          <SkillsTags />

          {/* Tabs for Posts and Activity */}
          <ProfileTabs discussions={discussionList} />
        </div>
      </div>
   
  );
}
