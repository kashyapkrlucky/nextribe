import mongoose, { Schema, models, Model } from "mongoose";
import { ITopic } from "@/core/types/index.types";


const TopicSchema = new Schema<ITopic>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 1000 },
    isArchived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Unique topic slug
TopicSchema.index({ slug: 1 }, { unique: true });

// Export both the model and schema
export const Topic: Model<ITopic> =
  models.Topic || mongoose.model<ITopic>("Topic", TopicSchema);

export const TopicSchemaInstance = TopicSchema;
