import { instance } from "./axios";

// export const getPosts = (query?: string) => {
//   return instance.get(`/posts?${query ? query : ""}`);
// };

export const getPosts = ({
  page,
  queryString,
}: {
  page: number | string;
  queryString?: string;
}) => {
  return instance.get(
    `/posts?page=${page}&limit=9${queryString ? `&${queryString}` : ""}`
  );
};

export const getPost = (slug: string) => {
  return instance.get(`/posts/${slug}`);
};
