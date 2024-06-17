import { instance } from "./axios";

export const getPostComments = ({
  page,
  postId,
}: {
  page: number | string;
  postId: string;
}) => {
  return instance.get(
    `/comments/getPostComments/${postId}?page=${page}&limit=6`
  );
};

export const createComment = (data: {
  postId: string;
  userId: string;
  content: string;
}) => {
  return instance.post("/comments", data);
};

export const likeComment = (commentId: string) => {
  return instance.put(`/comments/likeComment/${commentId}`);
};

export const updateComment = ({
  id,
  data,
}: {
  id: string;
  data: { content: string };
}) => {
  return instance.put(`/comments/${id}`, data);
};

export const deleteComment = (id: string) => {
  return instance.delete(`/comments/${id}`);
};

export const getAllComments = ({
  page,
  queryString,
}: {
  page: number | string;
  queryString?: string;
}) => {
  return instance.get(
    `/comments?page=${page}&limit=9${queryString ? `&${queryString}` : ""}`
  );
};

export const getCommentById = (id: string) => {
  return instance.get(`/comments/${id}`);
};
