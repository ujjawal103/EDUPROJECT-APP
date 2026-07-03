import { create } from "zustand";

const useThemeStore = create((set) => ({
  mode: "light",

  setTheme: (mode) =>
    set({
      mode,
    }),

  toggleTheme: () =>
    set((state) => ({
      mode: state.mode === "light" ? "dark" : "light",
    })),
}));

export default useThemeStore;



