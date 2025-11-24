import mongoose, { Schema, models, Model, Document, Types } from "mongoose";
import { IReply } from "@/types/index.types";

// Import related models to ensure population works correctly
import "./User";
import "./Discussion";

// Interface for the Reply document (instance methods)
interface IReplyDocument extends IReply, Document {
  url: string;
  replies: Types.Array<IReplyDocument>;
  upvote(userId: string): Promise<IReplyDocument>;
  downvote(userId: string): Promise<IReplyDocument>;
}

// Interface for the Reply model (static methods)
interface IReplyModel extends Model<IReplyDocument> {
  findByDiscussion(
    discussionId: string,
    options?: {
      page?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
      parentId?: string | null;
    }
  ): Promise<IReplyDocument[]>;
}

// Interface for the transformed reply (used in toJSON)
interface ITransformedReply extends Omit<IReply, "upVotes" | "downVotes"> {
  _id: Types.ObjectId;
  id: string;
  url: string;
  replies: ITransformedReply[];
}

/**
 * Mongoose schema for the Reply model
 * Defines the structure and validation rules for replies to discussions in the database
 */
const ReplySchema = new Schema<IReplyDocument, IReplyModel>(
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
    upVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    downVoteCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    downVotes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (
        doc: IReplyDocument,
        ret: IReply & { _id: Types.ObjectId; __v: number }
      ) => {
        // Create a new object without the votes to prevent data leakage
        const { upVotes, downVotes, __v, ...result } = ret;
        return result as ITransformedReply;
      },
    },
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
 * Middleware to handle cleanup when a reply is deleted
 */
ReplySchema.pre(
  "deleteOne",
  { document: true },
  async function (next: (err?: Error) => void) {
    // This middleware will be used to clean up related documents
    // when a reply is deleted (e.g., its child replies, votes, etc.)
    next();
  }
);

/**
 * Instance method to upvote a reply
 */
ReplySchema.methods.upvote = async function (userId: string) {
  // Remove from downvotes if user previously downvoted
  const downvoteIndex = this.downVotes.indexOf(userId);
  if (downvoteIndex > -1) {
    this.downVotes.splice(downvoteIndex, 1);
    this.downVoteCount = Math.max(0, this.downVoteCount - 1);
  }

  // Add to upvotes if not already upvoted
  if (!this.upVotes.includes(userId)) {
    this.upVotes.push(userId);
    this.upVoteCount += 1;
  }

  return this.save();
};

/**
 * Instance method to downvote a reply
 */
ReplySchema.methods.downvote = async function (userId: string) {
  // Remove from upvotes if user previously upvoted
  const upvoteIndex = this.upVotes.indexOf(userId);
  if (upvoteIndex > -1) {
    this.upVotes.splice(upvoteIndex, 1);
    this.upVoteCount = Math.max(0, this.upVoteCount - 1);
  }

  // Add to downvotes if not already downvoted
  if (!this.downVotes.includes(userId)) {
    this.downVotes.push(userId);
    this.downVoteCount += 1;
  }

  return this.save();
};

/**
 * Static method to find replies for a discussion with pagination
 */
ReplySchema.statics.findByDiscussion = function (
  discussionId: string,
  options: {
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
    parentId?: string | null;
  } = {}
) {
  const {
    page = 1,
    limit = 20,
    sort = { createdAt: 1 },
    parentId = null,
  } = options;

  const query: {
    discussion: Types.ObjectId;
    isDeleted: boolean;
    parent: Types.ObjectId | null;
  } = {
    discussion: new Types.ObjectId(discussionId),
    isDeleted: false,
    parent: parentId ? new Types.ObjectId(parentId) : null,
  } as const;

  return this.find(query)
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate("author", "name email")
    .populate({
      path: "replies",
      match: { isDeleted: false },
      options: { sort: { createdAt: 1 }, limit: 5 },
      populate: {
        path: "author",
        select: "name email",
      },
    });
};

/**
 * Mongoose model for the Reply collection
 * Uses existing model if it exists, otherwise creates a new one
 */
export const Reply: IReplyModel =
  (models.Reply as IReplyModel) ||
  mongoose.model<IReplyDocument, IReplyModel>("Reply", ReplySchema);
