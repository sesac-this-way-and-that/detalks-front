import { Link } from "react-router-dom";
import "../../styles/userAuth.scss";
import accountStore from "../../store/userStore";
import EmailInput from "./EmailInput";
import axios from "axios";
import VerificationInput from "./VerificationInput";
import { useState } from "react";

export default function FindPasswordPage() {
  const { email, verificationCode, setVerificationCode } = accountStore();
  const [beforeSendMail, setBeforeSendMail] = useState<boolean>(true);
  const [beforeVerification, setBeforeVerification] = useState<boolean>(true);

  const accessType = "findPw";
  const accessText = "비밀번호 찾기";

  const reqVerification = () => {
    const url = `${process.env.REACT_APP_API_SERVER}/...`;
    const userData = {
      email: email,
    };
    console.log("userdata: ", userData);
    setVerificationCode("123123");
    // axios
    //   .post(url, userData)
    //   .then((res) => {
    //     console.log("then res.data: ", res.data);
    //     setVerificationCode(res.data.slice(9));
    //     console.log("code", verificationCode, "res", res.data.slice(9));
    //     alert("이메일 전송 성공");
    //   })
    //   .catch((err) => {
    //     console.log("err: ", err);
    //     alert("이메일 전송 실패");
    //   });
    setBeforeSendMail(!beforeSendMail);
  };

  const submitFunc = () => {};
  return (
    <section>
      <h2 className="title">{accessText}</h2>
      <article className="accountInputForm">
        <div className="logo"></div>

        {beforeSendMail ? (
          <form className="inputContainer">
            <EmailInput accessType={accessType} />
            <button type="button" onClick={reqVerification}>
              인증 메일 발송
            </button>
          </form>
        ) : (
          <form onSubmit={submitFunc} className="inputContainer">
            <VerificationInput />
          </form>
        )}
      </article>
      <article className="accountLink">
        <Link to="/register">회원가입</Link>
        <span> | </span>
        <Link to="/login">로그인</Link>
      </article>
    </section>
  );
}
