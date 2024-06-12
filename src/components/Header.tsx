import "../styles/header.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <section className="headerWrapper">
      <div className="headerContainer">
        <div className="headerLogoContainer">
          <a href="/">
            <img
              className="headerLogo"
              src="https://picsum.photos/seed/picsum/200/300"
              alt=""
              style={{ width: "100px", height: "50px" }}
            />
            <span>Detalks</span>
          </a>
        </div>
        <div className="headerNavigation">
          <input type="checkbox" className="toggle-menu" />
          <div className="hamburger"></div>

          <div className="searchInput">
            <input type="text" />
            <button>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
          <ul className="headerMenu">
            <li>
              <Link to="/board">질의응답</Link>
            </li>
            <li>
              <Link to="/login">로그인</Link>
            </li>
            <li>
              <Link to="/register">회원가입</Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
