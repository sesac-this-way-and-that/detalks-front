import { useState } from "react";
import { AccountForm } from "./userInterface";
import accountStore from "../../store/userStore";
import axios from "axios";

export default function EmailInput({ accessType }: AccountForm) {
  const [emailMsg, setEmailMsg] = useState<string>("");
  const [validCheck, setValidCheck] = useState<boolean>(false);
  const { setEmail } = accountStore();

  // 이메일 유효성 검사
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  const emailValidation = (email: string) => {
    if (emailPattern.test(email) === false) {
      return false;
    } else {
      return true;
    }
  };

  const emailDuplCheck = async (email: string) => {
    const response = await axios
      .get(`${process.env.REACT_APP_API_SERVER}/member/email/${email}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.response.status === 400) {
          return { msg: "이미 사용 중인 이메일입니다." };
        }
      });
    setEmailMsg(response.msg);
  };

  const emailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!emailValidation(e.target.value)) {
      setEmailMsg("올바르지 않은 이메일 형식입니다.");
    } else {
      switch (accessType) {
        case "register":
          emailDuplCheck(e.target.value);
          break;
        case "login":
          setEmailMsg("");
          break;
        case "findPw":
          setEmailMsg("");
          break;
      }
    }
    setEmail(e.target.value);
  };
  return (
    <>
      <label>
        <p>이메일</p>
        <input type="email" required onChange={emailOnChange} name="email" />
        <div>
          <span id="emailInputMsg">{emailMsg}</span>
        </div>
      </label>
    </>
  );
}
