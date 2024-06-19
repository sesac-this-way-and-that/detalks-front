import { Link, useNavigate } from "react-router-dom";
import "../../styles/userAuth.scss";
import accountStore from "../../store/userStore";
import EmailInput from "./EmailInput";
import axios from "axios";
import VerificationInput from "./VerificationInput";
import { useEffect, useState } from "react";

export default function FindPasswordPage() {
  const nav = useNavigate();
  const {
    email,
    pwd,
    verificationCode,
    emailValid,
    setEmail,
    setPwd,
    setVerificationCode,
    setEmailValid,
  } = accountStore();
  const [beforeSendMail, setBeforeSendMail] = useState<boolean>(true);
  const [beforeVerification, setBeforeVerification] = useState<boolean>(true);

  // 언마운트 시 스토어 상태 초기화
  useEffect(() => {
    return () => {
      setEmail("");
      setPwd("");
      setVerificationCode("");
      setEmailValid(false);
    };
  }, []);

  const accessType = "findPw";
  const accessText = "비밀번호 찾기";

  const reqVerification = () => {
    const url = `${process.env.REACT_APP_API_SERVER}/email/password`;
    const userData = {
      email: email,
    };
    console.log("userdata: ", userData);
    if (emailValid) {
      axios
        .post(url, userData)
        .then((res) => {
          console.log("then res.data: ", res.data);
          setVerificationCode(res.data.slice(9));
          console.log("code", verificationCode, "res", res.data.slice(9));
          alert("입력한 이메일로 인증번호가 전송되었습니다.");
          setBeforeSendMail(!beforeSendMail);
        })
        .catch((err) => {
          console.log("err: ", err);
          alert("이메일 전송에 실패했습니다.");
          return;
        });
    } else {
      alert("올바른 이메일을 입력해주세요.");
    }
  };

  const submitFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${process.env.REACT_APP_API_SERVER}/member/pwd`;
    const userData = {
      email: email,
      pwd: pwd,
    };
    console.log("uuuu", userData);
    axios
      .patch(url, userData)
      .then((res) => {
        alert("비밀번호가 변경되었습니다.");
        console.log("then res.data: ", res.data);
        setEmail("");
        setPwd("");
        // 비밀번호 찾기>로그인 상황에선 로그인 후 이전 페이지로 자동 이동하는 대신 메인페이지로 이동
        // nav("/login", { replace: true });
        nav("/login", { state: "toMainPage" });
      })
      .catch((err) => {
        alert(err.response.data.msg);
        console.log("err: ", err);
      });
  };

  return (
    <section className="user-auth-page">
      <h2 className="title">{accessText}</h2>
      {beforeSendMail ? (
        <>
          <article className="accountInputForm">
            <div className="inputContainer">
              <EmailInput accessType={accessType} />
              <button type="button" onClick={reqVerification}>
                인증 메일 발송
              </button>
            </div>
          </article>
          <article className="accountLink">
            <Link to="/register">회원가입</Link>
            <span> | </span>
            <Link to="/login">로그인</Link>
          </article>
        </>
      ) : (
        <article className="accountInputForm">
          <form onSubmit={submitFunc} className="inputContainer">
            <VerificationInput
              accessText={accessText}
              accessType={accessType}
            />
          </form>
        </article>
      )}
    </section>
  );
}
