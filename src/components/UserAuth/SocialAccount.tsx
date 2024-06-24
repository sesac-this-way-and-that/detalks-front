import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function SocialAccount(props: any) {
  const onGoogleLogin = () => {
    window.location.href = `${process.env.REACT_APP_GOOGLE_OAUTH_API_SERVER}`;
  };
  return (
    <article className="socialContainer">
      <button className="googleAccountBtn" onClick={onGoogleLogin}>
        <FontAwesomeIcon icon={faGoogle} />
        &nbsp; GOOGLE로 {props.accessText} 하기
      </button>
    </article>
  );
}
