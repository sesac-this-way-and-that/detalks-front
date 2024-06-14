import { create } from "zustand";
import { persist } from "zustand/middleware";

interface authStore {
  authToken: string | null;
  setAuthToken: (authToken: string | null) => void;
  removeAuthToken: () => void;
}

const authStore = create(
  persist<authStore>(
    (set) => ({
      authToken: null,
      setAuthToken: (authToken: string | null) =>
        set(() => ({ authToken: authToken })),
      removeAuthToken: () => {
        set(() => ({ authToken: null }));
        localStorage.removeItem("authToken");
      },
    }),
    {
      name: "userAuth",
    }
  )
);

export default authStore;
