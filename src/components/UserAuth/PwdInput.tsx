import { useState } from "react";
import { AccountForm } from "./userInterface";
import accountStore from "../../store/userStore";

export default function PwdInput({ accessType }: AccountForm) {
  const [pwdMsg, setPwdMsg] = useState<string>("");
  const [pwdCheckMsg, setPwdCheckMsg] = useState<string>("");
  const [inputPwd, setInputPwd] = useState<string>("");
  const { setPwd } = accountStore();

  // 비밀번호 유효성 검사
  const pwdPattern =
    /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,16}$/;
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
        setInputPwd(e.target.value);
        if (!pwdValidation(e.target.value)) {
          setPwdMsg(
            "비밀번호는 영문자, 숫자, 특수문자를 모두 포함하여 8자리 이상 16자 이하로 입력해야 합니다."
          );
        } else {
          setPwdMsg("");
        }
        break;
    }
  };
  const pwdCheckOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value !== inputPwd) {
      setPwdCheckMsg("비밀번호가 일치하지 않습니다.");
    } else {
      setPwdCheckMsg("비밀번호가 일치합니다.");
    }
  };

  const storePwd = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value);
  };
  return (
    <>
      <label>
        <p>비밀번호</p>
        <input
          type="password"
          required
          onChange={pwdOnChange}
          onBlur={storePwd}
          name="pwd"
        />
        <span id="pwInputMsg">{pwdMsg}</span>
      </label>
      {accessType !== "login" ? (
        <label>
          <p>비밀번호 확인</p>
          <input type="password" required onChange={pwdCheckOnChange} />
          <span id="pwCheckInputMsg">{pwdCheckMsg}</span>
        </label>
      ) : null}
    </>
  );
}
