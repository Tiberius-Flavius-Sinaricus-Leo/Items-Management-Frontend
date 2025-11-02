import { create } from "zustand";
import { AuthApi } from "../../api";

import type { AuthRequest, LoginResponse } from "../../types/login";
import type { Role } from "../../types/role";


type AuthState = {
  userEmail: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  login: (request: AuthRequest) => Promise<LoginResponse | undefined>;
  checkAuth: () => Promise<void>;
  verifyCredentials: (request: AuthRequest) => Promise<boolean>;
}


const useAuthStore = create<AuthState>((set) => ({
  userEmail: null,
  role: null,
  isAuthenticated: false,
  loading: false,
  logout: async () => {
    set({ userEmail: null, role: null, isAuthenticated: false, loading: false });
    await AuthApi.logout();
  },
  login: async (request: AuthRequest) => {
    try {
      const res = await AuthApi.login(request);
      if (res.status === 200) {
        set({ userEmail: res.data.userEmail, role: res.data.role, isAuthenticated: true, loading: false });
        return { data: res.data };
      }
    } catch (error: any) {
      return { error: error.response?.data || error.message};
    }
  },
  checkAuth: async () => {
    try {
      const res = await AuthApi.checkLogin();
      
      if (res.status === 200) {
        set({ userEmail: res.data.userEmail, role: res.data.role, isAuthenticated: true, loading: false });
      } else {
        set({ userEmail: null, role: null, isAuthenticated: false, loading: false });
      }
    } catch (error: any) {
      console.error("Auth check error:", error);
      console.error("Error response:", error.response);
      set({ userEmail: null, role: null, isAuthenticated: false, loading: false });
    }
  },
  verifyCredentials: async (request: AuthRequest) => {
    try {
      const result = await AuthApi.verifyCredentials(request);
      return result;
    } catch (error: any) {
      console.error("Credential verification failed:", error);
      return false;
    }
  },
}));

export default useAuthStore;