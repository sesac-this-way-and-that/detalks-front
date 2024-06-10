import AccountInputForm from "./AccountInputForm";
import SocialAccount from "./SocialAccount";

export default function RegisterPage() {
  return (
    <section>
      <AccountInputForm accessType="register" accessText="회원가입" />
      <SocialAccount accessText="회원가입" />
    </section>
  );
}
