import { instance } from "./axios";

export const getPosts = (query?: string) => {
  return instance.get(`/posts?${query ? query : ""}`);
};

export const getPost = (slug: string) => {
  return instance.get(`/posts/${slug}`);
};
