import "../styles/header.scss";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for token in localStorage (or any other method you use for storing the token)
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    // Remove token from localStorage (or any other method you use for storing the token)
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  return (
    <section className="headerWrapper">
      <div className="headerContainer">
        <div className="headerLogoContainer">
          <Link to="/">
            <img
              className="headerLogo"
              src="https://picsum.photos/seed/picsum/200/300"
              alt="Logo"
              style={{ width: "100px", height: "50px" }}
            />
            <span>Detalks</span>
          </Link>
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
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/mypage">마이페이지</Link>
                </li>
                <li>
                  <a href="#" onClick={handleLogout}>
                    로그아웃
                  </a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">로그인</Link>
                </li>
                <li>
                  <Link to="/register">회원가입</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}
