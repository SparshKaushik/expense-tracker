import { Expense } from "@prisma/client";
import { axiosClient } from "../lib/axios";
import { useMutation, useQuery } from "react-query";

export interface createExpense_t {
  title: string;
  type: string;
  amount: number;
  final_amount: number;
  split: string;
  category: string;
  tags: string[];
  dateTime: number;
}

export interface createLazyExpense_t {
  type: string;
  amount: number;
  final_amount: number;
  category: string;
  dateTime: number;
}

async function getExpenses() {
  const { data } = await axiosClient.get("/expense");
  return data as Expense[];
}

export const useExpensesData = () => useQuery("expense", getExpenses);

async function createExpense(data: createExpense_t) {
  const { data: response } = await axiosClient.post("/expense", data);
  return response;
}

export const useCreateExpense = () => useMutation(createExpense);

async function createLazyExpense(data: createLazyExpense_t) {
  const { data: response } = await axiosClient.post("/expense/lazy", data);
  return response;
}

export const useCreateLazyExpense = () => useMutation(createLazyExpense);
