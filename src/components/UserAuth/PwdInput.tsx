import { useState } from "react";
import { AccountForm } from "./userInterface";
import accountStore from "../../store/userStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function PwdInput({ accessType }: AccountForm) {
  const [pwdMsg, setPwdMsg] = useState<string>("");
  const [pwdCheckMsg, setPwdCheckMsg] = useState<string>("");
  const [inputPwd, setInputPwd] = useState<string>("");
  const [inputPwdCheck, setInputPwdCheck] = useState<string>("");
  const { pwdValid, setPwd, setPwdValid } = accountStore();

  // 비밀번호 유효성 검사
  const pwdPattern = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\W)(?=\S+$).{8,16}/;
  const pwdValidation = (pw: string) => {
    if (pwdPattern.test(pw) === false) {
      return false;
    } else {
      return true;
    }
  };

  const pwdOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (accessType) {
      case "register":
      case "findPw":
        setInputPwd(e.target.value);
        if (inputPwdCheck !== "") {
          if (e.target.value !== inputPwdCheck) {
            setPwdValid(false);
            setPwdCheckMsg("비밀번호가 일치하지 않습니다.");
          } else {
            setPwdCheckMsg("비밀번호가 일치합니다.");
          }
        }
        if (!pwdValidation(e.target.value)) {
          setPwdValid(false);
          setPwdMsg(
            "비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여 8자리 이상 16자 이하로 입력해야 합니다."
          );
        } else {
          setPwdMsg("사용 가능한 비밀번호입니다.");
        }
        if (e.target.value === inputPwdCheck && pwdValidation(e.target.value)) {
          setPwdValid(true);
        }
        break;
    }
    setPwd(e.target.value);
  };
  const pwdCheckOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPwdCheck(e.target.value);
    if (e.target.value !== inputPwd) {
      setPwdValid(false);
      setPwdCheckMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setPwdCheckMsg("비밀번호가 일치합니다.");
    }
    if (e.target.value === inputPwd && pwdValidation(e.target.value)) {
      setPwdValid(true);
    }
  };
  return (
    <>
      <label>
        <p>비밀번호</p>
        <FontAwesomeIcon
          icon={faCheck}
          className={`checkIcon ${
            pwdMsg === "사용 가능한 비밀번호입니다." ? "" : "display-none"
          }`}
        />
        <input
          type="password"
          required
          onChange={pwdOnChange}
          onBlur={pwdOnChange}
          name="pwd"
          defaultValue={"test1234*"}
        />
        <div>
          <span
            className={`pwdInputMsg ${
              pwdMsg === "사용 가능한 비밀번호입니다."
                ? "validmsg-pass"
                : "validmsg-fail"
            }`}
          >
            {pwdMsg}
          </span>
        </div>
      </label>
      {accessType !== "login" ? (
        <label>
          <p>비밀번호 확인</p>
          <FontAwesomeIcon
            icon={faCheck}
            className={`checkIcon ${
              pwdCheckMsg === "비밀번호가 일치합니다." ? "" : "display-none"
            }`}
          />
          <input
            type="password"
            required
            onChange={pwdCheckOnChange}
            onBlur={pwdCheckOnChange}
            defaultValue={"test1234*"}
          />
          <div>
            <span
              className={`pwdCheckInputMsg ${
                pwdCheckMsg === "비밀번호가 일치합니다."
                  ? "validmsg-pass"
                  : "validmsg-fail"
              }`}
            >
              {pwdCheckMsg}
            </span>
          </div>
        </label>
      ) : null}
    </>
  );
}
