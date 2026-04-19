import { create } from "zustand";
import { loginUser, registerUser, getMe } from "../services/authService";

const useUserStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,

  login: async (formData) => {
    try {
      set({ loading: true });
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);

      set({
        user: data.user,
        token: data.token,
        loading: false,
      });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  register: async (formData) => {
    try {
      const data = await registerUser(formData);

      localStorage.setItem("token", data.token); // ✅ store token

      set({
        user: data.user,
        token: data.token,
      });
    } catch (err) {
      throw err;
    }
  },

  fetchUser: async () => {
    try {
      const data = await getMe();
      set({ user: data });
    } catch (err) {
      console.log("Not logged in");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));

export default useUserStore;
