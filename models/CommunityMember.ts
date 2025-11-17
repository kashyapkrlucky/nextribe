import mongoose, { Schema, models, Model, Types } from "mongoose";

export type CommunityMemberRole = "owner" | "admin" | "member";

export interface ICommunityMember {
  community: Types.ObjectId; // ref: Community
  user: Types.ObjectId; // ref: User
  role: CommunityMemberRole;
  createdAt?: Date;
  updatedAt?: Date;
}

const CommunityMemberSchema = new Schema<ICommunityMember>(
  {
    community: { type: Schema.Types.ObjectId, ref: "Community", required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["owner", "admin", "member"], default: "member", index: true },
  },
  { timestamps: true }
);

// Ensure a user is not duplicated within the same community
CommunityMemberSchema.index({ community: 1, user: 1 }, { unique: true });
// Helpful secondary index for listing members by community by recency
CommunityMemberSchema.index({ community: 1, createdAt: -1 });

export const CommunityMember: Model<ICommunityMember> =
  models.CommunityMember || mongoose.model<ICommunityMember>("CommunityMember", CommunityMemberSchema);
