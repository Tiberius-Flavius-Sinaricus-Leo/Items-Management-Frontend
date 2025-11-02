import axios from "axios";
import { BACKEND_URL } from "./config";
import type { CategoryRequest, CategoryResponse } from "./types/category";
import type { ItemResponse, ItemRequest } from "./types/item";
import type { AuthRequest, AuthResponse } from "./types/login";
import type { UserRequest, UserResponse } from "./types/user";

const apiClient = axios.create({
  baseURL: BACKEND_URL as string,
  withCredentials: true,
});

/* ------------------------ APIs ------------------------ */

export const AuthApi = {
  login: async (dto: AuthRequest) => apiClient.post<AuthResponse>("/login", dto),
  // Since the cookie is HttpOnly, we cannot access it via JavaScript. We just need to make a request to the backend to check if the user is logged in.
  checkLogin: async () => {
    const res = await apiClient.get<AuthResponse>("/check-login");
    return res;
  },
  logout: async () => apiClient.post("/logout"),
  verifyCredentials: async (dto: AuthRequest) => {
    const res = await apiClient.post<boolean>("/verify-credentials", dto);
    return res.data;
  }
};

export const CategoryApi = {
  addCategory: async (dto: CategoryRequest) => apiClient.post("/admin/categories", dto),
  deleteCategory: async (id: string) => apiClient.delete(`/admin/categories/${id}`),
  getAllCategories: async () => {
    const res = await apiClient.get<CategoryResponse[]>("/categories/all");
    return res.data;
  },
  getCategory: async (id: string) => {
    const res = await apiClient.get<CategoryResponse>(`/categories/${id}`);
    return res.data;
  },
  updateCategory: async (id: string, dto: CategoryRequest) => apiClient.put(`/admin/categories/${id}`, dto),
};

export const ItemApi = {
  addItem: async (dto: ItemRequest) => apiClient.post("/admin/items", dto),
  getItem: async (id: string) => {
    const res = await apiClient.get<ItemResponse>(`/items/${id}`);
    return res.data;
  },
  getAllItems: async () => {
    const res = await apiClient.get<ItemResponse[]>("/items/all");
    return res.data;
  },
  getItemsByCategory: async (categoryId: string) => {
    const res = await apiClient.get<ItemResponse[]>(`/items/${categoryId}/all`);
    return res.data;
  },
  countItemsByCategory: async (categoryId: string) => {
    const res = await apiClient.get<number>(`/items/${categoryId}/count`);
    return res.data;
  },
  deleteItem: async (id: string) => apiClient.delete(`/admin/items/${id}`),
  updateItem: async (id: string, dto: ItemRequest) => apiClient.put(`/admin/items/${id}`, dto),
};

export const UserApi = {
  registerUser: async (dto: UserRequest) => apiClient.post("/admin/register", dto),
  getAllUsers: async () => {
    const res = await apiClient.get<UserResponse[]>("/admin/users/all");
    return res.data;
  },
  getUserByEmail: async (email: string) => {
    const res = await apiClient.get<UserResponse>(`/admin/users/${email}`);
    return res.data;
  },
  deleteUser: async (id: string) => apiClient.delete(`/admin/users/${id}`),
  updateUser: async (email: string, dto: UserRequest) => apiClient.put(`/admin/users/${email}`, dto),
};
