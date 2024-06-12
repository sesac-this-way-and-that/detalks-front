import { Link } from "react-router-dom";
import accountStore from "../../store/userStore";
import EmailInput from "./EmailInput";
import axios from "axios";
import VerificationInput from "./VerificationInput";
import { useState } from "react";

export default function FindPasswordPage() {
  const { email } = accountStore();
  const [beforeVerification, setBeforeVerification] = useState<boolean>(true);
  const accessType = "findPw";
  const accessText = "비밀번호 찾기";

  const submitFunc = () => {};
  return (
    <section>
      <article className="accountInputForm">
        <div className="pageType">
          <div className="logo"></div>
          <p>{accessText}</p>
        </div>
        {beforeVerification ? (
          <form className="inputContainer">
            <EmailInput accessType={accessType} />
            <button type="submit">{accessText}</button>
          </form>
        ) : (
          <form onSubmit={submitFunc}>
            <VerificationInput />
          </form>
        )}
      </article>
      <article>
        <Link to="/register">회원가입</Link>
        <span> | </span>
        <Link to="/login">로그인</Link>
      </article>
    </section>
  );
}
