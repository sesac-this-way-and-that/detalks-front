import { Link, useNavigate } from "react-router-dom";
import accountStore from "../../store/userStore";
import EmailInput from "./EmailInput";
import NameInput from "./NameInput";
import PwdInput from "./PwdInput";
import SocialAccount from "./SocialAccount";
import axios from "axios";
import VerificationInput from "./VerificationInput";
import { useState } from "react";

export default function RegisterPage() {
  const nav = useNavigate();
  const {
    email,
    name,
    pwd,
    verificationCode,
    setEmail,
    setName,
    setPwd,
    setVerificationCode,
  } = accountStore();
  const [beforeSendMail, setBeforeSendMail] = useState<boolean>(true);

  const accessType = "register";
  const accessText = "회원가입";

  const reqVerification = () => {
    const url = `${process.env.REACT_APP_API_SERVER}/email`;
    const userData = {
      email: email,
    };
    console.log("userdata: ", userData);
    axios
      .post(url, userData)
      .then((res) => {
        console.log("then res.data: ", res.data);
        setVerificationCode(res.data.slice(9));
        console.log("code", verificationCode, "res", res.data.slice(9));
        alert("이메일 전송 성공");
      })
      .catch((err) => {
        console.log("err: ", err);
        alert("이메일 전송 실패");
      });
    setBeforeSendMail(!beforeSendMail);
  };

  const submitFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_SERVER}/member/signup`;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("pwd", pwd);
    console.log(formData);
    axios
      .post(url, formData)
      .then((res) => {
        alert("회원가입 성공");
        console.log("then res.data: ", res.data);
        setEmail("");
        setName("");
        setPwd("");
        nav("/login");
      })
      .catch((err) => {
        alert(err.data.msg);
        console.log("err: ", err);
      });
  };
  return (
    <section>
      <article className="accountInputForm">
        <div className="pageType">
          <div className="logo"></div>
          <p>{accessText}</p>
        </div>
        {beforeSendMail ? (
          <form className="inputContainer">
            <EmailInput accessType={accessType} />
            <NameInput accessType={accessType} />
            <PwdInput accessType={accessType} />
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
      <article>
        <Link to="/login">로그인</Link>
        <span> | </span>
        <Link to="/findPassword">비밀번호 찾기</Link>
      </article>
      <SocialAccount accessText={accessText} />
    </section>
  );
}
