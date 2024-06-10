export default function SocialAccount(props: any) {
  return (
    <article className="socialContainer">
      <hr />
      <p>소셜 계정으로 간편 {props.accessText}</p>
      <div className="socialButtons">
        <button>구글</button>
        <button>깃헙</button>
      </div>
    </article>
  );
}
