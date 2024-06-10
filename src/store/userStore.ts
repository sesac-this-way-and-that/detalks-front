import { create } from "zustand";

interface accountStoreType {
  email: string;
  name: string;
  pwd: string;
  inputValid: boolean;
  setEmail: (email: string) => void;
  setPwd: (pwd: string) => void;
  setName: (name: string) => void;
  setInputValid: (inputValid: boolean) => void;
}

const accountStore = create<accountStoreType>((set) => ({
  email: "",
  name: "",
  pwd: "",
  inputValid: false,
  setEmail: (state) => {
    set(() => ({ email: state }));
  },
  setPwd: (state) => {
    set(() => ({ pwd: state }));
  },
  setName: (state) => {
    set(() => ({ name: state }));
  },
  setInputValid: (state) => {
    set(() => ({ inputValid: state }));
  },
}));

export default accountStore;
