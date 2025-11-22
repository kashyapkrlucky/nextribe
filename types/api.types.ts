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