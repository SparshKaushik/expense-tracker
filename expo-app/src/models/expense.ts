import { Expense } from "@prisma/client";
import { axiosClient } from "../lib/axios";
import { useQuery } from "react-query";

export async function getExpenses() {
  const { data } = await axiosClient.get("/expense");
  return data as Expense[];
}

export const useExpensesData = () => useQuery("expense", getExpenses);
