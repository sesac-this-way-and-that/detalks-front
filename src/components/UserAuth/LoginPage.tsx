import SocialAccount from "./SocialAccount";
import "../../styles/userAuth.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import EmailInput from "./EmailInput";
import PwdInput from "./PwdInput";
import accountStore from "../../store/userStore";
import axios from "axios";
import { useEffect } from "react";
import authStore from "../../store/authStore";
import { useInfoStore } from "../../store";

export default function LoginPage() {
  const { email, pwd, setEmail, setPwd } = accountStore();
  const { authToken, setAuthToken } = authStore();
  const nav = useNavigate();
  const location = useLocation();

  // 로그인 토큰이 있는 유저가 페이지 진입 시 메인페이지로 이동
  useEffect(() => {
    if (authToken) {
      if (location.state !== "toMainPage") {
        alert("로그인된 상태입니다. 메인 페이지로 이동합니다.");
      }
      nav("/");
    }
  }, []);

  // 언마운트 시 스토어 상태 초기화
  useEffect(() => {
    return () => {
      setEmail("");
      setPwd("");
    };
  }, []);

  const accessType = "login";
  const accessText = "로그인";
  const getInfo = useInfoStore((state) => state.getInfo);
  const submitFunc = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = `${process.env.REACT_APP_API_SERVER}/member/signin`;
    const userData = {
      email: email,
      pwd: pwd,
    };
    console.log("userdata: ", userData);
    // const formData = new FormData();
    // formData.append("email", email);
    // formData.append("pwd", pwd);
    axios
      .post(url, userData)
      .then((res) => {
        console.log("then res.data: ", res.data);
        localStorage.setItem("authToken", res.data.token);
        setAuthToken(localStorage.getItem("authToken"));
        getInfo();
        // alert("로그인 성공");
        setEmail("");
        setPwd("");
        if (location.state === "toMainPage") {
          nav("/");
        }
        nav(-1);
      })
      .catch((err) => {
        console.log("err: ", err);
        alert("로그인에 실패했습니다.");
      });
  };
  return (
    <section className="user-auth-page">
      <h2 className="title">{accessText}</h2>
      <article className="accountInputForm">
        <form onSubmit={submitFunc} className="inputContainer">
          <EmailInput accessType={accessType} />
          <PwdInput accessType={accessType} />
          <button type="submit">{accessText}</button>
        </form>
      </article>
      <SocialAccount accessText={accessText} />
      <article className="accountLink">
        <Link to="/register">회원가입</Link>
        <span> | </span>
        <Link to="/findPassword">비밀번호 찾기</Link>
      </article>
    </section>
  );
}
