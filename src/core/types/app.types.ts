import { IUser, IProfile, ICommunity } from "./index.types";

export type UserCreateData = Pick<IUser, "username" | "email" | "password">;
export type UserUpdateData = Pick<
  IUser,
  "username" | "email" | "password" | "avatar"
>;
export type UserLoginData = Pick<IUser, "email" | "password">;
export type UserForgotPasswordData = Pick<IUser, "email">;
export type UserResetPasswordData = Pick<IUser, "password">;

export type ProfileCreateData = Omit<
  IProfile,
  "user" | "_id" | "createdAt" | "updatedAt" | "username"
>;
export type ProfileUpdateData = Omit<
  IProfile,
  "user" | "_id" | "createdAt" | "updatedAt" | "username"
>;




export type CommunityCreateData = Omit<ICommunity, "_id" | "createdAt" | "updatedAt">;
export type CommunityUpdateData = Omit<ICommunity, "_id" | "createdAt" | "updatedAt">;

export type APIResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
};