import { Types } from "mongoose";

/**
 * Represents the possible roles a member can have in a community
 */
export type MemberRole = "owner" | "admin" | "member";

/**
 * Represents a user in the system
 */
export interface UserModel {
  /** User's full name */
  name: string;
  /** User's username (must be unique) */
  username: string;
  /** User's email address (must be unique) */
  email: string;
  /** Password (not returned in API responses) */
  password?: string;
  /** Short biography or description */
  avatar?: string;
  /** Password reset token and expiration */
  passwordReset?: {
    token?: string;
    expiresAt?: Date;
    usedAt?: Date;
  };
  /** Creates a password reset token and returns the raw token */
  createPasswordResetToken(): string;
  /** Compares a candidate password with the stored hash */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ProfileModel {
  user: Types.ObjectId;
  username: string;
  name?: string;
  bio?: string;
  dob?: Date;
  phone?: string;
  city?: string;
  country?: string;
  isPublic?: boolean;
  urlWebsite?: string;
  urlLinkedIn?: string;
  urlTwitter?: string;
  urlGithub?: string;
  urlInstagram?: string;
  urlDribbble?: string;
}

/**
 * Represents a community where users can interact and discuss topics
 */
export interface CommunityModel {
  /** Unique identifier for the community */
  _id: Types.ObjectId;
  /** Display name of the community */
  name: string;
  /** URL-friendly version of the name for routing */
  slug: string;
  /** Detailed description of the community */
  description?: string;
  /** Reference to the user who owns the community */
  owner: Types.ObjectId; // ref: User
  /** Whether the community is private (requires approval to join) */
  isPrivate?: boolean;
  /** List of topics associated with this community */
  topics?: Types.ObjectId[]; // ref: Topic[]
  /** When the community was created */
  createdAt?: Date;
  /** When the community was last updated */
  updatedAt?: Date;
  /** Number of members in the community */
  memberCount?: number;
}

/**
 * Represents the relationship between a user and a community
 */
export interface MemberModel {
  /** Reference to the community */
  community: Types.ObjectId; // ref: Community
  /** Reference to the user who is a member */
  user: Types.ObjectId; // ref: User
  /** The user's role within the community */
  role: MemberRole;
  /** When the user joined the community */
  createdAt?: Date;
  /** When the membership was last updated */
  updatedAt?: Date;
}

/**
 * Represents a discussion thread within a community
 */
export interface DiscussionModel {
  /** Unique identifier for the discussion */
  _id: Types.ObjectId;
  /** Title of the discussion */
  title: string;
  /** URL-friendly version of the title */
  slug: string;
  /** Main content of the discussion */
  body: string;
  /** Author of the discussion */
  author: UserModel;
  /** Community this discussion belongs to */
  community: CommunityModel;
  /** Whether the discussion is locked (no new replies) */
  isLocked?: boolean;
  /** Number of comments in the discussion */
  commentCount?: number;
  /** When the discussion was last active */
  lastActivityAt?: Date;
  /** When the discussion was created */
  createdAt?: Date;
  /** When the discussion was last updated */
  updatedAt?: Date;
  /** Number of replies to the discussion */
  replyCount?: number;
}

/**
 * Represents a reply to a discussion or another reply
 */
export interface ReplyModel {
  /** Unique identifier for the reply */
  _id: Types.ObjectId;
  /** Reference to the parent discussion */
  discussion: Types.ObjectId; // ref: Discussion
  /** Author of the reply */
  author: UserModel; // ref: User
  /** Content of the reply */
  body: string;
  /** Reference to the parent reply if this is a nested reply */
  parent?: Types.ObjectId | null; // ref: Reply
  /** Soft delete flag */
  isDeleted?: boolean;
  /** Type of reply */
  tag: "answer" | "tip" | "question";
  /** Number of upvotes */
  upVoteCount: number;
  /** Number of downvotes */
  downVoteCount: number;
  /** Users who upvoted this reply */
  upVotes: Types.ObjectId[]; // ref: User[]
  /** Users who downvoted this reply */
  downVotes: Types.ObjectId[]; // ref: User[]
  /** When the reply was created */
  createdAt: Date;
  /** When the reply was last updated */
  updatedAt: Date;
}

/**
 * Represents a topic within a community for categorizing discussions
 */
export interface TopicModel {
  /** Unique identifier for the topic */
  _id: Types.ObjectId;
  /** Name of the topic */
  name: string;
  /** URL-friendly version of the name */
  slug: string;
  /** Description of the topic */
  description?: string;
  /** Whether the topic is archived */
  isArchived?: boolean;
  /** Number of communities using this topic */
  communityCount?: number;
  /** When the topic was created */
  createdAt?: Date;
  /** When the topic was last updated */
  updatedAt?: Date;
}
