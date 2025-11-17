import mongoose, { Schema, models, Model, Types } from "mongoose";

export interface IDiscussion {
  title: string;
  slug: string;
  body: string;
  author: Types.ObjectId; // ref: User
  community: Types.ObjectId; // ref: Community
  isLocked?: boolean;
  commentCount?: number;
  lastActivityAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const DiscussionSchema = new Schema<IDiscussion>(
  {
    title: { type: String, required: true, trim: true, maxlength: 180 },
    slug: { type: String, required: true, lowercase: true, trim: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    community: { type: Schema.Types.ObjectId, ref: "Community", required: true, index: true },
    isLocked: { type: Boolean, default: false },
    commentCount: { type: Number, default: 0 },
    lastActivityAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

// Unique per community slug to allow clean URLs like /community/:slug/discussion/:slug
DiscussionSchema.index({ community: 1, slug: 1 }, { unique: true });
// Sort by recent activity within a community
DiscussionSchema.index({ community: 1, lastActivityAt: -1 });

export const Discussion: Model<IDiscussion> =
  models.Discussion || mongoose.model<IDiscussion>("Discussion", DiscussionSchema);
