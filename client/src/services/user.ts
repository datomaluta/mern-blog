import { instance, instanceForMultipart } from "./axios";

export const updateMe = (data: FormData) => {
  return instanceForMultipart.put(`/users/updateMe`, data);
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

export const createUser = (data: FormData) => {
  return instanceForMultipart.post(`/users/users/create`, data);
};

export const updateUser = ({ data, id }: { data: FormData; id: string }) => {
  return instanceForMultipart.put(`/users/users/${id}`, data);
};
