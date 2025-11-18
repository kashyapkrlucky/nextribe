import mongoose, { Schema, models, Model, Types } from "mongoose";

export interface ICommunity {
  name: string;
  slug: string;
  description?: string;
  owner: Types.ObjectId; // ref: User
  isPrivate?: boolean;
  topics?: Types.ObjectId[]; // ref: Topic[]
  createdAt?: Date;
  updatedAt?: Date;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    name: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isPrivate: { type: Boolean, default: false },
    topics: [{ type: Schema.Types.ObjectId, ref: "Topic", index: true }],
  },
  { timestamps: true }
);

export const Community: Model<ICommunity> =
  models.Community || mongoose.model<ICommunity>("Community", CommunitySchema);
