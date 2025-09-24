// src/hooks/useTransactions.js
import { useQuery } from "@tanstack/react-query";
import api from "../utils/api";

/**
 * Fetch all transactions with pagination and filters
 */
export const useTransactions = (page = 1, limit = 10, filters = {}) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...filters,
  });

  return useQuery({
    queryKey: ["transactions", { page, limit, filters }],
    queryFn: async () => {
      const res = await api.get(`/transactions/getAllTransactions?${params}`);
      console.log("result of data: ", res);
      return res.data;
    },
    placeholderData: (prev) => prev, // ✅ replaces keepPreviousData
  });
};

/**
 * Fetch transactions for a specific school
 */
export const useSchoolTransactions = (schoolId, page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["schoolTransactions", { schoolId, page, limit }],
    queryFn: async () => {
      const res = await api.get(
        `/transactions/getTransactionsBySchool/${schoolId}?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    enabled: Boolean(schoolId),
    placeholderData: (prev) => prev, // ✅ v5 style
  });
};

/**
 * Fetch transaction status by order ID
 */
export const useTransactionStatus = (orderId) => {
  return useQuery({
    queryKey: ["transactionStatus", orderId],
    queryFn: async () => {
      const res = await api.get(`/transactions/transaction-status/${orderId}`);
      return res.data;
    },
    enabled: Boolean(orderId),
  });
};
