import { Link, useNavigate } from "react-router-dom";
import "../../styles/userAuth.scss";
import accountStore from "../../store/userStore";
import EmailInput from "./EmailInput";
import NameInput from "./NameInput";
import PwdInput from "./PwdInput";
import SocialAccount from "./SocialAccount";
import axios from "axios";
import VerificationInput from "./VerificationInput";
import { useEffect, useState } from "react";
import authStore from "../../store/authStore";

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
  const { authToken } = authStore();

  // 로그인 토큰이 있는 유저가 페이지 진입 시 메인페이지로 이동
  useEffect(() => {
    if (authToken) {
      alert("이미 로그인된 상태입니다. 메인 페이지로 이동합니다.");
      nav("/");
    }
  }, []);

  const [beforeSendMail, setBeforeSendMail] = useState<boolean>(true);

  const accessType = "register";
  const accessText = "회원가입";

  const reqVerification = () => {
    const url = `${process.env.REACT_APP_API_SERVER}/email`;
    const userData = {
      email: email,
    };
    console.log("userdata: ", userData);
    /* !!!!!!!!!!!!!!!!!테스트할 때 예외처리 우회용 주석!! 아무 메일 넣고 인증코드는 빈값으로 두기
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
      */
    setBeforeSendMail(!beforeSendMail);
  };

  const submitFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_SERVER}/member/signup`;
    const userData = {
      email: email,
      name: name,
      pwd: pwd,
    };
    // const formData = new FormData();
    // formData.append("email", email);
    // formData.append("name", name);
    // formData.append("pwd", pwd);
    console.log(userData);
    axios
      .post(url, userData)
      .then((res) => {
        alert("회원가입 성공");
        console.log("then res.data: ", res.data);
        setEmail("");
        setName("");
        setPwd("");
        // 회원가입>로그인 상황에선 로그인 후 이전 페이지로 자동 이동하는 대신 메인페이지로 이동
        nav("/login", { replace: true });
      })
      .catch((err) => {
        console.log(err.response.data.msg);
        console.log("err: ", err);
      });
  };
  return (
    <section>
      <h2 className="title">{accessText}</h2>
      {beforeSendMail ? (
        <>
          <article className="accountInputForm">
            <form className="inputContainer">
              <EmailInput accessType={accessType} />
              <NameInput accessType={accessType} />
              <PwdInput accessType={accessType} />
              <button type="button" onClick={reqVerification}>
                인증 메일 발송
              </button>
            </form>
          </article>
          <SocialAccount accessText={accessText} />
          <article className="accountLink">
            <Link to="/login">로그인</Link>
            <span> | </span>
            <Link to="/findPassword">비밀번호 찾기</Link>
          </article>
        </>
      ) : (
        <article className="accountInputForm">
          <form onSubmit={submitFunc} className="inputContainer">
            <VerificationInput />
          </form>
        </article>
      )}
    </section>
  );
}
