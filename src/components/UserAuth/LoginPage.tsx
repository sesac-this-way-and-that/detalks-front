import SocialAccount from "./SocialAccount";
import "../../styles/userAuth.scss";
import { Link, useNavigate } from "react-router-dom";
import EmailInput from "./EmailInput";
import PwdInput from "./PwdInput";
import accountStore from "../../store/userStore";
import axios from "axios";
import { useEffect } from "react";
import authStore from "../../store/authStore";
import { useInfoStore } from "../../store";

export default function LoginPage() {
  const { email, pwd, setEmail, setPwd } = accountStore();
  const { authToken, setAuthToken, removeAuthToken } = authStore();
  const nav = useNavigate();

  // 로그인 토큰이 있는 유저가 페이지 진입 시 메인페이지로 이동
  // !!!!!!!!!!!!! 토큰 기능 확인 위해 임시 주석 !!!!!!!!!!!!!!!!!!
  // useEffect(() => {
  //   if (authToken) {
  //     alert("이미 로그인된 상태입니다. 메인 페이지로 이동합니다.");
  //     nav("/");
  //   }
  // }, []);

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
    const formData = new FormData();
    formData.append("email", email);
    formData.append("pwd", pwd);
    axios
      .post(url, formData)
      .then((res) => {
        console.log("then res.data: ", res.data);
        localStorage.setItem("authToken", res.data.token);
        setAuthToken(localStorage.getItem("authToken"));
        getInfo();
        alert("로그인 성공");
        setEmail("");
        setPwd("");
        nav(-1);
      })
      .catch((err) => {
        console.log("err: ", err);
        alert("로그인 실패");
      });
  };
  const token = () => {
    console.log(authToken);
  };
  const logout = () => {
    removeAuthToken();
  };
  return (
    <section>
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
      <button type="button" onClick={token}>
        토큰 체크
      </button>
      <button type="button" onClick={logout}>
        로그아웃 체크
      </button>
    </section>
  );
}
