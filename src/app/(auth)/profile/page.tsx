import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User } from "lucide-react";

export default async function ProfilePage() {
  const { user, isAuthenticated } = await getCurrentUser();
  
  if (!isAuthenticated || !user) {
    redirect("/sign-in");
  }

  return ( 
      <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 relative">
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
              <h1 className="text-2xl font-bold text-gray-900">
                {user.name || 'Anonymous User'}
              </h1>
              <p className="text-gray-600">@{user.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</p>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Edit Profile
            </button>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 mb-6">
              {user?.bio || 'No bio available. Add a bio to tell others about yourself.'}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{user.email || 'Not provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Activity</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-500">Discussions</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-500">Replies</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">3</p>
                <p className="text-sm text-gray-500">Communities</p>
              </div>
            </div>
          </div>
        </div>
      </div>
   
  );
}
