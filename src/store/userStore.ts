import { create } from "zustand";

interface accountStoreType {
  email: string;
  name: string;
  pwd: string;
  verificationCode: string;
  setEmail: (email: string) => void;
  setPwd: (pwd: string) => void;
  setName: (name: string) => void;
  setVerificationCode: (verificationCode: string) => void;
}

const accountStore = create<accountStoreType>((set) => ({
  email: "",
  name: "",
  pwd: "",
  verificationCode: "",
  setEmail: (state) => {
    set(() => ({ email: state }));
  },
  setPwd: (state) => {
    set(() => ({ pwd: state }));
  },
  setName: (state) => {
    set(() => ({ name: state }));
  },
  setVerificationCode: (state) => {
    set(() => ({ verificationCode: state }));
  },
}));

export default accountStore;
