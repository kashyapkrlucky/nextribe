import mongoose, { Schema, models, Model, Types } from "mongoose";

export interface ITopic {
  name: string;
  slug: string;
  description?: string;
  community: Types.ObjectId; // ref: Community
  createdBy: Types.ObjectId; // ref: User
  isArchived?: boolean;
  discussionCount?: number;
  order?: number; // for manual ordering/pinning within community
  createdAt?: Date;
  updatedAt?: Date;
}

const TopicSchema = new Schema<ITopic>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
    community: { type: Schema.Types.ObjectId, ref: "Community", required: true, index: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isArchived: { type: Boolean, default: false, index: true },
    discussionCount: { type: Number, default: 0 },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

// Unique topic slug within a community
TopicSchema.index({ community: 1, slug: 1 }, { unique: true });
// Retrieve topics ordered within a community
TopicSchema.index({ community: 1, order: 1 });

export const Topic: Model<ITopic> =
  models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);
