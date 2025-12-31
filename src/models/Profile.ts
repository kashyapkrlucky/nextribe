import mongoose, { model, Schema } from "mongoose";
import { ProfileModel } from "@/core/types/database.types";

const profileSchema = new Schema<ProfileModel>(
  {
    username: {
      type: String,
      unique: true,
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      maxlength: [100, "Location cannot exceed 100 characters"],
      trim: true,
    },
    city: {
      type: String,
      maxlength: [50, "City cannot exceed 50 characters"],
      trim: true,
    },
    country: {
      type: String,
      maxlength: [50, "Country cannot exceed 50 characters"],
      trim: true,
    },
    dob: {
      type: Date,
      validate: {
        validator: function (v: Date) {
          return !v || v < new Date();
        },
        message: "Date of birth must be in the past",
      },
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    urlWebsite: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/.+\..+/i.test(v);
        },
        message: "Website must be a valid URL",
      },
      trim: true,
    },
    urlTwitter: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/(www\.)?twitter\.com\/.+/i.test(v);
        },
        message: "Twitter link must be a valid Twitter URL",
      },
    },
    urlLinkedIn: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(v);
        },
        message: "LinkedIn link must be a valid LinkedIn URL",
      },
    },
    urlGithub: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/(www\.)?github\.com\/.+/i.test(v);
        },
        message: "GitHub link must be a valid GitHub URL",
      },
    },
    urlInstagram: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(v);
        },
        message: "Instagram link must be a valid Instagram URL",
      },
    },
    urlDribbble: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^https?:\/\/(www\.)?dribbble\.com\/.+/i.test(v);
        },
        message: "Dribbble link must be a valid Dribbble URL",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Static method to find public profiles
profileSchema.statics.findPublic = function (limit = 10, skip = 0) {
  return this.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate("userId", "email");
};

// Static method to search profiles
profileSchema.statics.searchProfiles = function (query: string, limit = 10) {
  return this.find(
    {
      $text: { $search: query },
      isPublic: true,
    },
    { score: { $meta: "textScore" } }
  )
    .sort({ score: { $meta: "textScore" } })
    .limit(limit);
};

export const Profile = mongoose.models.Profile || model<ProfileModel>("Profile", profileSchema);
