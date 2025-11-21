
export type ApiCommunity = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  owner?: string;
  isPrivate?: boolean;
  topics?: string[] | Array<{
    _id: string;
    name: string;
    slug: string;
    description?: string;
    community: string;
    createdBy?: string;
    isArchived?: boolean;
    discussionCount?: number;
    order?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  membersCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
};
