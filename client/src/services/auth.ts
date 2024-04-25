import { instance } from "./axios";

export const signup = async (data: any) => {
  return await instance.post("/users/signup", data);
};

export const test = () => {
  return instance.get("/test");
};
