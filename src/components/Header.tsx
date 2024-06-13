import "../styles/header.scss";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { useInfoStore } from "../store";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userData = useInfoStore((state) => state.userInfo);
  const getInfo = useInfoStore((state) => state.getInfo);
  // const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      getInfo();
      setIsAuthenticated(true);
    }
  }, [getInfo]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8080/api/questions/search`,
        {
          params: {
            content: searchQuery,
            sortBy: "voteCount",
            page: 0,
            size: 10,
          },
        }
      );
      console.log("Search Results:", response.data);
      // history.push({
      //   pathname: "/search-results",
      //   state: { results: response.data },
      // });
    } catch (error) {
      console.error("Search Error:", error);
    }
  };

  return (
    <section className="headerWrapper">
      <div className="headerContainer container">
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

          <form className="searchInput" onSubmit={handleSearch}>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button type="submit">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </form>
          <ul className="headerMenu">
            {isAuthenticated ? (
              <li className="myname-mobile">
                <Link to="/mypage">
                  <div className="profile-img">
                    <img
                      src={
                        process.env.REACT_APP_STATIC_SERVER +
                        "/" +
                        userData?.img
                      }
                      alt={
                        process.env.REACT_APP_STATIC_SERVER +
                        "/" +
                        userData?.img
                      }
                    />
                  </div>
                  <span>{userData?.name} 님</span>
                </Link>
              </li>
            ) : (
              <></>
            )}
            <li>
              <Link to="/board">질의응답</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="myname">
                  <Link to={"/mypage/" + userData?.idx}>
                    <div className="profile-img">
                      <img
                        src={
                          process.env.REACT_APP_STATIC_SERVER +
                          "/" +
                          userData?.img
                        }
                        alt={
                          process.env.REACT_APP_STATIC_SERVER +
                          "/" +
                          userData?.img
                        }
                      />
                    </div>
                    <span>{userData?.name}</span> 님
                  </Link>
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
