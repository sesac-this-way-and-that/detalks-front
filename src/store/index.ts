import { create } from "zustand";

type Store = {};

const useStore = create<Store>()((set) => ({
  // 상태 관리를 원하는 코드 삽입
}));

export { useStore };
