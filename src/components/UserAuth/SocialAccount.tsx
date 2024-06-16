// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faGithub } from "@fortawesome/free-solid-svg-icons";

export default function SocialAccount(props: any) {
  const onGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_GOOGLE_OAUTH_API_SERVER}`;
  };
  return (
    <article className="socialContainer">
      <button className="googleAccountBtn" onClick={onGoogleLogin}>
        GOOGLE로 {props.accessText} 하기
      </button>
      <button className="githubAccountBtn">
        {/* <FontAwesomeIcon icon={faGithub} />  */}
        GITHUB로 {props.accessText} 하기
      </button>
    </article>
  );
}
