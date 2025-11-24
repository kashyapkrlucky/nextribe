import mongoose, { Schema, models, Model } from "mongoose";
import { IReply } from "@/types/index.types";

const ReplySchema = new Schema<IReply>(
  {
    discussion: {
      type: Schema.Types.ObjectId,
      ref: "Discussion",
      required: true,
      index: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    body: { type: String, required: true },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Reply",
      default: null,
      index: true,
    },
    tag: {
      type: String,
      enum: ["answer", "tip", "question"],
      default: "answer",
    },
    isDeleted: { type: Boolean, default: false, index: true },
    upVoteCount: { type: Number, default: 0 },
    upVotes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    downVoteCount: { type: Number, default: 0 },
    downVotes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  },
  { timestamps: true }
);

// Efficiently list replies in a discussion by recent activity
ReplySchema.index({ discussion: 1, createdAt: 1 });
// Efficiently list children of a given reply
ReplySchema.index({ parent: 1, createdAt: 1 });

export const Reply: Model<IReply> =
  models.Reply || mongoose.model<IReply>("Reply", ReplySchema);
