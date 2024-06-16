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
