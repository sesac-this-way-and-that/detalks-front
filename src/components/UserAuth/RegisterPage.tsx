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
    emailValid,
    nameValid,
    pwdValid,
    setEmail,
    setName,
    setPwd,
    setVerificationCode,
    setEmailValid,
    setNameValid,
    setPwdValid,
  } = accountStore();
  const { authToken } = authStore();

  // 로그인 토큰이 있는 유저가 페이지 진입 시 메인페이지로 이동
  useEffect(() => {
    if (authToken) {
      alert("로그인된 상태입니다. 메인 페이지로 이동합니다.");
      nav("/");
    }
  }, []);

  // 언마운트 시 스토어 상태 초기화
  useEffect(() => {
    return () => {
      setEmail("");
      setName("");
      setPwd("");
      setVerificationCode("");
      setEmailValid(false);
      setNameValid(false);
      setPwdValid(false);
    };
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
    if (emailValid && nameValid && pwdValid) {
      /* !!!!!!!!!!!!!!!!!테스트할 때 예외처리 우회용 주석!! 아무 메일 넣고 인증코드는 빈값으로 두기
      axios
        .post(url, userData)
        .then((res) => {
          console.log("then res.data: ", res.data);
          setVerificationCode(res.data.slice(9));
          console.log("code", verificationCode, "res", res.data.slice(9));
          alert("입력한 이메일로 인증번호가 전송되었습니다.");
        })
        .catch((err) => {
          console.log("err: ", err);
          alert("이메일 전송에 실패했습니다.");
        }); 
        */
      setBeforeSendMail(!beforeSendMail);
      setEmailValid(false);
      setNameValid(false);
      setPwdValid(false);
    } else {
      alert("잘못된 입력값이 있습니다. 수정 후 다시 시도해주세요.");
    }
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
        // nav("/login", { replace: true });
        nav("/login", { state: "toMainPage" });
      })
      .catch((err) => {
        console.log("err: ", err);
        alert(err.response.data.msg);
      });
  };
  return (
    <section className="user-auth-page">
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
            <span>|</span>
            <Link to="/findPassword">비밀번호 찾기</Link>
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
