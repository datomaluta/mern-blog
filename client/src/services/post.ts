import { instance } from "./axios";

export const getPosts = (query?: { query?: string }) => {
  return instance.get(`/posts?${query ? query : ""}`);
};
