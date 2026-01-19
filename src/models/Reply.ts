import mongoose, { Schema, models, Model, Document } from "mongoose";
import "./User";
import "./Discussion";
import { ReplyModel } from "@/core/types/database.types";

/**
 * Mongoose schema for the Reply model
 * Defines the structure and validation rules for replies to discussions in the database
 */
const ReplySchema = new Schema<ReplyModel & Document>(
  {
    discussion: {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
      required: [true, "Discussion reference is required"],
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
      index: true,
    },
    body: {
      type: String,
      required: [true, "Reply content is required"],
      minlength: [1, "Reply cannot be empty"],
      maxlength: [10000, "Reply cannot be longer than 10,000 characters"],
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
      index: true,
    },
    tag: {
      type: String,
      enum: {
        values: ["answer", "tip", "question"],
        message: 'Tag must be either "answer", "tip", or "question"',
      },
      default: "answer",
    },
    isDeleted: {
      type: Boolean,
      default: false,
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
    toObject: { virtuals: true },
  }
);

/**
 * Indexes for efficient querying
 */
// For listing replies in a discussion by creation date
ReplySchema.index({ discussion: 1, createdAt: 1 });

// For listing nested replies under a parent
ReplySchema.index({ parent: 1, createdAt: 1 });

// For text search within replies
ReplySchema.index(
  { body: "text" },
  {
    weights: {
      body: 1,
    },
    name: "reply_text_search",
  }
);

/**
 * Mongoose model for the Reply collection
 * Uses existing model if it exists, otherwise creates a new one
 */

export const Reply: Model<ReplyModel & Document> =
  models.Reply ||
  mongoose.model<ReplyModel & Document>("Reply", ReplySchema);