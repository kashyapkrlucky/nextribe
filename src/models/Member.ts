import mongoose, { Schema, models, Model } from "mongoose";
import { IMember } from "@/core/types/index.types";

const MemberSchema = new Schema<IMember>(
  {
    community: { type: Schema.Types.ObjectId, ref: "Community", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["owner", "admin", "member"], default: "member", index: true },
  },
  { timestamps: true }
);

// Ensure a user is not duplicated within the same community
MemberSchema.index({ community: 1, user: 1 }, { unique: true });
// Helpful secondary index for listing members by community by recency
MemberSchema.index({ community: 1, createdAt: -1 });

export const Member: Model<IMember> =
  models.Member || mongoose.model<IMember>("Member", MemberSchema);
