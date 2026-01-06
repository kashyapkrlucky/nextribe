import mongoose, { Schema, models, Model, Document } from "mongoose";

// Import related models to ensure population works correctly
import "./User";
import "./Community";
import { DiscussionModel } from "@/core/types/database.types";

/**
 * Mongoose schema for the Discussion model
 * Defines the structure and validation rules for discussion threads in the database
 */
const DiscussionSchema = new Schema<DiscussionModel & Document>(
  {
    title: {
      type: String,
      required: [true, "Discussion title is required"],
      trim: true,
      maxlength: [180, "Title cannot be longer than 180 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens",
      ],
    },
    body: {
      type: String,
      required: [true, "Discussion content is required"],
      minlength: [10, "Discussion content must be at least 10 characters long"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: [true, "Community is required"],
      index: true,
    },
    isLocked: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    replyCount: {
      type: Number,
      default: 0,
      min: 0,
      index: true,
    },
    upVoteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    downVoteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Indexes for efficient querying
 */
// Unique per community slug for clean URLs like /community/:slug/discussion/:slug
DiscussionSchema.index({ community: 1, slug: 1 }, { unique: true });

// For sorting discussions by recent activity within a community
DiscussionSchema.index({ community: 1, lastActivityAt: -1 });

// For text search on discussion titles and bodies
DiscussionSchema.index(
  { title: "text", body: "text" },
  {
    weights: {
      title: 3, // Higher weight to title
      body: 1,
    },
    name: "discussion_text_search",
  }
);

/**
 * Virtual for discussion URL
 */
DiscussionSchema.virtual("url").get(function () {
  return `/communities/${this.community.slug}/discussions/${this.slug}`;
});

/**
 * Virtual for populating replies to this discussion
 */
DiscussionSchema.virtual("replies", {
  ref: "Reply",
  localField: "_id",
  foreignField: "discussion",
});

/**
 * Middleware to handle cleanup when a discussion is deleted
 */
DiscussionSchema.pre(
  "deleteOne",
  { document: true },
  async function (next: (err?: Error) => void) {
    // This middleware will be used to clean up related documents
    // when a discussion is deleted (e.g., its replies)
    next();
  }
);

/**
 * Static method to find discussions by community
 */
DiscussionSchema.statics.findByCommunity = function (
  communityId: string,
  options: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  } = {}
) {
  const { page = 1, limit = 20, sort = { lastActivityAt: -1 } } = options;

  return this.find({ community: communityId })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "name email")
    .populate("community", "name slug");
};

/**
 * Instance method to update the last activity timestamp
 */
DiscussionSchema.methods.updateLastActivity = function () {
  this.lastActivityAt = new Date();
  return this.save();
};

/**
 * Mongoose model for the Discussion collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const Discussion: Model<DiscussionModel & Document> =
  models.Discussion ||
  mongoose.model<DiscussionModel & Document>("Discussion", DiscussionSchema);
