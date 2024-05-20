import { instance } from "./axios";

export const signup = async (data: any) => {
  return await instance.post("/users/signup", data);
};

export const signin = async (data: any) => {
  return await instance.post("/users/signin", data);
};

export const signout = async () => {
  return await instance.get("/users/logout");
};

export const forgotPassword = async (data: { email: string }) => {
  return await instance.post("/users/forgotPassword", data);
};

export const resetPassword = async ({
  data,
  resetToken,
}: {
  data: { password: string; passwordConfirm: string };
  resetToken: string;
}) => {
  return await instance.patch(`/users/resetPassword/${resetToken}`, data);
};
