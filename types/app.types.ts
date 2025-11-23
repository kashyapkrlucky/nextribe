
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