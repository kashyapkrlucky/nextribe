import {
  Calendar,
  GlobeIcon,
  Phone,
  SaveIcon,
  UserCircleIcon,
  XIcon,
} from "lucide-react";
import InlineLoader from "@/components/ui/InlineLoader";
import { useUserStore } from "@/store/useUserStore";
import { IProfile } from "@/core/types/index.types";
import { useState } from "react";

export default function EditProfileForm({
  setIsModalOpen,
}: {
  setIsModalOpen: (open: boolean) => void;
}) {
  const { isLoading, profile, updateProfile } = useUserStore();

  const [formData, setFormData] = useState<IProfile | null>(profile || null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (prev) {
        return { ...prev, [name]: value };
      }
      if (profile) {
        return { ...profile, [name]: value };
      }
      return null;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newChanges: Partial<IProfile> = {};

    if (formData && profile) {
      for (const key in formData) {
        if (key in formData) {
          const profileValue = profile[key as keyof IProfile];
          const formDataValue = formData[key as keyof IProfile];
          if (formDataValue && !profileValue) {
            (newChanges as Record<string, unknown>)[key] = formDataValue;
          } else if (formDataValue && profileValue) {
            if (formDataValue !== profileValue) {
              (newChanges as Record<string, unknown>)[key] = formDataValue;
            }
          }
        }
      }
    } else {
      newChanges = formData || {};
    }
    updateProfile(newChanges);
    setIsModalOpen(false);
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="h-full flex flex-col gap-4 bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Edit Personal Information
            </h2>
            <p className="text-gray-600 text-xs">
              Update your personal details and social profiles
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XIcon />
          </button>
        </div>

        {/* Modal Body - Form Fields */}
        <div className="flex-1 px-6 space-y-6 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <UserCircleIcon className="h-5 w-5 mr-2 text-purple-600" />
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData?.name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="phone"
                    value={formData?.phone || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="dob"
                    value={
                      formData?.dob
                        ? new Date(formData.dob)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData?.city || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="New York"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <div className="relative">
                  <GlobeIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="country"
                    value={formData?.country || ""}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="United States"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Bio
                </label>
                <textarea
                  name="bio"
                  value={formData?.bio || ""}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Tell us about yourself, your experience, and what you're passionate about..."
                />
              </div>
            </div>
          </div>

          {/* Social Profiles Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <GlobeIcon className="h-5 w-5 mr-2 text-purple-600" />
              Social Profiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Personal Website
                </label>
                <input
                  type="text"
                  name="urlWebsite"
                  value={formData?.urlWebsite || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  name="urlLinkedIn"
                  value={formData?.urlLinkedIn || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GitHub Profile
                </label>
                <input
                  type="text"
                  name="urlGithub"
                  value={formData?.urlGithub || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Profile
                </label>
                <input
                  type="text"
                  name="urlInstagram"
                  value={formData?.urlInstagram || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://instagram.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter Profile
                </label>
                <input
                  type="text"
                  name="urlTwitter"
                  value={formData?.urlTwitter || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://twitter.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dribbble Profile
                </label>
                <input
                  type="text"
                  name="urlDribbble"
                  value={formData?.urlDribbble || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://dribbble.com/yourusername"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md"
          >
            {isLoading ? <InlineLoader /> : <SaveIcon className="h-4 w-4" />}
            <span className="text-sm">Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
