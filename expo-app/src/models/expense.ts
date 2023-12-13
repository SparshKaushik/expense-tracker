import { Expense } from "@prisma/client";
import { axiosClient, cleanObject } from "../lib/axios";
import { QueryOptions, useMutation, useQuery } from "react-query";

export interface createExpense_t {
  title: string;
  type: "Debit" | "Credit";
  amount: number;
  final_amount: number;
  split: string;
  category: string;
  tags: string[];
  dateTime: number;
}

export interface createLazyExpense_t {
  type: "Debit" | "Credit";
  amount: number;
  final_amount: number;
  category: string;
  dateTime: number;
}

interface getExpenses_t {
  limit?: number;
  offset?: number;
  sortBy?: "dateCreated" | "amount" | "dateTime";
  sortOrder?: "asc" | "desc";
  filterByType?: "Credit" | "Debit";
  filterByCategory?: string;
  filterByTag?: string;
  filterByDateStart?: string;
  filterByDateEnd?: string;
  searchTitle?: string;
}

export async function getExpenses(params: getExpenses_t) {
  cleanObject(params);
  const { data } = await axiosClient.get("/expense", {
    params: params,
  });
  return data as Expense[];
}

export const useExpensesData = (
  params: getExpenses_t,
  config: any[] = [],
  options?: QueryOptions<Expense[]>
) =>
  useQuery(["expense", ...config], () => getExpenses(params), {
    ...options,
  });

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
