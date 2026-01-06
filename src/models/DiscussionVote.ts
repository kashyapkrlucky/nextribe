import mongoose, { Schema, models, Model, Document } from "mongoose";

// Import related models to ensure population works correctly
import "./User";
import "./Community";
import { DiscussionVoteModel } from "@/core/types/database.types";

/**
 * Mongoose schema for the Discussion model
 * Defines the structure and validation rules for discussion threads in the database
 */
const DiscussionVoteSchema = new Schema<DiscussionVoteModel & Document>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },
    discussion: {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
      required: [true, "Discussion is required"],
      index: true,
    },
    vote: {
      type: String,
      enum: ["up", "down"],
      required: [true, "Vote is required"],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Mongoose model for the Discussion collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const DiscussionVote: Model<DiscussionVoteModel & Document> =
  models.DiscussionVote ||
  mongoose.model<DiscussionVoteModel & Document>("DiscussionVote", DiscussionVoteSchema);
