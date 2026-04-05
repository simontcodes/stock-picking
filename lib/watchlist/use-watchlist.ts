"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToWatchlist,
  fetchWatchlist,
  removeFromWatchlist,
} from "@/lib/api/watchlist";

const WATCHLIST_QUERY_KEY = ["watchlist"];

export function useWatchlist() {
  return useQuery({
    queryKey: WATCHLIST_QUERY_KEY,
    queryFn: fetchWatchlist,
  });
}

export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToWatchlist,
    onSuccess: (data) => {
      queryClient.setQueryData(WATCHLIST_QUERY_KEY, data);
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: (data) => {
      queryClient.setQueryData(WATCHLIST_QUERY_KEY, data);
    },
  });
}