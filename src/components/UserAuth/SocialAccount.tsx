export default function SocialAccount(props: any) {
  const onGoogleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };
  return (
    <article className="socialContainer">
      <hr />
      <p>소셜 계정으로 간편 {props.accessText}</p>
      <div className="socialButtons">
        <button onClick={onGoogleLogin}>구글</button>
        <button>깃헙</button>
      </div>
    </article>
  );
}
