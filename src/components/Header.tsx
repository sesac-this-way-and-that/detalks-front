import "../styles/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <section className="headerWrapper">
      <div className="headerLogoContainer">
        <a href="#">
          <img
            className="headerLogo"
            src="https://picsum.photos/seed/picsum/200/300"
            alt=""
            style={{ width: "100px", height: "50px" }}
          />
        </a>
      </div>
      <div className="headerNavigation">
        <input type="checkbox" className="toggle-menu" />
        <div className="hamburger"></div>

        <ul className="headerMenu">
          <div className="searchInput">
            <input type="text" />
            <button>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <li>
            <a href="">질의응답</a>
          </li>
          <li>
            <a href="">로그인</a>
          </li>
          <li>
            <a href="">회원가입</a>
          </li>
        </ul>
      </div>
    </section>
  );
}
