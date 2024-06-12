import axios from "axios";
import accountStore from "../../store/userStore";
import { useRef, useState } from "react";

export default function VerificationInput() {
  const { verificationCode, setVerificationCode } = accountStore();
  const [beforeVerification, setBeforeVerification] = useState<boolean>(true);
  const [code, setCode] = useState<string>("");
  const [verifyMsg, setVerifyMsg] = useState<string>("");
  const codeRef = useRef<HTMLInputElement>(null);

  const storeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const checkVerification = () => {
    if (code === verificationCode) {
      setVerifyMsg(
        "인증번호가 일치합니다. 회원가입 버튼을 눌러서 진행해주세요."
      );
      setBeforeVerification(false);
      setVerificationCode("");
    } else {
      setVerifyMsg("인증번호가 일치하지 않습니다.");
      setBeforeVerification(true);
    }
  };
  return (
    <>
      <label>
        <p>인증번호 입력</p>
        <input type="text" ref={codeRef} onChange={storeCode} />
        <span id="VerifyInputMsg">{verifyMsg}</span>
      </label>
      {beforeVerification ? (
        <button type="button" onClick={checkVerification}>
          인증번호 확인
        </button>
      ) : (
        <>
          <button type="submit">회원가입</button>
        </>
      )}
    </>
  );
}
