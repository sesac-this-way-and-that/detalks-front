import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

type UserInfo = {
  idx?: number;
  name: string;
  email: string;
  isDeleted: boolean;
  reason?: string;
  state: boolean;
  img?: string;
  summary?: string;
  about?: string;
  rep?: number;
  social?: string;
  created?: Date;
  visited?: Date;
  updated?: string;
  qcount?: number;
  acount?: number;
  tags?: string[];
};
/*
"idx": 1,
        "email": "789rlgur@naver.com",
        "name": "rekey",
        "isDeleted": false,
        "reason": null,
        "state": true,
        "img": "default5.png",
        "summary": null,
        "about": null,
        "rep": 1,
        "social": "NONE",
        "created": "2024-06-08 17:48:18",
        "visited": "2024-06-08 17:48:18",
        "updated": null,
        "qcount": 0,
        "acount": 0
*/
type UserStore = {
  userInfo: UserInfo | null;
  isLogin: boolean;
  getInfo: () => Promise<void>;
  logout: () => void;
};

export const useInfoStore = create<UserStore>()(
  persist(
    (set) => ({
      userInfo: null,
      isLogin: false,
      getInfo: async () => {
        try {
          const token = localStorage.getItem("authToken"); // Assuming you store your token in localStorage
          const url = `${process.env.REACT_APP_API_SERVER}/member/auth`;
          const res = await axios.get(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("이것은 zustand" + res.data);
          set((state) => ({
            userInfo: res.data.data,
            isLogin: true,
          }));
        } catch (error) {
          console.log(error);
          set({ userInfo: null, isLogin: false });
        }
      },
      logout: () => {
        set((state) => ({ isLogin: false, userInfo: null, profileImgUrl: "" }));
      },
    }),
    {
      name: "user-info",
    }
  )
);
