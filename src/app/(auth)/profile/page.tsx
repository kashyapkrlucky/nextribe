import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const { user, isAuthenticated } = await getCurrentUser();
  
  if (!isAuthenticated || !user) {
    redirect("/sign-in");
  }

  return ( 
      <div className="w-full bg-white dark:bg-gray-800 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-indigo-600 h-32 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-16 px-6 pb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
                {user.name || 'Anonymous User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-200">@{user.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              Edit Profile
            </button>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">About</h2>
            <p className="text-gray-600 dark:text-gray-200 mb-6">
              {user?.bio || 'No bio available. Add a bio to tell others about yourself.'}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-200">Email</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-200">Member Since</h3>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-200">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">Activity</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">24</p>
                <p className="text-sm text-gray-500 dark:text-gray-200">Discussions</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">156</p>
                <p className="text-sm text-gray-500 dark:text-gray-200">Replies</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-200">3</p>
                <p className="text-sm text-gray-500 dark:text-gray-200">Communities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
}
