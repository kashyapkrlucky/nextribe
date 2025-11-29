import mongoose, { Schema, models, Model } from "mongoose";
import { ITopic } from "@/core/types/index.types";


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

// Export both the model and schema
export const Topic: Model<ITopic> =
  models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);

export const TopicSchemaInstance = TopicSchema;
