import mongoose, { Schema, models, Model } from "mongoose";
import { ICommunity } from "@/types/index.types";


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
