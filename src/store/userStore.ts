import { create } from "zustand";

interface accountStoreType {
  email: string;
  name: string;
  pwd: string;
  verificationCode: string;
  emailValid: boolean;
  nameValid: boolean;
  pwdValid: boolean;
  setEmail: (email: string) => void;
  setPwd: (pwd: string) => void;
  setName: (name: string) => void;
  setVerificationCode: (verificationCode: string) => void;
  setEmailValid: (emailValid: boolean) => void;
  setNameValid: (nameValid: boolean) => void;
  setPwdValid: (pwdValid: boolean) => void;
}

const accountStore = create<accountStoreType>((set) => ({
  email: "",
  name: "",
  pwd: "",
  verificationCode: "",
  emailValid: false,
  nameValid: false,
  pwdValid: false,
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
  setEmailValid: (state) => {
    set(() => ({ emailValid: state }));
  },
  setNameValid: (state) => {
    set(() => ({ nameValid: state }));
  },
  setPwdValid: (state) => {
    set(() => ({ pwdValid: state }));
  },
}));

export default accountStore;
