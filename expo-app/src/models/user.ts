import { useQuery } from "react-query";
import { axiosClient } from "../lib/axios";
import { User } from "@prisma/client";

export async function getUser() {
  const { data } = await axiosClient.get("/user");
  return data as User;
}

export const useUserData = () => useQuery("user", getUser);
