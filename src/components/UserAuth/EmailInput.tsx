import { useState } from "react";
import { AccountForm } from "./userInterface";
import accountStore from "../../store/userStore";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function EmailInput({ accessType }: AccountForm) {
  const [emailMsg, setEmailMsg] = useState<string>("");
  const { emailValid, setEmail, setEmailValid } = accountStore();

  // 이메일 유효성 검사
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  const emailValidation = (email: string) => {
    if (emailPattern.test(email) === false) {
      setEmailMsg("올바르지 않은 이메일 형식입니다.");
      setEmailValid(false);
      return false;
    } else {
      setEmailMsg("");
      return true;
    }
  };

  const emailDuplCheck = async (email: string) => {
    const response = await axios
      .get(`${process.env.REACT_APP_API_SERVER}/member/email/${email}`)
      .then((res) => {
        switch (accessType) {
          case "register":
            setEmailValid(true);
            setEmailMsg("사용 가능한 이메일입니다.");
            break;
          case "findPw":
            setEmailValid(false);
            setEmailMsg("가입된 유저 정보가 없습니다.");
            break;
        }
        return res.data;
      })
      .catch((err) => {
        if (err.response.status === 400) {
          switch (accessType) {
            case "register":
              setEmailValid(false);
              setEmailMsg("이미 사용 중인 이메일입니다.");
              break;
            case "findPw":
              setEmailValid(true);
              setEmailMsg("");
              break;
          }
        } else {
          console.log("err: ", err);
        }
      });
  };

  const emailOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!emailValidation(e.target.value)) {
    } else {
      switch (accessType) {
        case "register":
          emailDuplCheck(e.target.value);
          break;
        case "login":
          setEmailMsg("");
          break;
        case "findPw":
          emailDuplCheck(e.target.value);
          break;
      }
    }
    setEmail(e.target.value);
  };
  return (
    <>
      <label>
        <p>이메일</p>
        <FontAwesomeIcon
          icon={faCheck}
          className={`checkIcon ${emailValid ? "" : "display-none"}`}
        />
        <input
          type="email"
          required
          onChange={emailOnChange}
          onBlur={emailOnChange}
          name="email"
          defaultValue={`${accessType === "login" ? "test@test.com" : ""}`}
        />
        <div>
          <span
            className={`emailInputMsg ${
              emailValid ? "validmsg-pass" : "validmsg-fail"
            }`}
          >
            {emailMsg}
          </span>
        </div>
      </label>
    </>
  );
}
