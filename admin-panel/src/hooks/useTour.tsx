import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const TOUR_QUERY_CONFIGS = {
  list: () => ({
    queryKey: ["tour", "list"],
    queryFn: () => axios.get(`${API_URL}/tours`),
  }),
  detail: (tourId: string) => ({
    queryKey: ["tour", "detail", tourId],
    queryFn: () => axios.get(`${API_URL}/tours/${tourId}`),
    enabled: !!tourId,
  }),
};

export const useTours = () => {
  return useQuery(TOUR_QUERY_CONFIGS.list());
};

export const useTour = (tourId: string) => {
  return useQuery(TOUR_QUERY_CONFIGS.detail(tourId));
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

export const useDeleteTour = (tourId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => axios.delete(`${API_URL}/tours/${tourId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tour"] });
    },
  });
};
