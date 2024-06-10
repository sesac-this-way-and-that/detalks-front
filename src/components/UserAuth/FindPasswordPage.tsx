import accountStore from "../../store/userStore";
import AccountInputForm from "./AccountInputForm";

export default function FindPasswordPage() {
  return (
    <section>
      <AccountInputForm accessType="findPw" accessText="비밀번호 찾기" />
    </section>
  );
}
