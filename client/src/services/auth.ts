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
