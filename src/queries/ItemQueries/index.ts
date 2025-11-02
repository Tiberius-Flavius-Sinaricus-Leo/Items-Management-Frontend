import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { ItemApi } from "../../api";
import type { ItemRequest } from "../../types/item";

export function useAddItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ItemApi.addItem,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["items"] });
    },
    onSuccess: () => {
      toast.success(`Item added successfully`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to add item: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });
}

export function useGetAllItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: ItemApi.getAllItems,
  });
}

export function useGetItem() {
  const { id } = useParams();
  const getItem = () => {
    return ItemApi.getItem(id as string);
  }
  return useQuery({
    queryKey: ["items", id],
    queryFn: getItem,
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const deleteItem = async (id: string) => {
    return ItemApi.deleteItem(id);
  };
  return useMutation({
    mutationFn: deleteItem,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["items"] });
    },
    onSuccess: () => {
      toast.success(`Item deleted successfully`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete item: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();
  const updateItem = async ({ id, dto }: { id: string, dto: ItemRequest }) => {
    return ItemApi.updateItem(id, dto);
  };
  return useMutation({
    mutationFn: updateItem,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["items"] });
    },
    onSuccess: () => {
      toast.success(`Item updated successfully`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to update item: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    }
  });
}
