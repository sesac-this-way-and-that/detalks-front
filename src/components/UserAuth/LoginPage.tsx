import AccountInputForm from "./AccountInputForm";
import SocialAccount from "./SocialAccount";
import { Link } from "react-router-dom";
import { Logout } from "./userInterface";

export default function LoginPage() {
  return (
    <section>
      <AccountInputForm accessType="login" accessText="로그인" />
      <SocialAccount accessText="로그인" />
      <article>
        <Link to="/register">회원가입</Link>
        <Link to="/findPassword">비밀번호 찾기</Link>
      </article>
      <button onClick={Logout}>로그아웃 체크</button>
    </section>
  );
}
