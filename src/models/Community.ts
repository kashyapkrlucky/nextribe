import mongoose, { Schema, models, Model } from "mongoose";
import { ICommunity } from "@/core/types/index.types";

/**
 * Mongoose schema for the Community model
 * Defines the structure and validation rules for communities in the database
 */
const CommunitySchema = new Schema<ICommunity>(
  {
    name: { 
      type: String, 
      required: [true, 'Community name is required'],
      trim: true, 
      maxlength: [140, 'Name cannot be longer than 140 characters'] 
    },
    slug: { 
      type: String, 
      required: [true, 'Slug is required'],
      unique: true, 
      lowercase: true, 
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
    },
    description: { 
      type: String, 
      trim: true, 
      maxlength: [2000, 'Description cannot be longer than 2000 characters'] 
    },
    owner: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: [true, 'Community owner is required'],
      index: true 
    },
    isPrivate: { 
      type: Boolean, 
      default: false,
      index: true 
    },
    topics: [{ 
      type: Schema.Types.ObjectId, 
      ref: "Topic", 
      index: true 
    }],
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for text search on community name and description
CommunitySchema.index({ 
  name: 'text',
  description: 'text'
}, {
  weights: {
    name: 3,      // Higher weight to name
    description: 1
  }
});

/**
 * Virtual for memberCount
 * This is a virtual field that will be populated with the actual count of community members
 */
CommunitySchema.virtual('memberCount', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'community',
  count: true
});

/**
 * Middleware to handle cleanup when a community is deleted
 */
CommunitySchema.pre('deleteOne', { document: true }, async function(next: (err?: Error) => void) {
  // This middleware will be used to clean up related documents
  // when a community is deleted
  next();
});

/**
 * Mongoose model for the Community collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const Community: Model<ICommunity> =
  models.Community || mongoose.model<ICommunity>("Community", CommunitySchema);
