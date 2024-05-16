import { instance, instanceForMultipart } from "./axios";

export const updateMe = (data: {
  username: string;
  email: string;
  photo: any;
}) => {
  return instanceForMultipart.put(`/users/updateMe`, data);
};

export const updateMyPassword = (data: {
  passwordCurrent: string;
  password: string;
  passwordConfirm: string;
}) => {
  return instance.patch("/users/updateMyPassword", data);
};
