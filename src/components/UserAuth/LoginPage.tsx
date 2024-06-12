import SocialAccount from "./SocialAccount";
import { Link, useNavigate } from "react-router-dom";
import { Logout } from "./userInterface";
import EmailInput from "./EmailInput";
import PwdInput from "./PwdInput";
import accountStore from "../../store/userStore";
import axios from "axios";

export default function LoginPage() {
  const { email, pwd, setEmail, setPwd } = accountStore();
  const nav = useNavigate();
  const accessType = "login";
  const accessText = "로그인";

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
        alert("로그인 성공");
        setEmail("");
        setPwd("");
        nav("/");
      })
      .catch((err) => {
        console.log("err: ", err);
        alert("로그인 실패");
      });
  };
  return (
    <section>
      <article className="accountInputForm">
        <div className="pageType">
          <div className="logo"></div>
          <p>{accessText}</p>
        </div>
        <form onSubmit={submitFunc} className="inputContainer">
          <EmailInput accessType={accessType} />
          <PwdInput accessType={accessType} />
          <button type="submit">{accessText}</button>
        </form>
      </article>
      <SocialAccount accessText={accessText} />
      <article>
        <Link to="/register">회원가입</Link>
        <span> | </span>
        <Link to="/findPassword">비밀번호 찾기</Link>
      </article>
      <button onClick={Logout}>로그아웃 체크</button>
    </section>
  );
}
