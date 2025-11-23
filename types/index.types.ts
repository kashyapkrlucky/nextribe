import { Types } from "mongoose";

export type CommunityMemberRole = "owner" | "admin" | "member";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICommunity {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  owner: Types.ObjectId; // ref: User
  isPrivate?: boolean;
  topics?: Types.ObjectId[]; // ref: Topic[]
  createdAt?: Date;
  updatedAt?: Date;
  memberCount?: number;
}


export interface ICommunityMember {
  community: Types.ObjectId; // ref: Community
  user: Types.ObjectId; // ref: User
  role: CommunityMemberRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDiscussion {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  body: string;
  author: Types.ObjectId | IUser;
  community: Types.ObjectId;
  isLocked?: boolean;
  commentCount?: number;
  lastActivityAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  replyCount?: number;
}


export interface IReply {
  discussion: Types.ObjectId; // ref: Discussion
  author: Types.ObjectId; // ref: User
  body: string;
  parent?: Types.ObjectId | null; // ref: Reply
  isDeleted?: boolean; // soft delete flag
  createdAt?: Date;
  updatedAt?: Date;
}


export interface ITopic {
  name: string;
  slug: string;
  description?: string;
  community: Types.ObjectId; // ref: Community
  createdBy: Types.ObjectId; // ref: User
  isArchived?: boolean;
  discussionCount?: number;
  order?: number; // for manual ordering/pinning within community
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MyCommunity {
  _id: string;
  name: string;
  slug: string;
}

export interface ApiCommunity {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  membersCount: number;
  topics: string[];
}

export interface Community {
  name: string;
  slug: string;
  _id: string;
}

export interface Author {
  name: string;
  email: string;
  _id: string;
}

export interface Discussion {
  _id: string;
  title: string;
  content: string;
  community: Community;
  author: Author;
  createdAt: string;
  updatedAt: string;
  replyCount?: number;
}