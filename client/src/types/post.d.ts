import { UserType } from "./user";

export type PostType = {
  category: string;
  content: string;
  createdAt: string;
  id: string;
  _id: string;
  image: string;
  slug: string;
  title: string;
  updatedAt: string;
  user: UserType;
};
