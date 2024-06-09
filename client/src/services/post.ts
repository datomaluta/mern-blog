import { instance, instanceForMultipart } from "./axios";

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

export const createPost = (data: FormData) => {
  return instanceForMultipart.post("/posts", data);
};

export const deletePost = (id: string) => {
  return instance.delete(`/posts/${id}`);
};

export const updatePost = ({ id, data }: { id: string; data: FormData }) => {
  return instanceForMultipart.put(`/posts/${id}`, data);
};
