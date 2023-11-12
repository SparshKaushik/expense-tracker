import { Expense } from "@prisma/client";
import { axiosClient } from "../lib/axios";
import { useMutation, useQuery } from "react-query";

async function getExpenses() {
  const { data } = await axiosClient.get("/expense");
  return data as Expense[];
}

export const useExpensesData = () => useQuery("expense", getExpenses);

async function createExpense(data: {
  title: string;
  type: string;
  amount: number;
  final_amount: number;
  split: string;
  category: string;
  tags: string;
  dateTime: number;
}) {
  const { data: response } = await axiosClient.post("/expense", data);
  return response;
}

export const useCreateExpense = () => useMutation(createExpense);

async function createLazyExpense(data: {
  type: string;
  amount: number;
  final_amount: number;
  category: string;
  dateTime: number;
}) {
  const { data: response } = await axiosClient.post("/expense/lazy", data);
  return response;
}

export const useCreateLazyExpense = () => useMutation(createLazyExpense);
