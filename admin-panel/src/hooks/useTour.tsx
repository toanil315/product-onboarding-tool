import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const TOUR_QUERY_CONFIGS = {
  detail: () => ({
    queryKey: ["tour", "detail"],
    queryFn: () => axios.get(`${API_URL}/tours/1723881048588`),
  }),
};

export const useTour = () => {
  return useQuery(TOUR_QUERY_CONFIGS.detail());
};

export const useCreateTour = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => axios.post(`${API_URL}/tours`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour"] });
    },
  });
};

export const useSaveTour = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => axios.put(`${API_URL}/tours`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour"] });
    },
  });
};
