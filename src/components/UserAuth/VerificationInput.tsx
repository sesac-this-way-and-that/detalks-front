import axios from "axios";
import accountStore from "../../store/userStore";
import { useRef, useState } from "react";
import { AccountForm } from "./userInterface";
import PwdInput from "./PwdInput";

export default function VerificationInput({
  accessType,
  accessText,
}: AccountForm) {
  const { email, verificationCode, setEmail, setVerificationCode } =
    accountStore();
  const [beforeVerification, setBeforeVerification] = useState<boolean>(true);
  const [code, setCode] = useState<string>("");
  const [verifyMsg, setVerifyMsg] = useState<string>("");
  const codeRef = useRef<HTMLInputElement>(null);

  const storeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const checkVerification = () => {
    const url = `${process.env.REACT_APP_API_SERVER}/email/verify`;
    const codeData = {
      email: email,
      code: code,
    };
    axios
      .post(url, codeData)
      .then((res) => {
        setVerifyMsg("인증코드가 일치합니다.");
        setBeforeVerification(false);
      })
      .catch((err) => {
        console.log("err: ", err);
        alert("인증에 실패했습니다.");
        return;
      });
  };

  return (
    <>
      <label>
        <p>인증번호 입력</p>
        <button
          type="button"
          className="inInputBtn"
          onClick={checkVerification}
          disabled={beforeVerification ? false : true}
        >
          인증번호 확인
        </button>
        <input
          type="text"
          ref={codeRef}
          onChange={storeCode}
          disabled={beforeVerification ? false : true}
        />
        <div>
          <span
            className={`VerifyInputMsg ${
              beforeVerification ? "validmsg-fail" : "validmsg-pass"
            }`}
          >
            {verifyMsg}
          </span>
        </div>
      </label>
      {accessType === "register" ? (
        <button
          type="submit"
          className="registerSubmit"
          disabled={beforeVerification ? true : false}
        >
          {accessText}
        </button>
      ) : (
        <>
          {beforeVerification ? null : (
            <>
              <PwdInput accessType="findPw" />
            </>
          )}
          <button
            type="submit"
            className="registerSubmit"
            disabled={beforeVerification ? true : false}
          >
            비밀번호 재설정
          </button>
        </>
      )}
    </>
  );
}
