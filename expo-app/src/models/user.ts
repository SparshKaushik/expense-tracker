import { useQuery } from "react-query";
import { axiosClient } from "../lib/axios";

export async function getUser() {
  const { data } = await axiosClient.get("/user");
  return data;
}

export const useUserData = () => useQuery("user", getUser);
