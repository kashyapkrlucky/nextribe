import mongoose, { Model, models, Schema } from "mongoose";
import { ActivityModel } from "@/core/types/database.types";

const ActivitySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, required: true },
    payload: { type: Schema.Types.Mixed },
});

export const Activity: Model<ActivityModel> =
  models.Activity || mongoose.model<ActivityModel>("Activity", ActivitySchema);
