import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { UserApi } from "../../api";
import type { UserRequest } from "../../types/user";

export function useRegisterUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UserApi.registerUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
    },
    onSuccess: () => {
      toast.success(`User registered successfully`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to register user: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useGetAllUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: UserApi.getAllUsers,
  });
}

export function useGetUser() {
  const { email } = useParams();
  return useQuery({
    queryKey: ["users", email],
    queryFn: () => UserApi.getUserByEmail(email as string),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const deleteUser = async (id: string) => {
    return UserApi.deleteUser(id);
  };
  return useMutation({
    mutationFn: deleteUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
    },
    onSuccess: () => {
      toast.success(`User deleted successfully`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useEditUser() {
  const queryClient = useQueryClient();
  const updateUser = async ({ email, dto }: { email: string, dto: UserRequest }) => {
    return UserApi.updateUser(email, dto);
  };
  return useMutation({
    mutationFn: updateUser,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["users"] });
    },
    onSuccess: () => {
      toast.success(`User updated successfully`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message}`, {
        position: "bottom-center",
        autoClose: 3000,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    }
  });
}