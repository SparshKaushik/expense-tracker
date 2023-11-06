import { Tag } from "@prisma/client";
import { axiosClient } from "../lib/axios";
import { useQuery } from "react-query";

export async function getTags() {
  const { data } = await axiosClient.get("/tag");
  return data as Tag[];
}

export const useTagsData = () => useQuery("tag", getTags);
