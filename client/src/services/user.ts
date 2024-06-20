import { instance } from "./axios";

export const updateMe = (data: {
  username: string;
  email: string;
  photo: string;
}) => {
  return instance.put(`/users/updateMe`, data);
};

export const updateMyPassword = (data: {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}) => {
  return instance.patch("/users/updateMyPassword", data);
};

export const getAllUsers = ({
  page,
  queryString,
}: {
  page: number | string;
  queryString?: string;
}) => {
  return instance.get(
    `/users/allUsers?page=${page}&limit=9${
      queryString ? `&${queryString}` : ""
    }`
  );
};

export const deleteUser = (id: string) => {
  return instance.delete(`/users/users/${id}`);
};

export const getUserById = (id: string) => {
  return instance.get(`/users/users/${id}`);
};

export const createUser = (data: {
  username: string;
  email: string;
  photo: string;
  role: string;
  password: string;
  passwordConfirm: string;
}) => {
  return instance.post(`/users/users/create`, data);
};

export const updateUser = ({
  data,
  id,
}: {
  data: { username: string; email: string; photo: string; role: string };
  id: string;
}) => {
  return instance.put(`/users/users/${id}`, data);
};
