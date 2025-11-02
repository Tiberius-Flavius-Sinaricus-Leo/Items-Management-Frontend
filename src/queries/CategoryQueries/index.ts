import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { CategoryApi } from "../../api";
import type { CategoryRequest } from "../../types/category";

export function useAddCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: CategoryApi.addCategory,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
    },
    onSuccess: () => {
      toast.success(`Category added successfully`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to add category: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
}

export function useGetAllCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: CategoryApi.getAllCategories,
  });
}

export function useGetCategory() {
  const { id } = useParams();
  const getCategory = () => {
    return CategoryApi.getCategory(id as string);
  }
  return useQuery({
    queryKey: ["categories", id],
    queryFn: getCategory,
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const deleteCategory = async (id: string) => {
    return CategoryApi.deleteCategory(id);
  };
  return useMutation({
    mutationFn: deleteCategory,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
    },
    onSuccess: () => {
      toast.success(`Category deleted successfully`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete category: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {id: string, dto: CategoryRequest}) => CategoryApi.updateCategory(params.id, params.dto),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["categories"] });
    },
    onSuccess: () => {
      toast.success(`Category updated successfully`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to update category: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    }
  });
}
