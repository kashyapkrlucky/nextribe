import mongoose, { Schema, models, Model, Document } from "mongoose";

// Import related models to ensure population works correctly
import "./User";
import "./Community";
import { ReplyVoteModel } from "@/core/types/database.types";

/**
 * Mongoose schema for the Reply model
 * Defines the structure and validation rules for Reply threads in the database
 */
const ReplyVoteSchema = new Schema<ReplyVoteModel & Document>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },
    reply: {
      type: Schema.Types.ObjectId,
      ref: "Reply",
      required: [true, "Reply is required"],
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
 * Mongoose model for the Reply collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const ReplyVote: Model<ReplyVoteModel & Document> =
  models.ReplyVote ||
  mongoose.model<ReplyVoteModel & Document>("ReplyVote", ReplyVoteSchema);
