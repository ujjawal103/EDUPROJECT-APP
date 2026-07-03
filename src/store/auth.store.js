import { create } from "zustand";

const useAuthStore = create((set) => ({
  // State
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  // Actions
  login: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    }),

  updateAccessToken: (accessToken) =>
    set({
      accessToken,
    }),

  updateUser: (user) =>
    set({
      user,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));

export default useAuthStore;