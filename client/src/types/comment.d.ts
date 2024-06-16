import { UserType } from "./user";

export type CommentType = {
  _id: string;
  content: string;
  likes: string[];
  post: string;
  user: UserType;
  createdAt: string;
};
